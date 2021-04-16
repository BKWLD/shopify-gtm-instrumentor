# Deps
import axios from 'axios'

# Main class, which accepts configuration in it's constructor and exposes
# helper methods
export default class ShopifyGtmInstrumentor

	# Save settings and hydrate vars
	constructor: ({
		@debug = false
		@storeUrl = process.env.SHOPIFY_URL
		@storefrontToken = process.env.SHOPIFY_STOREFONT_TOKEN
		@currencyCode = 'USD'
	} = {})->
		@occurances = []


	# API #######################################################################

	# A view of a product element
	productImpression: (variantPayload, { el, list, position } = {}) ->

		# Get variant
		return unless flatVariant = await @getFlatVariant variantPayload

		# Make defaults
		position = getElPosition el if el and !position?

		# Fire event
		eventPusher = => @pushEvent 'Product Impression', {
			...flatVariant
			ecommerce: impressions: [{
				...@makeUaProductFieldObject flatVariant
				list
				position
			}]
		}
		if el then whenFirstInViewport el, eventPusher else eventPusher()

	# A click on a product
	productClick: (variantPayload, { el, list, position, clickEvent } = {}) ->

		# Prevent navigation
		if clickUrl = clickEvent?.currentTarget?.href
		then clickEvent?.preventDefault()

		# Get variant
		return unless flatVariant = await @getFlatVariant variantPayload

		# Make defaults
		position = getElPosition el if el and !position?

		# Fire event
		@pushEvent 'Product Click', {
			...flatVariant
			ecommerce: click: {
				...(unless list then {} else {
					actionField: { list }
				})
				products: [{
					...@makeUaProductFieldObject flatVariant
					position
				}]
			}
		}

		# Finish navigation
		if clickUrl then window.location = clickUrl

	# Typically used for view of PDP page
	viewProductDetails: (variantPayload) ->

		# Get variant
		return unless flatVariant = await @getFlatVariant variantPayload

		# Fire event
		@pushEvent 'View Product Details', {
			...flatVariant
			ecommerce: detail: products: [
				@makeUaProductFieldObject flatVariant
			]
		}

	# Used whenver there is a positive change in the quantity of a product in
	# the cart.
	addToCart: (variantPayload, quantity) ->
		@updateQuantity variantPayload, quantity, 'Add to Cart', 'add'

	# Used whenever there is a negative change in the quantity of a product in
	# the cart.
	removeFromCart: (variantPayload, quantity) ->
		@updateQuantity variantPayload, quantity, 'Remove from Cart', 'remove'

	# Used both fire the `Update Quantity` event but also as a helper for the
	# add and remove methods.
	updateQuantity: (variantPayload, quantity,
		gtmEvent = 'Update Quantity', ecommerceAction) ->

		# Get variant
		return unless flatVariant = await @getFlatVariant variantPayload

		# Fire the event
		@pushEvent gtmEvent, {
			...flatVariant
			quantity

			# Conditionally add enhanced ecommerce action
			...(unless ecommerceAction then {} else {
				ecommerce:
					currencyCode: @currencyCode
					[ecommerceAction]: products: [{
						...@makeUaProductFieldObject flatVariant
						quantity
					}]
			})
		}

	# Fire an event with the current state of the cart
	cartUpdated: (checkoutPayload) ->

		# Get checkout
		return unless simpleCheckout = await @getSimplifiedCheckout checkoutPayload

		# Fire event
		@pushEvent 'Cart Updated', simpleCheckout

	# Fire an event with the current step of the checkout process
	checkout: (checkoutPayload, checkoutStep) ->

		# Get checkout
		return unless simpleCheckout = await @getSimplifiedCheckout checkoutPayload

		# Fire event
		@pushEvent 'Checkout', {
			checkoutStep
			...simpleCheckout
		}

	# Notify of final checkout, using array of variant data from liquid
	purchase: (checkoutPayload) ->

		# Get checkout
		return unless simpleCheckout = await @getSimplifiedCheckout checkoutPayload

		# Fire event
		@pushEvent 'Purchase', simpleCheckout


	# VARIANT DATA ##############################################################

	# Take a variantPayload, which may be an id or an object, and return an
	# object that can be easily consumed by GTM.
	getFlatVariant: (variantPayload) ->

		# Conditioally fetch from storefront API
		variant = if typeof variantPayload == 'object'
		then variantPayload
		else await @fetchVariant variantPayload

		# Validate the variant and return
		unless variant then console.error 'Variant not found', variantPayload
		return @makeFlatVariant variant

	# Lookup a product variant by id. Id may be a simple number or a
	# gid://shopify string
	fetchVariant: (variantId) ->
		variantId = getShopifyId variantId
		result = await @queryStorefrontApi
			variables: id: btoa 'gid://shopify/ProductVariant/' + variantId
			query: fetchVariantQuery
		return result.node

	# Make flat object from a variant with nested product data
	makeFlatVariant: (variant) ->
		product = variant.product

		# Product level info
		productTitle: product.title
		productVariantTitle: "#{product.title} - #{variant.title}"
		productType: product.productType || product.type
		productVendor: product.vendor
		productUrl: (productUrl = "#{@storeUrl}/products/#{product.handle}")

		# Variant level data
		sku: variant.sku
		price: variant.price
		compareAtPrice: variant.compareAtPrice
		variantId: (variantId = getShopifyId variant.id)
		variantTitle: variant.title
		variantImage: variant.image?.originalSrc || variant.image
		variantUrl: "#{productUrl}?variant=#{variantId}"

	# Convert a Shopify variant object to a UA productFieldObject. I'm
	# comibing the product and variant name because that's what Shopify does
	# with it's own events.
	# https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce#product-data
	makeUaProductFieldObject: (flatVariant) ->
		id: flatVariant.sku
		name: flatVariant.productVariantTitle
		brand: flatVariant.productVendor
		category: flatVariant.productType
		variant: flatVariant.variantTitle
		price: flatVariant.price


	# CHECKOUT DATA #############################################################

	# Take a checkoutPayload, which may be an id or an object, and return the
	# Shopify checkout object that has been simplified a bit.
	getSimplifiedCheckout: (checkoutPayload) ->

		# Conditioally fetch from storefront API
		checkout = if typeof checkoutPayload == 'object'
		then checkoutPayload
		else await @fetchCheckout checkoutPayload

		# Validate the checkout and return
		unless checkout then console.error 'Checkout not found', checkoutPayload
		return @makeSimplifiedCheckout checkout

	# Lookup a product variant by id. Id may be a simple number or a
	# gid://shopify string
	fetchCheckout: (checkoutId) ->
		checkoutId = getShopifyId checkoutId
		result = await @queryStorefrontApi
			variables: id: btoa 'gid://shopify/Checkout/' + checkoutId
			query: fetchCheckoutQuery
		return result.node

	# Reduce
	makeSimplifiedCheckout: (checkout) ->

		# Flatten nodes that contain line items
		if checkout.lineItems.edges
		then checkout.lineItems = checkout.lineItems.edges.map ({ node }) -> node

		# Return the simplified object
		checkoutId: getShopifyId checkout.id
		checkoutUrl: checkout.webUrl
		subtotalPrice: checkout.subtotalPrice
		totalPrice: checkout.totalPrice
		lineItems: checkout.lineItems.map (lineItem) => {
			lineItemId: getShopifyId lineItem.id
			quantity: lineItem.quantity
			...@makeFlatVariant lineItem.variant
		}

	# STOREFRONT API ############################################################

	# Query Storefront API
	queryStorefrontApi: (payload) ->
		response = await axios
			url: "#{@storeUrl}/api/2021-04/graphql"
			method: 'post'
			headers:
				'Accept': 'application/json'
				'Content-Type': 'application/json'
				'X-Shopify-Storefront-Access-Token': @storefrontToken
			data: payload
		if response.data.errors
		then throw new StorefrontError response.data.errors, payload
		return response.data.data


	# DATALAYER WRITING #########################################################

	# Push GTM dataLayer event
	pushEvent: (name, payload) ->
		if @debug then console.debug "'#{name}'", payload
		window.dataLayer = [] unless window.dataLayer
		window.dataLayer.push {
			event: name
			firstOccurance: @isFirstOccurance name
			...payload
		}

	# Return whether this is the first time the event has fired. This can be
	# helpeful in conjunction to prevent double triggering from events that are
	# also fired in the intial page response from Shopify, like Page Views.
	isFirstOccurance: (eventName) ->
		return false if eventName in @occurances
		@occurances.push eventName
		return true

# STOREFRONT QUERIES ##########################################################

# Product Variant fragment
export productVariantFragment = '''
	fragment variant on ProductVariant {
		id
		sku
		title
		price
		compareAtPrice
		image { originalSrc }
		product {
			title
			handle
			productType
			vendor
		}
	}
'''

# Graphql query to fetch a variant by id
export fetchVariantQuery = """
	query($id: ID!) {
		node(id: $id) {
			...variant
		}
	}
	#{productVariantFragment}
"""

# Graphql query to fetch a checkout by id
export fetchCheckoutQuery = """
	query($id: ID!) {
		node(id: $id) {
			... on Checkout {
				id
				webUrl
				subtotalPrice
				totalPrice
				lineItems (first: 250) {
					edges {
						node {
							... on CheckoutLineItem {
								id
								quantity
								variant { ...variant }
							}
						}
					}
				}
			}
		}
	}
#{productVariantFragment}
"""


# NON-INSTANCE HELPERS ########################################################

# Error object with custom handling
class StorefrontError extends Error
	name: 'StorefrontError'
	constructor: (errors, payload) ->
		super errors.map((e) -> e.debugMessage || e.message).join ', '
		@errors = errors.map (e) -> JSON.stringify e
		@payload = payload

# Get the id from a Shoify gid:// style id.  This strips everything but the
# last part of the string.  So gid://shopify/ProductVariant/34641879105581
# becomes 34641879105581
# https://regex101.com/r/3FIplL/1
getShopifyId = (id) ->
	return id if String(id).match /^\d+$/ # Already simple id
	id = atob id unless id.match /^gid:\/\// # De-base64
	return id.match(/\/([^\/]+)$/)?[1] # Get the id from the gid

# Get the position of an element with respect to it's parent
# https://stackoverflow.com/a/5913984/59160
getElPosition = (el) ->
	i = 1 # The first position will be `1`
	while (el = el.previousElementSibling) != null then i++
	return i

# Fire callback when in viewport. Not exposing a way to manually disconnect or
# unobserve because it _should_ be garbage collected when el is removed.
# https://stackoverflow.com/a/51106262/59160
whenFirstInViewport = (el, callback) ->
	observer = new IntersectionObserver ([{ isIntersecting }]) ->
		return unless isIntersecting
		observer.disconnect()
		callback()
	observer.observe el

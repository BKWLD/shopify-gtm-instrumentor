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

	# Typically used for view of PDP page
	viewProductDetails: (variantPayload) ->

		# Get variant
		variant = await @getVariantFromPayload variantPayload

		# Fire event
		@pushEvent 'View Product Details', {
			...(flatVariant = @makeFlatVariant variant)
			ecommerce: detail: products: [
				@makeUaProductFieldObject flatVariant
			]
		}

	# Used whenver there is a positive change in the quantity of a product in
	# the cart.
	addProductToCart: (variantPayload, quantity) ->
		@updateQuantity variantPayload, quantity, 'Add to Cart', 'add'

	# Used whenever there is a negative change in the quantity of a product in
	# the cart.
	removeProductFromCart: (variantPayload, quantity) ->
		@updateQuantity variantPayload, quantity, 'Remove from Cart', 'remove'

	# Used both fire the `Update Quantity` event but also as a helper for the
	# add and remove methods.
	updateQuantity: (variantPayload, quantity,
		gtmEvent = 'Update Quantity', ecommerceAction) ->

		# Get variant
		variant = await @getVariantFromPayload variantPayload

		# Fire the event
		@pushEvent gtmEvent, {
			...(flatVariant = @makeFlatVariant variant)

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

	# Notify of final checkout, using array of variant data from liquid
	purchase: (lineItems) -> @pushEvent 'Purchase', { lineItems }


	# DATA HELPERS ##############################################################

	# Take a variantPayload, which may be an id or an object, and return the
	# Shopify variant object, ideally with nsted product data.
	getVariantFromPayload: (variantPayload) ->
		if typeof variantPayload == 'object'
		then variantPayload
		else @fetchVariant variantPayload

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

		# Variant level data
		sku: variant.sku
		variantId: getShopifyId variant.id
		variantTitle: variant.title
		price: variant.price

		# Product level info
		productTitle: variant.product?.title
		productType: variant.product?.productType || variant.product?.type
		productVendor: variant.product?.vendor

	# Convert a Shopify variant object to a UA productFieldObject. I'm
	# comibing the product and variant name because that's what Shopify does
	# with it's own events.
	# https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce#product-data
	makeUaProductFieldObject: (flatVariant) ->
		id: flatVariant.sku
		name: flatVariant.productTitle + ' - ' + flatVariant.variantTitle
		brand: flatVariant.productVendor
		category: flatVariant.productType
		variant: flatVariant.variantTitle
		price: flatVariant.price


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

# NON-INSTANCE HELPERS ########################################################

# Error object with custom handling
class StorefrontError extends Error
	name: 'StorefrontError'
	constructor: (errors, payload) ->
		super errors.map((e) -> e.debugMessage || e.message).join ', '
		@errors = errors.map (e) -> JSON.stringify e
		@payload = payload

# Graphql query to fetch a variant by id
fetchVariantQuery = '''
	query ($id: ID!) {
		node(id: $id) {
			... on ProductVariant {
				id
				sku
				title
				price
				product {
					title
					productType
					vendor
				}
			}
		}
	}
'''

# Get the id from a Shoify gid:// style id.  This strips everything but the
# last part of the string.  So gid://shopify/ProductVariant/34641879105581
# becomes 34641879105581
export getShopifyId = (id) ->
	return id if String(id).match /^\d+$/ # Already simple id
	id = atob id unless id.match /^gid:\/\// # De-base64
	return id.match(/\/(\w+)$/)?[1] # Get the id from the gid

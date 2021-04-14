# Main class, which accepts configuration in it's constructor and exposes
# helper methods
export default class ShopifyGtmInstrumentor

	# Save settings and hydrate vars
	constructor: ({
		@debug = false
	} = {})->
		@occurances = []

	# Typically used for view of PDP page. If the payload is a string, it is
	# treated as a Shopify id and the variant will be fetched via Storefront
	# API. If an object, it's expected to be a Shopify variant is is mapped
	# to the Product Data schema
	viewProductDetails: (payload) ->
		variant = if typeof payload == 'object' then payload
		else @fetchVariant payload
		@pushEvent 'View Product Details', {
			...(flatVariant = @makeFlatVariant variant)
			ecommerce: detail: products: [
				@makeUaProductFieldObject flatVariant
			]
		}

	# Make flat object from a variant with nested product data
	makeFlatVariant: (variant) ->

		# Variant level data
		sku: variant.sku
		variantId: variant.id
		variantTitle: variant.title
		price: variant.price

		# Product level info
		productTitle: variant.product?.title
		productVendor: variant.product?.vendor
		productType: variant.product?.productType || variant.product?.type

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

	# Lookup a product variant by id. Id may be a simple number or a
	# gid://shopify string
	fetchVariant: (variantId) ->
		throw 'fetchProductData not currently implemented'

	# Push GTM dataLayer event
	pushEvent: (name, payload) ->
		console.log 'pushEvent'
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

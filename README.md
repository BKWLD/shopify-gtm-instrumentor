# shopify-gtm-instrumentor

This package contains helper methods for sending standardized dataLayer events from Shopify to GTM. The API is modeled after the [Enhanced Ecommerce Data Types and Actions](https://developers.google.com/tag-manager/enhanced-ecommerce).

It expects that you'll be using [Shopify's own Enhanced Ecommerce support](https://help.shopify.com/en/manual/reports-and-analytics/google-analytics/google-analytics-setup#enhanced) wherever possible (like for Checkout events or the initial Product Detail impression on Shopify hosted product pages).

This package is designed to supplement that integration for other uses cases like:

- Firing client side Product Detail Impressions when interacting with a variant selector
- Firing Add / Remove from Cart events from headless ecommerce implementations
- Making it easy to create Enhanced Ecommerce dataLayer objects for supported actions.

## Setup

1. Install the package

```
yarn add shopify-gtm-instrumentor
```

2. Enable [Shopify's Enhanced Ecommerce support](https://help.shopify.com/en/manual/reports-and-analytics/google-analytics/google-analytics-setup#enhanced)

3. Enable "Enable Enhanced Ecommerce Features" in GTM for your Google Analytics Settings.

![](https://p-9WF55W9.t1.n0.cdn.getcloudapp.com/items/bLuAgLLl/2c0a0206-62f3-4c0c-a404-6df9698890ed.jpg?v=6adefdcd1403bc1101b8be17048238e4)

4. Include the [checkout-snippet.liquid](./checkout-snippet.liquid) in your checkout.liquid.

## Usage

Instantiate this package like:

```js
const gtmEcomm = new ShopifyGtmInstrumentor({
  currencyCode: 'EUR'
})
```

The constructor takes these options:

- `debug` - If `true`, emits `console.debug` lines with the pushed events.
- `storeUrl` - Your 'https://mystore.myshopify.com' style Shopify URL. Defaults to `process.env.SHOPIFY_URL`.
- `storefrontToken` - A Storefront API token with permission to read products.  Defaults to `process.env.SHOPIFY_STOREFONT_TOKEN`.
- `currencyCode` - Defaults to `USD`.

Implemented methods described below:

#### [Product Impressions](https://developers.google.com/tag-manager/enhanced-ecommerce#product-impressions)

Used any time a product is displayed, like a product card.

```js
gtmEcomm.productImpression(variantPayload, {
  el: null, // DOM Element
  list: null, // String
  position: null, // String
})
```

- `variantPayload` - Either:
  - A Shopify numeric id, in which case the full variant is looked up via the Storefront API
  - A Shopify `gid://shopify/ProductVariant/###` style id, which will also be looked up via Storefront API
  - A [Shopify ProductVariant object](https://shopify.dev/docs/storefront-api/reference/products/productvariant) with `product` property.  _Not recommended since it requires particular fields to be present._

- `options` - Supports the following keys
  - `el` - Optional DOM Element. If supplied, an IntersectionObserver will be attached to the element that triggers the event only once (and only once) the element has entered the viewport.
  - `list` - Optional name of the list or collection to which the product belongs.
  - `position` - Optional position in a list or collection.  If `el` is provided and `position` is undefined, defaults to the index of the element relative to it's parent. 1-based.

Pushes an object to the dataLayer that looks like:

```js
{
  event: 'Product Impression',
  firstOccurance: true,
  sku: 'sku-abc',
  variantId: '123',
  variantTitle: 'Black',
  variantImage: 'https://cdn.shopify.com/s/files/...',
  variantUrl: 'https://www.shop.com/product/great-t-shirt?variant=123',
  price: 18.99,
  compareAtPrice: 20.99,
  productTitle: 'Great T-Shirt',
  productVariantTitle: 'Great T-Shirt - Black',
  productType: 'Shirts',
  productVendor: 'Bukwild',
  productUrl: 'https://www.shop.com/product/great-t-shirt',
  ecommerce: {
    impressions: [
      {
        id: 'sku-abc',
        name: 'Great T-Shirt - Black',
        brand: 'Bukwild',
        category: 'Shirts',
        variant: 'Black',
        price: 18.99
        list: 'Shirts Collection',
        position: 3
      }
    ]
  }
}
```


#### [Product Clicks](https://developers.google.com/tag-manager/enhanced-ecommerce#product-clicks)

```js
gtmEcomm.productClick(variantPayload, options)
```

Used when a user clicks on a product, like to go to it's detail view.

- `variantPayload` - Described above

- `options` - Supports the following keys:
  - `el` - Optional DOM Element. If supplied, will be used to calulate the `position` by comparing the element's index relative it's parent.
  - `list` - Optional name of the list or collection to which the product belongs.
  - `position` - Optional position in a list or collection, 1-based.
  - `clickEvent` - Optionally pass the click event object here to wait to change page until the event has been pushed.

Pushes an object to the dataLayer that looks like:

```js
{
  event: 'Product Click',
  firstOccurance: true,
  sku: 'sku-abc',
  variantId: '123',
  variantTitle: 'Black',
  variantImage: 'https://cdn.shopify.com/s/files/...',
  variantUrl: 'https://www.shop.com/product/great-t-shirt?variant=123',
  price: 18.99,
  compareAtPrice: 20.99,
  productTitle: 'Great T-Shirt',
  productVariantTitle: 'Great T-Shirt - Black',
  productType: 'Shirts',
  productVendor: 'Bukwild',
  productUrl: 'https://www.shop.com/product/great-t-shirt',
  ecommerce: {
    click: {
      actionField: { list: 'Shirts Collection'},
      products: [
        {
          id: 'sku-abc',
          name: 'Great T-Shirt - Black',
          brand: 'Bukwild',
          category: 'Shirts',
          variant: 'Black',
          price: 18.99
          position: 3
        }
      ]
    }
  }
}
```


#### [Product Detail Impressions](https://developers.google.com/tag-manager/enhanced-ecommerce#details)

Used on product detail pages whenever the variant changes.

```js
gtmEcomm.viewProductDetails(variantPayload)
```

- `variantPayload` - See above

Pushes an object to the dataLayer that looks like:

```js
{
  event: 'View Product Details',
  firstOccurance: true,
  sku: 'sku-abc',
  variantId: '123',
  variantTitle: 'Black',
  variantImage: 'https://cdn.shopify.com/s/files/...',
  variantUrl: 'https://www.shop.com/product/great-t-shirt?variant=123',
  price: 18.99,
  compareAtPrice: 20.99,
  productTitle: 'Great T-Shirt',
  productVariantTitle: 'Great T-Shirt - Black',
  productType: 'Shirts',
  productVendor: 'Bukwild',
  productUrl: 'https://www.shop.com/product/great-t-shirt',
  ecommerce: {
    detail: {
      products: [
        {
          id: 'sku-abc',
          name: 'Great T-Shirt - Black',
          brand: 'Bukwild',
          category: 'Shirts',
          variant: 'Black',
          price: 18.99
        }
      ]
    }
  }
}
```

The `firstOccurance` property will be `true` the first time this method is called in a given request and `false` for the remainder.  You would use this when a product detail page is served by Shopify and the Shopify Enhanced Ecommerce integration will be firing the inital event but you will be firing additional events as a user interacts with a variant selector. For example:

![](https://p-9WF55W9.t1.n0.cdn.getcloudapp.com/items/jkuLeNJ7/e26dc5b9-fea3-4c81-b80f-666e12571f7f.jpg?v=f198b8de6a95af66c4789f1bc44ffdfa)

#### [Add / Remove from Cart](https://developers.google.com/tag-manager/enhanced-ecommerce#cart)

Used when products are added or removd from the cart.

```js
gtmEcomm.addToCart(variantPayload, quantity)
gtmEcomm.removeFromCart(variantPayload, quantity)
```

- `variantPayload` - See above
- `quantity` - The quantity _changed_.  So, if updating the quanity from 2 to 5, the value should be `3`.  If deleting a line item with a quantity of 2, you would use `removeProductFromCart` with a quantity of `2`.

Pushes an object to the dataLayer that looks like:

```js
{
  event: 'Add to Cart',
  firstOccurance: true,
  quantity: 1,
  sku: 'sku-abc',
  variantId: '123',
  variantTitle: 'Black',
  variantImage: 'https://cdn.shopify.com/s/files/...',
  variantUrl: 'https://www.shop.com/product/great-t-shirt?variant=123',
  price: 18.99,
  compareAtPrice: 20.99,
  productTitle: 'Great T-Shirt',
  productVariantTitle: 'Great T-Shirt - Black',
  productType: 'Shirts',
  productVendor: 'Bukwild',
  productUrl: 'https://www.shop.com/product/great-t-shirt',
  ecommerce: {
    add: {
      currencyCode: 'USD',
      products: [
        {
          id: 'sku-abc',
          name: 'Great T-Shirt - Black',
          brand: 'Bukwild',
          category: 'Shirts',
          variant: 'Black',
          price: 18.99,
          quantity: 1
        }
      ]
    }
  }
}
```

_or_ like this

```js
{
  event: 'Remove from Cart',
  firstOccurance: true,
  quantity: 1,
  sku: 'sku-abc',
  variantId: '123',
  variantTitle: 'Black',
  variantImage: 'https://cdn.shopify.com/s/files/...',
  variantUrl: 'https://www.shop.com/product/great-t-shirt?variant=123',
  price: 18.99,
  compareAtPrice: 20.99,
  productTitle: 'Great T-Shirt',
  productVariantTitle: 'Great T-Shirt - Black',
  productType: 'Shirts',
  productVendor: 'Bukwild',
  productUrl: 'https://www.shop.com/product/great-t-shirt',
  ecommerce: {
    remove: {
      currencyCode: 'USD',
      products: [
        {
          id: 'sku-abc',
          name: 'Great T-Shirt - Black',
          brand: 'Bukwild',
          category: 'Shirts',
          variant: 'Black',
          price: 18.99,
          quantity: 1
        }
      ]
    }
  }
}
```

See above for info on `firstOccurance`.


### Cart Updated

Used to send the current checkout / cart state to GTM.  This is not an explicit Enhanced Ecommerce event but many GTM want this data.

```js
gtmEcomm.cartUpdated(checkoutPayload)
```

- `checkoutPayload` - Either a Checkout ID that can be resolved by the Storefront API (recommende) or an object that is formed to _look_ like one (like the `window.CHECKOUT_LINE_ITEMS` object, described below).

Pushes an object to the dataLayer that looks like:

```js
{
  event: 'Cart Updated',
  firstOccurance: true,
  checkoutId: '789',
  checkoutUrl: 'https://www.shop.com/.../checkouts/...',
  subtotalPrice: 18.99
  totalPrice: 18.99
  lineItems: [
    {
      lineItemId: '456',
      quantity: 1
      sku: 'sku-abc',
      variantId: '123',
      variantTitle: 'Black',
      variantImage: 'https://cdn.shopify.com/s/files/...',
      variantUrl: 'https://www.shop.com/product/great-t-shirt?variant=123',
      price: 18.99,
      compareAtPrice: 20.99,
      productTitle: 'Great T-Shirt',
      productVariantTitle: 'Great T-Shirt - Black',
      productType: 'Shirts',
      productVendor: 'Bukwild',
      productUrl: 'https://www.shop.com/product/great-t-shirt',
    }
  ]

}
```


#### [Purchases](https://developers.google.com/tag-manager/enhanced-ecommerce#purchases)

Should be triggered on the thank you page after checkout.

```js
if (window.Shopify &&
  window.Shopify.Checkout &&
  window.Shopify.Checkout.page == 'thank_you') {
  gtmEcomm.purchase(window.CHECKOUT_LINE_ITEMS)
}
```

The `CHECKOUT_LINE_ITEMS` array is created by [checkout-snippet.liquid](./checkout-snippet.liquid) (I couldn't find a way to query this besides outputting from liquid, would love to _not_ couple it with a liquid snippet...)

This isn't designed to trigger the Enhanced Ecommerce `purchase` action; we're expecting Shopify's Enhanced Ecommerce integration to fire this.  Instead, this event is designed to be useful for firing other conversion type tags from GTM.

It creates a payload like:

```js
{
  event: 'Purchase'
  lineItems: [
    {
      quantity: 1,
      variant: {
        id: 123,
        sku: 'sku-abc',
        title: 'Black',
        price: '18.99',
      },
      product: {
        title: 'Great T-Shirt',
        type: 'Shirt',
        vendor: 'Bukwild',
      },
    }
  ]
}
```

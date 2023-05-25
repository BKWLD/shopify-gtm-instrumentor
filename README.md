# shopify-gtm-instrumentor

This package contains helper methods for sending standardized dataLayer events from Shopify to GTM. The API is modeled after the [Enhanced Ecommerce Data Types and Actions](https://developers.google.com/tag-manager/enhanced-ecommerce).

It expects that you'll be using [Shopify's own Enhanced Ecommerce support](https://help.shopify.com/en/manual/reports-and-analytics/google-analytics/google-analytics-setup#enhanced) wherever possible (like for Checkout events or the initial Product Detail impression on Shopify hosted product pages).

This package is designed to supplement that integration for other uses cases like:

- Firing client side Product Detail Impressions when interacting with a variant selector
- Firing Add / Remove from Cart events from headless ecommerce implementations
- Making it easy to create Enhanced Ecommerce dataLayer objects for supported actions.

*Methods*:

- [`productImpression`](#product-impressions)
- [`productClick`](#product-clicks)
- [`viewProductDetails`](#product-detail-impressions)
- [`addToCart`](#add--remove-from-cart)
- [`removeFromCart`](#add--remove-from-cart)
- [`cartUpdated`](#cart-updated)
- [`checkout`](#checkout)
- [`purchase`](#purchases)
- [`identifyCustomer`](#customer-info)

## Setup

1. Install the package

```
yarn add shopify-gtm-instrumentor
```

2. Enable [Shopify's Enhanced Ecommerce support](https://help.shopify.com/en/manual/reports-and-analytics/google-analytics/google-analytics-setup#enhanced)

3. Enable "Enable Enhanced Ecommerce Features" in GTM for your Google Analytics Settings.

![](https://p-9WF55W9.t1.n0.cdn.getcloudapp.com/items/bLuAgLLl/2c0a0206-62f3-4c0c-a404-6df9698890ed.jpg?v=6adefdcd1403bc1101b8be17048238e4)

4. Include the [checkout-snippet.liquid](./checkout-snippet.liquid) in your checkout.liquid.

#### Optional

- Import the [variables-and-triggers.json](./gtm-workspace-scaffold/variables-and-triggers.json) file into your GTM container to easily create all GTM DataLayer variables.

![](https://p-9WF55W9.t1.n0.cdn.getcloudapp.com/items/DOuB6Wmq/ccf85884-1c74-4fa1-9a70-001cbbbb98dd.jpg?v=74e1d13c869f1c1c3c375486cb7d2960)

#### Optional (GA4)

- Set the `disableEcommerceProperty` option to true.
- Import the [ga4.json](gtm-workspace-scaffold/ga4.json) file into your GTM container to create tags for firing GA4 ecommerce events.
- Per [this article](https://www.lovesdata.com/blog/google-analytics-4-shopify) set `myshopify.com` as an "Unwanted Referral" in your data stream.

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
- `disableEcommerceProperty` - If `true`, removes the `ecommerce` property from the object which is used by [UA Enhanced Commerce](https://developers.google.com/tag-manager/enhanced-ecommerce). You would enable this if you were using GA4 and want to use explicit tags, like those in [ga4-tags.json](./gtm-workspace-scaffold/ga4-tags.json)
- `enableCheckoutEcommerceProperty` - If `true`, adds `ecommerce` properties to `Checkout` and `Purchase` events.  This is diabled by default because it's expected that you'd use Shopify's Google Analytics integration for this.  However, if you are _only_ using GA4 you may want to use this to support 3rd party GTM Tags that are expecting this property to exist.

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
  productId: '456',
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
        price: 18.99,
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
  productId: '456',
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
          price: 18.99,
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
  productId: '456',
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

Used when products are added or removed from the cart.

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
  productId: '456',
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
  productId: '456',
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
gtmEcomm.cartUpdated(checkoutOrCartPayload)
```

- `checkoutOrCartPayload` - Either a [Cart](https://shopify.dev/api/storefront/reference/cart/cart) or [Checkout](https://shopify.dev/api/storefront/reference/checkouts/checkout) ID that can be resolved by the Storefront API (recommended) or an object that is formed to _look_ like one (like the `window.CHECKOUT_LINE_ITEMS` object, described below).

Pushes an object to the dataLayer that looks like:

```js
{
  event: 'Cart Updated',
  firstOccurance: true,
  checkoutId: '789',
  checkoutUrl: 'https://www.shop.com/.../checkouts/...',
  subtotalPrice: 18.99,
  totalPrice: 18.99,
  lineItems: [
    {
      lineItemId: '456',
      quantity: 1,
      sku: 'sku-abc',
      variantId: '123',
      variantTitle: 'Black',
      variantImage: 'https://cdn.shopify.com/s/files/...',
      variantUrl: 'https://www.shop.com/product/great-t-shirt?variant=123',
      price: 18.99,
      compareAtPrice: 20.99,
      productId: '456',
      productTitle: 'Great T-Shirt',
      productVariantTitle: 'Great T-Shirt - Black',
      productType: 'Shirts',
      productVendor: 'Bukwild',
      productUrl: 'https://www.shop.com/product/great-t-shirt',
    }
  ]
}
```

### [Checkout](https://developers.google.com/tag-manager/enhanced-ecommerce#checkout)

This would be triggered by each step of the checkout, like:

```js
if (window.Shopify && window.Shopify.Checkout) {
  gtmEcomm.checkout(window.CHECKOUT_FOR_GTM_INSTRUMENTOR,
    window.Shopify.Checkout.step)
}
```

_Currently_, `window.Shopify.Checkout.step` resolves to:

1. `"contact_information"`
2. `"shipping_method"`
3. `"payment_method"`
4. `"processing"`
5. `"thank_you"`
6. `undefined` (becomes undefined on reload / order page)

The `CHECKOUT_FOR_GTM_INSTRUMENTOR` array is created by [checkout-snippet.liquid](./checkout-snippet.liquid).  We can't use the Storefront API for this because Shopify destroys the cart object on checkout so we can't use the cart data for purchase events.

This isn't designed to trigger the Enhanced Ecommerce `purchase` action; we're expecting Shopify's Enhanced Ecommerce integration to fire this.  Instead, this event is designed to be useful for firing other conversion type tags from GTM.

```js
{
  event: 'Checkout',
  firstOccurance: true,
  checkoutStep: `contact_information`
  checkoutId: '789',
  checkoutUrl: 'https://www.shop.com/.../checkouts/...',
  subtotalPrice: 18.99,
  totalPrice: 18.99,
  lineItems: [
    {
      lineItemId: '456',
      quantity: 1,
      sku: 'sku-abc',
      variantId: '123',
      variantTitle: 'Black',
      variantImage: 'https://cdn.shopify.com/s/files/...',
      variantUrl: 'https://www.shop.com/product/great-t-shirt?variant=123',
      price: 18.99,
      compareAtPrice: 20.99,
      productId: '456',
      productTitle: 'Great T-Shirt',
      productVariantTitle: 'Great T-Shirt - Black',
      productType: 'Shirts',
      productVendor: 'Bukwild',
      productUrl: 'https://www.shop.com/product/great-t-shirt',
    }
  ]
}
```

If `enableCheckoutEcommerceProperty` was set to `true`, the dataLayer will also include:

```js
{
  ecommerce: {
    checkout: {
      actionField: {
        step: 'contact_information'
      },
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


#### [Purchases](https://developers.google.com/tag-manager/enhanced-ecommerce#purchases)

Should be triggered on the thank you page after checkout.

```js
if (window.Shopify &&
  window.Shopify.Checkout &&
  window.Shopify.Checkout.step == 'thank_you') {
  gtmEcomm.purchase(window.CHECKOUT_FOR_GTM_INSTRUMENTOR)
}
```

Like Checkout, this isn't intended to replace Shopify's Enhannced Ecommerce support. It creates a payload like:

```js
{
  event: 'Purchase',
  firstOccurance: true,
  checkoutId: '789',
  checkoutUrl: 'https://www.shop.com/.../checkouts/...',
  subtotalPrice: 18.99,
  totalPrice: 18.99,
  lineItems: [
    {
      lineItemId: '456',
      quantity: 1,
      sku: 'sku-abc',
      variantId: '123',
      variantTitle: 'Black',
      variantImage: 'https://cdn.shopify.com/s/files/...',
      variantUrl: 'https://www.shop.com/product/great-t-shirt?variant=123',
      price: 18.99,
      compareAtPrice: 20.99,
      productId: '456',
      productTitle: 'Great T-Shirt',
      productVariantTitle: 'Great T-Shirt - Black',
      productType: 'Shirts',
      productVendor: 'Bukwild',
      productUrl: 'https://www.shop.com/product/great-t-shirt',
    }
  ]
}
```

If `enableCheckoutEcommerceProperty` was set to `true`, the dataLayer will also include:

```js
{
  ecommerce: {
    purchase: {
      actionField: {
        id: ''
        revenue: 18.99,
        tax: 0.00,
        shipping: 0.00,
        coupon: 'one,two'
      },
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


## Customer Info
Used to send the customer info to GTM. This is not an explicit Enhanced Ecommerce event but many GTM tags want this data.

```js
gtmEcomm.identifyCustomer(customer)
```

- `customer` - An object that contains customer email and id, like:
```js
{
  id: '1234'
  zip: '90210',
  email: 'abcd@test.com',

}
```

Pushes an object to the dataLayer that looks like:

```js
{
  event: 'Identify Customer',
  customerId: '1234'
  customerZip: '90210',
  customerEmail: 'abcd@test.com',
}

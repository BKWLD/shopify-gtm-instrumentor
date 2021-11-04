"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchCheckoutQuery = exports.fetchCartQuery = exports.fetchVariantQuery = exports.productVariantFragment = exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapNativeSuper"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _axios = _interopRequireDefault(require("axios"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// Generated by CoffeeScript 2.5.1
// Deps
var ShopifyGtmInstrumentor,
    StorefrontError,
    getElPosition,
    getShopifyId,
    whenFirstInViewport,
    indexOf = [].indexOf;

// Main class, which accepts configuration in it's constructor and exposes
// helper methods
var _default = ShopifyGtmInstrumentor = /*#__PURE__*/function () {
  // Save settings and hydrate vars
  function ShopifyGtmInstrumentor() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$debug = _ref.debug,
        debug = _ref$debug === void 0 ? false : _ref$debug,
        _ref$storeUrl = _ref.storeUrl,
        storeUrl = _ref$storeUrl === void 0 ? process.env.SHOPIFY_URL : _ref$storeUrl,
        _ref$storefrontToken = _ref.storefrontToken,
        storefrontToken = _ref$storefrontToken === void 0 ? process.env.SHOPIFY_STOREFRONT_TOKEN : _ref$storefrontToken,
        _ref$currencyCode = _ref.currencyCode,
        currencyCode = _ref$currencyCode === void 0 ? 'USD' : _ref$currencyCode,
        _ref$disableEcommerce = _ref.disableEcommerceProperty,
        disableEcommerceProperty = _ref$disableEcommerce === void 0 ? false : _ref$disableEcommerce,
        _ref$enableCheckoutEc = _ref.enableCheckoutEcommerceProperty,
        enableCheckoutEcommerceProperty = _ref$enableCheckoutEc === void 0 ? false : _ref$enableCheckoutEc;

    (0, _classCallCheck2["default"])(this, ShopifyGtmInstrumentor);
    this.debug = debug;
    this.storeUrl = storeUrl;
    this.storefrontToken = storefrontToken;
    this.currencyCode = currencyCode;
    this.disableEcommerceProperty = disableEcommerceProperty;
    this.enableCheckoutEcommerceProperty = enableCheckoutEcommerceProperty;
    this.occurances = [];
  } // API #######################################################################
  // A view of a product element


  (0, _createClass2["default"])(ShopifyGtmInstrumentor, [{
    key: "productImpression",
    value: function () {
      var _productImpression = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(variantPayload) {
        var _this = this;

        var _ref2,
            el,
            list,
            position,
            eventPusher,
            flatVariant,
            _args = arguments;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _ref2 = _args.length > 1 && _args[1] !== undefined ? _args[1] : {}, el = _ref2.el, list = _ref2.list, position = _ref2.position;

                if (!(typeof window === "undefined" || window === null)) {
                  _context.next = 3;
                  break;
                }

                return _context.abrupt("return");

              case 3:
                _context.next = 5;
                return this.getFlatVariant(variantPayload);

              case 5:
                if (flatVariant = _context.sent) {
                  _context.next = 7;
                  break;
                }

                return _context.abrupt("return");

              case 7:
                if (el && position == null) {
                  // Make defaults
                  position = getElPosition(el);
                } // Fire event


                eventPusher = function eventPusher() {
                  return _this.pushEvent('Product Impression', _objectSpread(_objectSpread({}, flatVariant), {}, {
                    listName: list,
                    listPosition: position,
                    ecommerce: {
                      impressions: [_objectSpread(_objectSpread({}, _this.makeUaProductFieldObject(flatVariant)), {}, {
                        list: list,
                        position: position
                      })]
                    }
                  }));
                };

                if (!el) {
                  _context.next = 13;
                  break;
                }

                return _context.abrupt("return", whenFirstInViewport(el, eventPusher));

              case 13:
                return _context.abrupt("return", eventPusher());

              case 14:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function productImpression(_x) {
        return _productImpression.apply(this, arguments);
      }

      return productImpression;
    }() // A click on a product

  }, {
    key: "productClick",
    value: function () {
      var _productClick = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(variantPayload) {
        var _ref3,
            el,
            list,
            position,
            clickEvent,
            clickUrl,
            flatVariant,
            ref,
            _args2 = arguments;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _ref3 = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {}, el = _ref3.el, list = _ref3.list, position = _ref3.position, clickEvent = _ref3.clickEvent;

                if (!(typeof window === "undefined" || window === null)) {
                  _context2.next = 3;
                  break;
                }

                return _context2.abrupt("return");

              case 3:
                // Prevent navigation
                if (clickUrl = clickEvent != null ? (ref = clickEvent.currentTarget) != null ? ref.href : void 0 : void 0) {
                  if (clickEvent != null) {
                    clickEvent.preventDefault();
                  }
                } // Get variant


                _context2.next = 6;
                return this.getFlatVariant(variantPayload);

              case 6:
                if (flatVariant = _context2.sent) {
                  _context2.next = 8;
                  break;
                }

                return _context2.abrupt("return");

              case 8:
                if (el && position == null) {
                  // Make defaults
                  position = getElPosition(el);
                } // Fire event


                this.pushEvent('Product Click', _objectSpread(_objectSpread({}, flatVariant), {}, {
                  listName: list,
                  listPosition: position,
                  ecommerce: {
                    click: _objectSpread(_objectSpread({}, !list ? {} : {
                      actionField: {
                        list: list
                      }
                    }), {}, {
                      products: [_objectSpread(_objectSpread({}, this.makeUaProductFieldObject(flatVariant)), {}, {
                        position: position
                      })]
                    })
                  }
                })); // Finish navigation

                if (!clickUrl) {
                  _context2.next = 12;
                  break;
                }

                return _context2.abrupt("return", window.location = clickUrl);

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function productClick(_x2) {
        return _productClick.apply(this, arguments);
      }

      return productClick;
    }() // Typically used for view of PDP page

  }, {
    key: "viewProductDetails",
    value: function () {
      var _viewProductDetails = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(variantPayload) {
        var flatVariant;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!(typeof window === "undefined" || window === null)) {
                  _context3.next = 2;
                  break;
                }

                return _context3.abrupt("return");

              case 2:
                _context3.next = 4;
                return this.getFlatVariant(variantPayload);

              case 4:
                if (flatVariant = _context3.sent) {
                  _context3.next = 6;
                  break;
                }

                return _context3.abrupt("return");

              case 6:
                return _context3.abrupt("return", this.pushEvent('View Product Details', _objectSpread(_objectSpread({}, flatVariant), {}, {
                  ecommerce: {
                    detail: {
                      products: [this.makeUaProductFieldObject(flatVariant)]
                    }
                  }
                })));

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function viewProductDetails(_x3) {
        return _viewProductDetails.apply(this, arguments);
      }

      return viewProductDetails;
    }() // Used whenver there is a positive change in the quantity of a product in
    // the cart.

  }, {
    key: "addToCart",
    value: function addToCart(variantPayload, quantity) {
      return this.updateQuantity(variantPayload, quantity, 'Add to Cart', 'add');
    } // Used whenever there is a negative change in the quantity of a product in
    // the cart.

  }, {
    key: "removeFromCart",
    value: function removeFromCart(variantPayload, quantity) {
      return this.updateQuantity(variantPayload, quantity, 'Remove from Cart', 'remove');
    } // Used both fire the `Update Quantity` event but also as a helper for the
    // add and remove methods.

  }, {
    key: "updateQuantity",
    value: function () {
      var _updateQuantity = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(variantPayload, quantity) {
        var gtmEvent,
            ecommerceAction,
            flatVariant,
            _args4 = arguments;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                gtmEvent = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : 'Update Quantity';
                ecommerceAction = _args4.length > 3 ? _args4[3] : undefined;

                if (!(typeof window === "undefined" || window === null)) {
                  _context4.next = 4;
                  break;
                }

                return _context4.abrupt("return");

              case 4:
                _context4.next = 6;
                return this.getFlatVariant(variantPayload);

              case 6:
                if (flatVariant = _context4.sent) {
                  _context4.next = 8;
                  break;
                }

                return _context4.abrupt("return");

              case 8:
                return _context4.abrupt("return", this.pushEvent(gtmEvent, _objectSpread(_objectSpread({}, flatVariant), {}, {
                  quantity: quantity
                }, !ecommerceAction ? {} : {
                  ecommerce: (0, _defineProperty2["default"])({
                    currencyCode: this.currencyCode
                  }, ecommerceAction, {
                    products: [_objectSpread(_objectSpread({}, this.makeUaProductFieldObject(flatVariant)), {}, {
                      quantity: quantity
                    })]
                  })
                })));

              case 9:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function updateQuantity(_x4, _x5) {
        return _updateQuantity.apply(this, arguments);
      }

      return updateQuantity;
    }() // Fire an event with the current state of the cart

  }, {
    key: "cartUpdated",
    value: function () {
      var _cartUpdated = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(checkoutOrCartPayload) {
        var simplifiedCheckout;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (!(typeof window === "undefined" || window === null)) {
                  _context5.next = 2;
                  break;
                }

                return _context5.abrupt("return");

              case 2:
                _context5.next = 4;
                return this.getSimplifiedCheckout(checkoutOrCartPayload);

              case 4:
                if (!(simplifiedCheckout = _context5.sent)) {
                  _context5.next = 6;
                  break;
                }

                return _context5.abrupt("return", this.pushEvent('Cart Updated', simplifiedCheckout));

              case 6:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function cartUpdated(_x6) {
        return _cartUpdated.apply(this, arguments);
      }

      return cartUpdated;
    }() // Fire an event with the current step of the checkout process

  }, {
    key: "checkout",
    value: function () {
      var _checkout = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(checkoutOrCartPayload, checkoutStep) {
        var simplifiedCheckout;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (!(typeof window === "undefined" || window === null)) {
                  _context6.next = 2;
                  break;
                }

                return _context6.abrupt("return");

              case 2:
                _context6.next = 4;
                return this.getSimplifiedCheckout(checkoutOrCartPayload);

              case 4:
                if (!(simplifiedCheckout = _context6.sent)) {
                  _context6.next = 6;
                  break;
                }

                return _context6.abrupt("return", this.pushEvent('Checkout', _objectSpread(_objectSpread({
                  checkoutStep: checkoutStep
                }, simplifiedCheckout), !this.enableCheckoutEcommerceProperty ? {} : {
                  ecommerce: {
                    currencyCode: this.currencyCode,
                    checkout: {
                      actionField: {
                        step: checkoutStep
                      },
                      products: this.makeUaCheckoutProducts(simplifiedCheckout)
                    }
                  }
                })));

              case 6:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function checkout(_x7, _x8) {
        return _checkout.apply(this, arguments);
      }

      return checkout;
    }() // Notify of final checkout, using array of variant data from liquid

  }, {
    key: "purchase",
    value: function () {
      var _purchase = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(checkoutOrCartPayload) {
        var simplifiedCheckout;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (!(typeof window === "undefined" || window === null)) {
                  _context7.next = 2;
                  break;
                }

                return _context7.abrupt("return");

              case 2:
                _context7.next = 4;
                return this.getSimplifiedCheckout(checkoutOrCartPayload);

              case 4:
                if (!(simplifiedCheckout = _context7.sent)) {
                  _context7.next = 6;
                  break;
                }

                return _context7.abrupt("return", this.pushEvent('Purchase', _objectSpread(_objectSpread({}, simplifiedCheckout), !this.enableCheckoutEcommerceProperty ? {} : {
                  ecommerce: {
                    currencyCode: this.currencyCode,
                    purchase: {
                      actionField: {
                        id: simplifiedCheckout.checkoutId,
                        revenue: simplifiedCheckout.totalPrice,
                        tax: simplifiedCheckout.totalTax,
                        shipping: simplifiedCheckout.totalShipping,
                        coupon: simplifiedCheckout.discountCodes.join(',')
                      },
                      products: this.makeUaCheckoutProducts(simplifiedCheckout)
                    }
                  }
                })));

              case 6:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function purchase(_x9) {
        return _purchase.apply(this, arguments);
      }

      return purchase;
    }() // Customer information

  }, {
    key: "identifyCustomer",
    value: function identifyCustomer(customer) {
      if (typeof window === "undefined" || window === null) {
        return;
      }

      return this.pushEvent('Identify Customer', {
        customerId: customer.id,
        customerZip: customer.zip,
        customerEmail: customer.email
      });
    } // VARIANT DATA ##############################################################
    // Take a variantPayload, which may be an id or an object, and return an
    // object that can be easily consumed by GTM.

  }, {
    key: "getFlatVariant",
    value: function () {
      var _getFlatVariant = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(variantPayload) {
        var variant;
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                if (!((0, _typeof2["default"])(variantPayload) === 'object')) {
                  _context8.next = 4;
                  break;
                }

                _context8.t0 = variantPayload;
                _context8.next = 7;
                break;

              case 4:
                _context8.next = 6;
                return this.fetchVariant(variantPayload);

              case 6:
                _context8.t0 = _context8.sent;

              case 7:
                variant = _context8.t0;

                if (!variant) {
                  _context8.next = 12;
                  break;
                }

                return _context8.abrupt("return", this.makeFlatVariant(variant));

              case 12:
                return _context8.abrupt("return", console.error('Variant not found', variantPayload));

              case 13:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function getFlatVariant(_x10) {
        return _getFlatVariant.apply(this, arguments);
      }

      return getFlatVariant;
    }() // Lookup a product variant by id. Id may be a simple number or a
    // gid://shopify string

  }, {
    key: "fetchVariant",
    value: function () {
      var _fetchVariant = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(variantId) {
        var result;
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                if (variantId) {
                  _context9.next = 2;
                  break;
                }

                return _context9.abrupt("return");

              case 2:
                variantId = getShopifyId(variantId);
                _context9.next = 5;
                return this.queryStorefrontApi({
                  variables: {
                    id: btoa('gid://shopify/ProductVariant/' + variantId)
                  },
                  query: fetchVariantQuery
                });

              case 5:
                result = _context9.sent;
                return _context9.abrupt("return", result.node);

              case 7:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function fetchVariant(_x11) {
        return _fetchVariant.apply(this, arguments);
      }

      return fetchVariant;
    }() // Make flat object from a variant with nested product data

  }, {
    key: "makeFlatVariant",
    value: function makeFlatVariant(variant) {
      var product, productUrl, ref, variantId;
      product = variant.product;
      return {
        // Product level info
        productId: getShopifyId(product.id),
        productTitle: product.title,
        productVariantTitle: "".concat(product.title, " - ").concat(variant.title),
        productType: product.productType || product.type,
        productVendor: product.vendor,
        productUrl: productUrl = "".concat(this.storeUrl, "/products/").concat(product.handle),
        // Variant level data
        sku: variant.sku,
        price: variant.price,
        compareAtPrice: variant.compareAtPrice,
        variantId: variantId = getShopifyId(variant.id),
        variantTitle: variant.title,
        variantImage: ((ref = variant.image) != null ? ref.originalSrc : void 0) || variant.image,
        variantUrl: "".concat(productUrl, "?variant=").concat(variantId)
      };
    } // Convert a Shopify variant object to a UA productFieldObject. I'm
    // combining the product and variant name because that's what Shopify does
    // with it's own events.
    // https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce#product-data

  }, {
    key: "makeUaProductFieldObject",
    value: function makeUaProductFieldObject(flatVariant) {
      return {
        id: flatVariant.sku,
        name: flatVariant.productVariantTitle,
        brand: flatVariant.productVendor,
        category: flatVariant.productType,
        variant: flatVariant.variantTitle,
        price: flatVariant.price
      };
    } // CHECKOUT DATA #############################################################
    // Take a checkoutPayload, which may be an id or an object, and return the
    // Shopify checkout object that has been simplified a bit.

  }, {
    key: "getSimplifiedCheckout",
    value: function () {
      var _getSimplifiedCheckout = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(checkoutOrCartPayload) {
        var checkout;
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                if (!((0, _typeof2["default"])(checkoutOrCartPayload) === 'object')) {
                  _context10.next = 4;
                  break;
                }

                _context10.t0 = checkoutOrCartPayload;
                _context10.next = 7;
                break;

              case 4:
                _context10.next = 6;
                return this.fetchCheckout(checkoutOrCartPayload);

              case 6:
                _context10.t0 = _context10.sent;

              case 7:
                checkout = _context10.t0;

                if (checkout) {
                  _context10.next = 10;
                  break;
                }

                return _context10.abrupt("return", console.error('Checkout or Cart not found', checkoutOrCartPayload));

              case 10:
                return _context10.abrupt("return", this.makeSimplifiedCheckout(checkout));

              case 11:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function getSimplifiedCheckout(_x12) {
        return _getSimplifiedCheckout.apply(this, arguments);
      }

      return getSimplifiedCheckout;
    }() // Lookup a checkout or cart by id. Id should be a gid://shopify string

  }, {
    key: "fetchCheckout",
    value: function () {
      var _fetchCheckout = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(checkoutOrCartId) {
        var all, node, type, _atob$match, _atob$match2, _yield$this$queryStor;

        return _regenerator["default"].wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _atob$match = atob(checkoutOrCartId).match(/gid:\/\/shopify\/(\w+)/);
                _atob$match2 = (0, _slicedToArray2["default"])(_atob$match, 2);
                all = _atob$match2[0];
                type = _atob$match2[1];
                _context11.next = 6;
                return this.queryStorefrontApi({
                  query: function () {
                    switch (type) {
                      case 'Cart':
                        return fetchCartQuery;

                      case 'Checkout':
                        return fetchCheckoutQuery;

                      default:
                        throw "Unknown type: ".concat(type);
                    }
                  }(),
                  variables: {
                    id: checkoutOrCartId
                  }
                });

              case 6:
                _yield$this$queryStor = _context11.sent;
                node = _yield$this$queryStor.node;

                // Final massage of Carts into Checkout
                if (node.estimatedCost) {
                  node.subtotalPrice = node.estimatedCost.subtotalAmount.amount;
                  node.totalPrice = node.estimatedCost.totalAmount.amount;
                } // Return "checkout" (which could be a Cart object)


                return _context11.abrupt("return", node);

              case 10:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function fetchCheckout(_x13) {
        return _fetchCheckout.apply(this, arguments);
      }

      return fetchCheckout;
    }() // Standardize checkout properties to something more easily used in dataLayer

  }, {
    key: "makeSimplifiedCheckout",
    value: function makeSimplifiedCheckout(checkout) {
      var _this2 = this;

      // Flatten nodes that contain line items
      if (checkout.lineItems.edges) {
        checkout.lineItems = checkout.lineItems.edges.map(function (_ref4) {
          var node = _ref4.node;
          return node;
        });
      }

      return {
        // Return the simplified object
        checkoutId: getShopifyId(checkout.id),
        checkoutUrl: checkout.webUrl,
        subtotalPrice: checkout.subtotalPrice,
        totalPrice: checkout.totalPrice,
        lineItems: checkout.lineItems.map(function (lineItem) {
          return _objectSpread({
            lineItemId: getShopifyId(lineItem.id),
            quantity: lineItem.quantity
          }, _this2.makeFlatVariant(lineItem.variant));
        }),
        // Properties that aren't present until purchase
        orderNumber: checkout.orderNumber,
        totalTax: checkout.totalTax,
        totalShipping: checkout.totalShipping,
        discountCodes: checkout.discountCodes || []
      };
    } // Get a simplifiedCheckout object and make the `products` array from the
    // lineItems.  Which is

  }, {
    key: "makeUaCheckoutProducts",
    value: function makeUaCheckoutProducts(simplifiedCheckout) {
      var _this3 = this;

      return simplifiedCheckout.lineItems.map(function (lineItem) {
        return _objectSpread({
          quantity: lineItem.quantity
        }, _this3.makeUaProductFieldObject(lineItem));
      });
    } // STOREFRONT API ############################################################
    // Query Storefront API

  }, {
    key: "queryStorefrontApi",
    value: function () {
      var _queryStorefrontApi = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(payload) {
        var response;
        return _regenerator["default"].wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.next = 2;
                return (0, _axios["default"])({
                  url: "".concat(this.storeUrl, "/api/2021-10/graphql"),
                  method: 'post',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Shopify-Storefront-Access-Token': this.storefrontToken
                  },
                  data: payload
                });

              case 2:
                response = _context12.sent;

                if (!response.data.errors) {
                  _context12.next = 5;
                  break;
                }

                throw new StorefrontError(response.data.errors, payload);

              case 5:
                return _context12.abrupt("return", response.data.data);

              case 6:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function queryStorefrontApi(_x14) {
        return _queryStorefrontApi.apply(this, arguments);
      }

      return queryStorefrontApi;
    }() // DATALAYER WRITING #########################################################
    // Push GTM dataLayer event

  }, {
    key: "pushEvent",
    value: function pushEvent(name, payload) {
      if (this.debug) {
        console.debug("'".concat(name, "'"), payload);
      }

      if (!window.dataLayer) {
        window.dataLayer = [];
      } // Remove the ecommerce property, like if they are going to be created in
      // GTM manually.


      if (this.disableEcommerceProperty && payload.ecommerce) {
        payload = _objectSpread({}, payload);
        delete payload.ecommerce;
      } else {
        // Clear previous ecommerce values
        window.dataLayer.push({
          ecommerce: null
        });
      } // Add new event


      return window.dataLayer.push(_objectSpread({
        event: name,
        firstOccurance: this.isFirstOccurance(name)
      }, payload));
    } // Return whether this is the first time the event has fired. This can be
    // helpeful in conjunction to prevent double triggering from events that are
    // also fired in the intial page response from Shopify, like Page Views.

  }, {
    key: "isFirstOccurance",
    value: function isFirstOccurance(eventName) {
      if (indexOf.call(this.occurances, eventName) >= 0) {
        return false;
      }

      this.occurances.push(eventName);
      return true;
    }
  }]);
  return ShopifyGtmInstrumentor;
}(); // STOREFRONT QUERIES ##########################################################
// Product Variant fragment


exports["default"] = _default;
var productVariantFragment = "fragment variant on ProductVariant {\n\tid\n\tsku\n\ttitle\n\tprice\n\tcompareAtPrice\n\timage { originalSrc }\n\tproduct {\n\t\tid\n\t\ttitle\n\t\thandle\n\t\tproductType\n\t\tvendor\n\t}\n}"; // Graphql query to fetch a variant by id

exports.productVariantFragment = productVariantFragment;
var fetchVariantQuery = "query($id: ID!) {\n\tnode(id: $id) {\n\t\t...variant\n\t}\n}\n".concat(productVariantFragment); // Graphql query to fetch a cart by id

exports.fetchVariantQuery = fetchVariantQuery;
var fetchCartQuery = "query($id: ID!) {\n\tnode: cart(id: $id) {\n\t\t... on Cart {\n\t\t\tid\n\t\t\twebUrl: checkoutUrl\n\t\t\testimatedCost {\n\t\t\t\tsubtotalAmount { amount }\n\t\t\t\ttotalAmount { amount }\n\t\t\t}\n\t\t\tlineItems: lines (first: 250) {\n\t\t\t\tedges {\n\t\t\t\t\tnode {\n\t\t\t\t\t\t... on CartLine {\n\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\tquantity\n\t\t\t\t\t\t\tvariant: merchandise { ...variant }\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n}\n".concat(productVariantFragment); // Graphql query to fetch a checkout by id

exports.fetchCartQuery = fetchCartQuery;
var fetchCheckoutQuery = "query($id: ID!) {\n\tnode(id: $id) {\n\t\t... on Checkout {\n\t\t\tid\n\t\t\twebUrl\n\t\t\tsubtotalPrice\n\t\t\ttotalPrice\n\t\t\tlineItems (first: 250) {\n\t\t\t\tedges {\n\t\t\t\t\tnode {\n\t\t\t\t\t\t... on CheckoutLineItem {\n\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\tquantity\n\t\t\t\t\t\t\tvariant { ...variant }\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n}\n".concat(productVariantFragment);
exports.fetchCheckoutQuery = fetchCheckoutQuery;

StorefrontError = function () {
  // NON-INSTANCE HELPERS ########################################################
  // Error object with custom handling
  var StorefrontError = /*#__PURE__*/function (_Error) {
    (0, _inherits2["default"])(StorefrontError, _Error);

    var _super = _createSuper(StorefrontError);

    function StorefrontError(errors, payload) {
      var _this4;

      (0, _classCallCheck2["default"])(this, StorefrontError);
      _this4 = _super.call(this, errors.map(function (e) {
        return e.debugMessage || e.message;
      }).join(', '));
      _this4.errors = errors.map(function (e) {
        return JSON.stringify(e);
      });
      _this4.payload = payload;
      return _this4;
    }

    return StorefrontError;
  }( /*#__PURE__*/(0, _wrapNativeSuper2["default"])(Error));

  ;
  StorefrontError.prototype.name = 'StorefrontError';
  return StorefrontError;
}.call(void 0); // Get the id from a Shopify gid:// style id.  This strips everything but the
// last part of the string.  So gid://shopify/ProductVariant/34641879105581
// becomes 34641879105581
// https://regex101.com/r/3FIplL/1


getShopifyId = function getShopifyId(id) {
  var ref;

  if (String(id).match(/^\d+$/)) {
    // Already simple id
    return id;
  }

  if (!id.match(/^gid:\/\//)) {
    // De-base64
    id = atob(id);
  }

  return (ref = id.match(/\/([^\/]+)$/)) != null ? ref[1] : void 0;
}; // Get the position of an element with respect to it's parent
// https://stackoverflow.com/a/5913984/59160


getElPosition = function getElPosition(el) {
  var i;
  i = 1; // The first position will be `1`

  while ((el = el.previousElementSibling) !== null) {
    i++;
  }

  return i;
}; // Fire callback when in viewport. Not exposing a way to manually disconnect or
// unobserve because it _should_ be garbage collected when el is removed.
// https://stackoverflow.com/a/51106262/59160


whenFirstInViewport = function whenFirstInViewport(el, callback) {
  var observer;
  observer = new IntersectionObserver(function (_ref5) {
    var _ref6 = (0, _slicedToArray2["default"])(_ref5, 1),
        isIntersecting = _ref6[0].isIntersecting;

    if (!isIntersecting) {
      return;
    }

    observer.disconnect();
    return callback();
  });
  return observer.observe(el);
};
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapNativeSuper"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _axios = _interopRequireDefault(require("axios"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// Generated by CoffeeScript 2.5.1
// Deps
var ShopifyGtmInstrumentor,
    StorefrontError,
    fetchVariantQuery,
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
        storefrontToken = _ref$storefrontToken === void 0 ? process.env.SHOPIFY_STOREFONT_TOKEN : _ref$storefrontToken,
        _ref$currencyCode = _ref.currencyCode,
        currencyCode = _ref$currencyCode === void 0 ? 'USD' : _ref$currencyCode;

    (0, _classCallCheck2["default"])(this, ShopifyGtmInstrumentor);
    this.debug = debug;
    this.storeUrl = storeUrl;
    this.storefrontToken = storefrontToken;
    this.currencyCode = currencyCode;
    this.occurances = [];
  } // API #######################################################################
  // A view of an element


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
            variant,
            _args = arguments;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _ref2 = _args.length > 1 && _args[1] !== undefined ? _args[1] : {}, el = _ref2.el, list = _ref2.list, position = _ref2.position;
                _context.next = 3;
                return this.getVariantFromPayload(variantPayload);

              case 3:
                if (variant = _context.sent) {
                  _context.next = 5;
                  break;
                }

                return _context.abrupt("return");

              case 5:
                if (el && position == null) {
                  // Make defaults
                  position = getElPosition(el);
                } // Fire event


                eventPusher = function eventPusher() {
                  var flatVariant;
                  return _this.pushEvent('Product Impression', _objectSpread(_objectSpread({}, flatVariant = _this.makeFlatVariant(variant)), {}, {
                    ecommerce: {
                      impressions: [_objectSpread(_objectSpread({}, _this.makeUaProductFieldObject(flatVariant)), {}, {
                        list: list,
                        position: position
                      })]
                    }
                  }));
                };

                if (!el) {
                  _context.next = 11;
                  break;
                }

                return _context.abrupt("return", whenFirstInViewport(el, eventPusher));

              case 11:
                return _context.abrupt("return", eventPusher());

              case 12:
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
    }() // Typically used for view of PDP page

  }, {
    key: "productDetail",
    value: function () {
      var _productDetail = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(variantPayload) {
        var flatVariant, variant;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.getVariantFromPayload(variantPayload);

              case 2:
                if (variant = _context2.sent) {
                  _context2.next = 4;
                  break;
                }

                return _context2.abrupt("return");

              case 4:
                return _context2.abrupt("return", this.pushEvent('View Product Details', _objectSpread(_objectSpread({}, flatVariant = this.makeFlatVariant(variant)), {}, {
                  ecommerce: {
                    detail: {
                      products: [this.makeUaProductFieldObject(flatVariant)]
                    }
                  }
                })));

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function productDetail(_x2) {
        return _productDetail.apply(this, arguments);
      }

      return productDetail;
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
      var _updateQuantity = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(variantPayload, quantity) {
        var gtmEvent,
            ecommerceAction,
            flatVariant,
            variant,
            _args3 = arguments;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                gtmEvent = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : 'Update Quantity';
                ecommerceAction = _args3.length > 3 ? _args3[3] : undefined;
                _context3.next = 4;
                return this.getVariantFromPayload(variantPayload);

              case 4:
                if (variant = _context3.sent) {
                  _context3.next = 6;
                  break;
                }

                return _context3.abrupt("return");

              case 6:
                return _context3.abrupt("return", this.pushEvent(gtmEvent, _objectSpread(_objectSpread({}, flatVariant = this.makeFlatVariant(variant)), !ecommerceAction ? {} : {
                  ecommerce: (0, _defineProperty2["default"])({
                    currencyCode: this.currencyCode
                  }, ecommerceAction, {
                    products: [_objectSpread(_objectSpread({}, this.makeUaProductFieldObject(flatVariant)), {}, {
                      quantity: quantity
                    })]
                  })
                })));

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function updateQuantity(_x3, _x4) {
        return _updateQuantity.apply(this, arguments);
      }

      return updateQuantity;
    }() // Notify of final checkout, using array of variant data from liquid

  }, {
    key: "purchase",
    value: function purchase(lineItems) {
      return this.pushEvent('Purchase', {
        lineItems: lineItems
      });
    } // DATA HELPERS ##############################################################
    // Take a variantPayload, which may be an id or an object, and return the
    // Shopify variant object, ideally with nsted product data.

  }, {
    key: "getVariantFromPayload",
    value: function () {
      var _getVariantFromPayload = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(variantPayload) {
        var variant;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!((0, _typeof2["default"])(variantPayload) === 'object')) {
                  _context4.next = 4;
                  break;
                }

                _context4.t0 = variantPayload;
                _context4.next = 7;
                break;

              case 4:
                _context4.next = 6;
                return this.fetchVariant(variantPayload);

              case 6:
                _context4.t0 = _context4.sent;

              case 7:
                variant = _context4.t0;

                // Validate the variant and return
                if (!variant) {
                  console.error('Variant not found', variantPayload);
                }

                return _context4.abrupt("return", variant);

              case 10:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function getVariantFromPayload(_x5) {
        return _getVariantFromPayload.apply(this, arguments);
      }

      return getVariantFromPayload;
    }() // Lookup a product variant by id. Id may be a simple number or a
    // gid://shopify string

  }, {
    key: "fetchVariant",
    value: function () {
      var _fetchVariant = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(variantId) {
        var result;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                variantId = getShopifyId(variantId);
                _context5.next = 3;
                return this.queryStorefrontApi({
                  variables: {
                    id: btoa('gid://shopify/ProductVariant/' + variantId)
                  },
                  query: fetchVariantQuery
                });

              case 3:
                result = _context5.sent;
                return _context5.abrupt("return", result.node);

              case 5:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function fetchVariant(_x6) {
        return _fetchVariant.apply(this, arguments);
      }

      return fetchVariant;
    }() // Make flat object from a variant with nested product data

  }, {
    key: "makeFlatVariant",
    value: function makeFlatVariant(variant) {
      var ref, ref1, ref2, ref3;
      return {
        // Variant level data
        sku: variant.sku,
        variantId: getShopifyId(variant.id),
        variantTitle: variant.title,
        price: variant.price,
        // Product level info
        productTitle: (ref = variant.product) != null ? ref.title : void 0,
        productType: ((ref1 = variant.product) != null ? ref1.productType : void 0) || ((ref2 = variant.product) != null ? ref2.type : void 0),
        productVendor: (ref3 = variant.product) != null ? ref3.vendor : void 0
      };
    } // Convert a Shopify variant object to a UA productFieldObject. I'm
    // comibing the product and variant name because that's what Shopify does
    // with it's own events.
    // https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce#product-data

  }, {
    key: "makeUaProductFieldObject",
    value: function makeUaProductFieldObject(flatVariant) {
      return {
        id: flatVariant.sku,
        name: flatVariant.productTitle + ' - ' + flatVariant.variantTitle,
        brand: flatVariant.productVendor,
        category: flatVariant.productType,
        variant: flatVariant.variantTitle,
        price: flatVariant.price
      };
    } // STOREFRONT API ############################################################
    // Query Storefront API

  }, {
    key: "queryStorefrontApi",
    value: function () {
      var _queryStorefrontApi = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(payload) {
        var response;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return (0, _axios["default"])({
                  url: "".concat(this.storeUrl, "/api/2021-04/graphql"),
                  method: 'post',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Shopify-Storefront-Access-Token': this.storefrontToken
                  },
                  data: payload
                });

              case 2:
                response = _context6.sent;

                if (!response.data.errors) {
                  _context6.next = 5;
                  break;
                }

                throw new StorefrontError(response.data.errors, payload);

              case 5:
                return _context6.abrupt("return", response.data.data);

              case 6:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function queryStorefrontApi(_x7) {
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
      }

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
}();

exports["default"] = _default;

StorefrontError = function () {
  // NON-INSTANCE HELPERS ########################################################
  // Error object with custom handling
  var StorefrontError = /*#__PURE__*/function (_Error) {
    (0, _inherits2["default"])(StorefrontError, _Error);

    var _super = _createSuper(StorefrontError);

    function StorefrontError(errors, payload) {
      var _this2;

      (0, _classCallCheck2["default"])(this, StorefrontError);
      _this2 = _super.call(this, errors.map(function (e) {
        return e.debugMessage || e.message;
      }).join(', '));
      _this2.errors = errors.map(function (e) {
        return JSON.stringify(e);
      });
      _this2.payload = payload;
      return _this2;
    }

    return StorefrontError;
  }( /*#__PURE__*/(0, _wrapNativeSuper2["default"])(Error));

  ;
  StorefrontError.prototype.name = 'StorefrontError';
  return StorefrontError;
}.call(void 0); // Graphql query to fetch a variant by id


fetchVariantQuery = "query ($id: ID!) {\n\tnode(id: $id) {\n\t\t... on ProductVariant {\n\t\t\tid\n\t\t\tsku\n\t\t\ttitle\n\t\t\tprice\n\t\t\tproduct {\n\t\t\t\ttitle\n\t\t\t\tproductType\n\t\t\t\tvendor\n\t\t\t}\n\t\t}\n\t}\n}"; // Get the id from a Shoify gid:// style id.  This strips everything but the
// last part of the string.  So gid://shopify/ProductVariant/34641879105581
// becomes 34641879105581

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

  return (ref = id.match(/\/(\w+)$/)) != null ? ref[1] : void 0;
}; // Get the position of an element with respect to it's parent
// https://stackoverflow.com/a/5913984/59160


getElPosition = function getElPosition(el) {
  var i;
  i = 0;

  while ((el = el.previousElementSibling) !== null) {
    i++;
  }

  return i;
}; // Fire callback when in viewport. Not exposing a way to manually disconnect or
// unobserve because it _should_ be garbage collected when el is removed.
// https://stackoverflow.com/a/51106262/59160


whenFirstInViewport = function whenFirstInViewport(el, callback) {
  var observer;
  observer = new IntersectionObserver(function (_ref3) {
    var _ref4 = (0, _slicedToArray2["default"])(_ref3, 1),
        isIntersecting = _ref4[0].isIntersecting;

    if (!isIntersecting) {
      return;
    }

    observer.disconnect();
    return callback();
  });
  return observer.observe(el);
};
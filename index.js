"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getShopifyId = exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Generated by CoffeeScript 2.5.1
// Deps
var ShopifyGtmInstrumentor,
    StorefrontError,
    fetchVariantQuery,
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

    _classCallCheck(this, ShopifyGtmInstrumentor);

    this.debug = debug;
    this.storeUrl = storeUrl;
    this.storefrontToken = storefrontToken;
    this.currencyCode = currencyCode;
    this.occurances = [];
  } // API #######################################################################
  // Typically used for view of PDP page


  _createClass(ShopifyGtmInstrumentor, [{
    key: "viewProductDetails",
    value: function () {
      var _viewProductDetails = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(variantPayload) {
        var flatVariant, variant;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.getVariantFromPayload(variantPayload);

              case 2:
                variant = _context.sent;
                return _context.abrupt("return", this.pushEvent('View Product Details', _objectSpread(_objectSpread({}, flatVariant = this.makeFlatVariant(variant)), {}, {
                  ecommerce: {
                    detail: {
                      products: [this.makeUaProductFieldObject(flatVariant)]
                    }
                  }
                })));

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function viewProductDetails(_x) {
        return _viewProductDetails.apply(this, arguments);
      }

      return viewProductDetails;
    }() // Used whenver there is a positive change in the quantity of a product in
    // the cart.

  }, {
    key: "addProductToCart",
    value: function addProductToCart(variantPayload, quantity) {
      return this.updateQuantity(variantPayload, quantity, 'Add to Cart', 'add');
    } // Used whenever there is a negative change in the quantity of a product in
    // the cart.

  }, {
    key: "removeProductFromCart",
    value: function removeProductFromCart(variantPayload, quantity) {
      return this.updateQuantity(variantPayload, quantity, 'Remove from Cart', 'remove');
    } // Used both fire the `Update Quantity` event but also as a helper for the
    // add and remove methods.

  }, {
    key: "updateQuantity",
    value: function () {
      var _updateQuantity = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(variantPayload, quantity) {
        var gtmEvent,
            ecommerceAction,
            flatVariant,
            variant,
            _args2 = arguments;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                gtmEvent = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : 'Update Quantity';
                ecommerceAction = _args2.length > 3 ? _args2[3] : undefined;
                _context2.next = 4;
                return this.getVariantFromPayload(variantPayload);

              case 4:
                variant = _context2.sent;
                return _context2.abrupt("return", this.pushEvent(gtmEvent, _objectSpread(_objectSpread({}, flatVariant = this.makeFlatVariant(variant)), !ecommerceAction ? {} : {
                  ecommerce: _defineProperty({
                    currencyCode: this.currencyCode
                  }, ecommerceAction, {
                    products: [_objectSpread(_objectSpread({}, this.makeUaProductFieldObject(flatVariant)), {}, {
                      quantity: quantity
                    })]
                  })
                })));

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function updateQuantity(_x2, _x3) {
        return _updateQuantity.apply(this, arguments);
      }

      return updateQuantity;
    }() // DATA HELPERS ##############################################################
    // Take a variantPayload, which may be an id or an object, and return the
    // Shopify variant object, ideally with nsted product data.

  }, {
    key: "getVariantFromPayload",
    value: function getVariantFromPayload(variantPayload) {
      if (_typeof(variantPayload) === 'object') {
        return variantPayload;
      } else {
        return this.fetchVariant(variantPayload);
      }
    } // Lookup a product variant by id. Id may be a simple number or a
    // gid://shopify string

  }, {
    key: "fetchVariant",
    value: function () {
      var _fetchVariant = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(variantId) {
        var result;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                variantId = getShopifyId(variantId);
                _context3.next = 3;
                return this.queryStorefrontApi({
                  variables: {
                    id: btoa('gid://shopify/ProductVariant/' + variantId)
                  },
                  query: fetchVariantQuery
                });

              case 3:
                result = _context3.sent;
                return _context3.abrupt("return", result.node);

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function fetchVariant(_x4) {
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
        productVendor: (ref1 = variant.product) != null ? ref1.vendor : void 0,
        productType: ((ref2 = variant.product) != null ? ref2.productType : void 0) || ((ref3 = variant.product) != null ? ref3.type : void 0)
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
      var _queryStorefrontApi = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(payload) {
        var response;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
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
                response = _context4.sent;

                if (!response.data.errors) {
                  _context4.next = 5;
                  break;
                }

                throw new StorefrontError(response.data.errors, payload);

              case 5:
                return _context4.abrupt("return", response.data.data);

              case 6:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function queryStorefrontApi(_x5) {
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
    _inherits(StorefrontError, _Error);

    var _super = _createSuper(StorefrontError);

    function StorefrontError(errors, payload) {
      var _this;

      _classCallCheck(this, StorefrontError);

      _this = _super.call(this, errors.map(function (e) {
        return e.debugMessage || e.message;
      }).join(', '));
      _this.errors = errors.map(function (e) {
        return JSON.stringify(e);
      });
      _this.payload = payload;
      return _this;
    }

    return StorefrontError;
  }( /*#__PURE__*/_wrapNativeSuper(Error));

  ;
  StorefrontError.prototype.name = 'StorefrontError';
  return StorefrontError;
}.call(void 0); // Graphql query to fetch a variant by id


fetchVariantQuery = "query ($id: ID!) {\n\tnode(id: $id) {\n\t\t... on ProductVariant {\n\t\t\tid\n\t\t\tsku\n\t\t\ttitle\n\t\t\tprice\n\t\t\tproduct {\n\t\t\t\ttitle\n\t\t\t\tproductType\n\t\t\t\tvendor\n\t\t\t}\n\t\t}\n\t}\n}"; // Get the id from a Shoify gid:// style id.  This strips everything but the
// last part of the string.  So gid://shopify/ProductVariant/34641879105581
// becomes 34641879105581

var getShopifyId = function getShopifyId(id) {
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
};

exports.getShopifyId = getShopifyId;
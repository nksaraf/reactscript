/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

var merge = function merge(a, b) {
  var result = objectAssign({}, a, b);

  for (var key in a) {
    var _assign;

    if (!a[key] || typeof b[key] !== 'object') continue;
    objectAssign(result, (_assign = {}, _assign[key] = objectAssign(a[key], b[key]), _assign));
  }

  return result;
}; // sort object-value responsive styles

var sort = function sort(obj) {
  var next = {};
  Object.keys(obj).sort(function (a, b) {
    return a.localeCompare(b, undefined, {
      numeric: true,
      sensitivity: 'base'
    });
  }).forEach(function (key) {
    next[key] = obj[key];
  });
  return next;
};

var defaults = {
  breakpoints: [40, 52, 64].map(function (n) {
    return n + 'em';
  })
};

var createMediaQuery = function createMediaQuery(n) {
  return "@media screen and (min-width: " + n + ")";
};

var getValue = function getValue(n, scale) {
  return get(scale, n, n);
};

var get = function get(obj, key, def, p, undef) {
  key = key && key.split ? key.split('.') : [key];

  for (p = 0; p < key.length; p++) {
    obj = obj ? obj[key[p]] : undef;
  }

  return obj === undef ? def : obj;
};
var createParser = function createParser(config) {
  var cache = {};

  var parse = function parse(props) {
    var styles = {};
    var shouldSort = false;
    var isCacheDisabled = props.theme && props.theme.disableStyledSystemCache;

    for (var key in props) {
      if (!config[key]) continue;
      var sx = config[key];
      var raw = props[key];
      var scale = get(props.theme, sx.scale, sx.defaults);

      if (typeof raw === 'object') {
        cache.breakpoints = !isCacheDisabled && cache.breakpoints || get(props.theme, 'breakpoints', defaults.breakpoints);

        if (Array.isArray(raw)) {
          cache.media = !isCacheDisabled && cache.media || [null].concat(cache.breakpoints.map(createMediaQuery));
          styles = merge(styles, parseResponsiveStyle(cache.media, sx, scale, raw, props));
          continue;
        }

        if (raw !== null) {
          styles = merge(styles, parseResponsiveObject(cache.breakpoints, sx, scale, raw, props));
          shouldSort = true;
        }

        continue;
      }

      objectAssign(styles, sx(raw, scale, props));
    } // sort object-based responsive styles


    if (shouldSort) {
      styles = sort(styles);
    }

    return styles;
  };

  parse.config = config;
  parse.propNames = Object.keys(config);
  parse.cache = cache;
  var keys = Object.keys(config).filter(function (k) {
    return k !== 'config';
  });

  if (keys.length > 1) {
    keys.forEach(function (key) {
      var _createParser;

      parse[key] = createParser((_createParser = {}, _createParser[key] = config[key], _createParser));
    });
  }

  return parse;
};

var parseResponsiveStyle = function parseResponsiveStyle(mediaQueries, sx, scale, raw, _props) {
  var styles = {};
  raw.slice(0, mediaQueries.length).forEach(function (value, i) {
    var media = mediaQueries[i];
    var style = sx(value, scale, _props);

    if (!media) {
      objectAssign(styles, style);
    } else {
      var _assign2;

      objectAssign(styles, (_assign2 = {}, _assign2[media] = objectAssign({}, styles[media], style), _assign2));
    }
  });
  return styles;
};

var parseResponsiveObject = function parseResponsiveObject(breakpoints, sx, scale, raw, _props) {
  var styles = {};

  for (var key in raw) {
    var breakpoint = breakpoints[key];
    var value = raw[key];
    var style = sx(value, scale, _props);

    if (!breakpoint) {
      objectAssign(styles, style);
    } else {
      var _assign3;

      var media = createMediaQuery(breakpoint);
      objectAssign(styles, (_assign3 = {}, _assign3[media] = objectAssign({}, styles[media], style), _assign3));
    }
  }

  return styles;
};

var createStyleFunction = function createStyleFunction(_ref) {
  var properties = _ref.properties,
      property = _ref.property,
      scale = _ref.scale,
      _ref$transform = _ref.transform,
      transform = _ref$transform === void 0 ? getValue : _ref$transform,
      defaultScale = _ref.defaultScale;
  properties = properties || [property];

  var sx = function sx(value, scale, _props) {
    var result = {};
    var n = transform(value, scale, _props);
    if (n === null) return;
    properties.forEach(function (prop) {
      result[prop] = n;
    });
    return result;
  };

  sx.scale = scale;
  sx.defaults = defaultScale;
  return sx;
}; // new v5 API

var system = function system(args) {
  if (args === void 0) {
    args = {};
  }

  var config = {};
  Object.keys(args).forEach(function (key) {
    var conf = args[key];

    if (conf === true) {
      // shortcut definition
      config[key] = createStyleFunction({
        property: key,
        scale: key
      });
      return;
    }

    if (typeof conf === 'function') {
      config[key] = conf;
      return;
    }

    config[key] = createStyleFunction(conf);
  });
  var parser = createParser(config);
  return parser;
};
var compose = function compose() {
  var config = {};

  for (var _len = arguments.length, parsers = new Array(_len), _key = 0; _key < _len; _key++) {
    parsers[_key] = arguments[_key];
  }

  parsers.forEach(function (parser) {
    if (!parser || !parser.config) return;
    objectAssign(config, parser.config);
  });
  var parser = createParser(config);
  return parser;
};

var isNumber = function isNumber(n) {
  return typeof n === 'number' && !isNaN(n);
};

var getWidth = function getWidth(n, scale) {
  return get(scale, n, !isNumber(n) || n > 1 ? n : n * 100 + '%');
};

var config = {
  width: {
    property: 'width',
    scale: 'sizes',
    transform: getWidth
  },
  height: {
    property: 'height',
    scale: 'sizes'
  },
  minWidth: {
    property: 'minWidth',
    scale: 'sizes'
  },
  minHeight: {
    property: 'minHeight',
    scale: 'sizes'
  },
  maxWidth: {
    property: 'maxWidth',
    scale: 'sizes'
  },
  maxHeight: {
    property: 'maxHeight',
    scale: 'sizes'
  },
  size: {
    properties: ['width', 'height'],
    scale: 'sizes'
  },
  overflow: true,
  overflowX: true,
  overflowY: true,
  display: true,
  verticalAlign: true
};
var layout = system(config);

var config$1 = {
  color: {
    property: 'color',
    scale: 'colors'
  },
  backgroundColor: {
    property: 'backgroundColor',
    scale: 'colors'
  },
  opacity: true
};
config$1.bg = config$1.backgroundColor;
var color = system(config$1);

var defaults$1 = {
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 72]
};
var config$2 = {
  fontFamily: {
    property: 'fontFamily',
    scale: 'fonts'
  },
  fontSize: {
    property: 'fontSize',
    scale: 'fontSizes',
    defaultScale: defaults$1.fontSizes
  },
  fontWeight: {
    property: 'fontWeight',
    scale: 'fontWeights'
  },
  lineHeight: {
    property: 'lineHeight',
    scale: 'lineHeights'
  },
  letterSpacing: {
    property: 'letterSpacing',
    scale: 'letterSpacings'
  },
  textAlign: true,
  fontStyle: true
};
var typography = system(config$2);

var config$3 = {
  alignItems: true,
  alignContent: true,
  justifyItems: true,
  justifyContent: true,
  flexWrap: true,
  flexDirection: true,
  // item
  flex: true,
  flexGrow: true,
  flexShrink: true,
  flexBasis: true,
  justifySelf: true,
  alignSelf: true,
  order: true
};
var flexbox = system(config$3);

var defaults$2 = {
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512]
};
var config$4 = {
  gridGap: {
    property: 'gridGap',
    scale: 'space',
    defaultScale: defaults$2.space
  },
  gridColumnGap: {
    property: 'gridColumnGap',
    scale: 'space',
    defaultScale: defaults$2.space
  },
  gridRowGap: {
    property: 'gridRowGap',
    scale: 'space',
    defaultScale: defaults$2.space
  },
  gridColumn: true,
  gridRow: true,
  gridAutoFlow: true,
  gridAutoColumns: true,
  gridAutoRows: true,
  gridTemplateColumns: true,
  gridTemplateRows: true,
  gridTemplateAreas: true,
  gridArea: true
};
var grid = system(config$4);

var _config;
var config$5 = (_config = {
  border: {
    property: 'border',
    scale: 'borders'
  },
  borderWidth: {
    property: 'borderWidth',
    scale: 'borderWidths'
  },
  borderStyle: {
    property: 'borderStyle',
    scale: 'borderStyles'
  },
  borderColor: {
    property: 'borderColor',
    scale: 'colors'
  },
  borderRadius: {
    property: 'borderRadius',
    scale: 'radii'
  },
  borderTop: {
    property: 'borderTop',
    scale: 'borders'
  },
  borderTopLeftRadius: {
    property: 'borderTopLeftRadius',
    scale: 'radii'
  },
  borderTopRightRadius: {
    property: 'borderTopRightRadius',
    scale: 'radii'
  },
  borderRight: {
    property: 'borderRight',
    scale: 'borders'
  },
  borderBottom: {
    property: 'borderBottom',
    scale: 'borders'
  },
  borderBottomLeftRadius: {
    property: 'borderBottomLeftRadius',
    scale: 'radii'
  },
  borderBottomRightRadius: {
    property: 'borderBottomRightRadius',
    scale: 'radii'
  },
  borderLeft: {
    property: 'borderLeft',
    scale: 'borders'
  },
  borderX: {
    properties: ['borderLeft', 'borderRight'],
    scale: 'borders'
  },
  borderY: {
    properties: ['borderTop', 'borderBottom'],
    scale: 'borders'
  },
  borderTopWidth: {
    property: 'borderTopWidth',
    scale: 'borderWidths'
  },
  borderTopColor: {
    property: 'borderTopColor',
    scale: 'colors'
  },
  borderTopStyle: {
    property: 'borderTopStyle',
    scale: 'borderStyles'
  }
}, _config["borderTopLeftRadius"] = {
  property: 'borderTopLeftRadius',
  scale: 'radii'
}, _config["borderTopRightRadius"] = {
  property: 'borderTopRightRadius',
  scale: 'radii'
}, _config.borderBottomWidth = {
  property: 'borderBottomWidth',
  scale: 'borderWidths'
}, _config.borderBottomColor = {
  property: 'borderBottomColor',
  scale: 'colors'
}, _config.borderBottomStyle = {
  property: 'borderBottomStyle',
  scale: 'borderStyles'
}, _config["borderBottomLeftRadius"] = {
  property: 'borderBottomLeftRadius',
  scale: 'radii'
}, _config["borderBottomRightRadius"] = {
  property: 'borderBottomRightRadius',
  scale: 'radii'
}, _config.borderLeftWidth = {
  property: 'borderLeftWidth',
  scale: 'borderWidths'
}, _config.borderLeftColor = {
  property: 'borderLeftColor',
  scale: 'colors'
}, _config.borderLeftStyle = {
  property: 'borderLeftStyle',
  scale: 'borderStyles'
}, _config.borderRightWidth = {
  property: 'borderRightWidth',
  scale: 'borderWidths'
}, _config.borderRightColor = {
  property: 'borderRightColor',
  scale: 'colors'
}, _config.borderRightStyle = {
  property: 'borderRightStyle',
  scale: 'borderStyles'
}, _config);
var border = system(config$5);

var config$6 = {
  background: true,
  backgroundImage: true,
  backgroundSize: true,
  backgroundPosition: true,
  backgroundRepeat: true
};
config$6.bgImage = config$6.backgroundImage;
config$6.bgSize = config$6.backgroundSize;
config$6.bgPosition = config$6.backgroundPosition;
config$6.bgRepeat = config$6.backgroundRepeat;
var background = system(config$6);

var defaults$3 = {
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512]
};
var config$7 = {
  position: true,
  zIndex: {
    property: 'zIndex',
    scale: 'zIndices'
  },
  top: {
    property: 'top',
    scale: 'space',
    defaultScale: defaults$3.space
  },
  right: {
    property: 'right',
    scale: 'space',
    defaultScale: defaults$3.space
  },
  bottom: {
    property: 'bottom',
    scale: 'space',
    defaultScale: defaults$3.space
  },
  left: {
    property: 'left',
    scale: 'space',
    defaultScale: defaults$3.space
  }
};
var position = system(config$7);

var defaults$4 = {
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512]
};

var isNumber$1 = function isNumber(n) {
  return typeof n === 'number' && !isNaN(n);
};

var getMargin = function getMargin(n, scale) {
  if (!isNumber$1(n)) {
    return get(scale, n, n);
  }

  var isNegative = n < 0;
  var absolute = Math.abs(n);
  var value = get(scale, absolute, absolute);

  if (!isNumber$1(value)) {
    return isNegative ? '-' + value : value;
  }

  return value * (isNegative ? -1 : 1);
};

var configs = {};
configs.margin = {
  margin: {
    property: 'margin',
    scale: 'space',
    transform: getMargin,
    defaultScale: defaults$4.space
  },
  marginTop: {
    property: 'marginTop',
    scale: 'space',
    transform: getMargin,
    defaultScale: defaults$4.space
  },
  marginRight: {
    property: 'marginRight',
    scale: 'space',
    transform: getMargin,
    defaultScale: defaults$4.space
  },
  marginBottom: {
    property: 'marginBottom',
    scale: 'space',
    transform: getMargin,
    defaultScale: defaults$4.space
  },
  marginLeft: {
    property: 'marginLeft',
    scale: 'space',
    transform: getMargin,
    defaultScale: defaults$4.space
  },
  marginX: {
    properties: ['marginLeft', 'marginRight'],
    scale: 'space',
    transform: getMargin,
    defaultScale: defaults$4.space
  },
  marginY: {
    properties: ['marginTop', 'marginBottom'],
    scale: 'space',
    transform: getMargin,
    defaultScale: defaults$4.space
  }
};
configs.margin.m = configs.margin.margin;
configs.margin.mt = configs.margin.marginTop;
configs.margin.mr = configs.margin.marginRight;
configs.margin.mb = configs.margin.marginBottom;
configs.margin.ml = configs.margin.marginLeft;
configs.margin.mx = configs.margin.marginX;
configs.margin.my = configs.margin.marginY;
configs.padding = {
  padding: {
    property: 'padding',
    scale: 'space',
    defaultScale: defaults$4.space
  },
  paddingTop: {
    property: 'paddingTop',
    scale: 'space',
    defaultScale: defaults$4.space
  },
  paddingRight: {
    property: 'paddingRight',
    scale: 'space',
    defaultScale: defaults$4.space
  },
  paddingBottom: {
    property: 'paddingBottom',
    scale: 'space',
    defaultScale: defaults$4.space
  },
  paddingLeft: {
    property: 'paddingLeft',
    scale: 'space',
    defaultScale: defaults$4.space
  },
  paddingX: {
    properties: ['paddingLeft', 'paddingRight'],
    scale: 'space',
    defaultScale: defaults$4.space
  },
  paddingY: {
    properties: ['paddingTop', 'paddingBottom'],
    scale: 'space',
    defaultScale: defaults$4.space
  }
};
configs.padding.p = configs.padding.padding;
configs.padding.pt = configs.padding.paddingTop;
configs.padding.pr = configs.padding.paddingRight;
configs.padding.pb = configs.padding.paddingBottom;
configs.padding.pl = configs.padding.paddingLeft;
configs.padding.px = configs.padding.paddingX;
configs.padding.py = configs.padding.paddingY;
var margin = system(configs.margin);
var padding = system(configs.padding);
var space = compose(margin, padding);

var shadow = system({
  boxShadow: {
    property: 'boxShadow',
    scale: 'shadows'
  },
  textShadow: {
    property: 'textShadow',
    scale: 'shadows'
  }
});

var _scales;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

// based on https://github.com/developit/dlv
var get$1 = function get(obj, key, def, p, undef) {
  key = key && key.split ? key.split('.') : [key];

  for (p = 0; p < key.length; p++) {
    obj = obj ? obj[key[p]] : undef;
  }

  return obj === undef ? def : obj;
};
var defaultBreakpoints = [40, 52, 64].map(function (n) {
  return n + 'em';
});
var defaultTheme = {
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 72]
};
var aliases = {
  bg: 'backgroundColor',
  m: 'margin',
  mt: 'marginTop',
  mr: 'marginRight',
  mb: 'marginBottom',
  ml: 'marginLeft',
  mx: 'marginX',
  my: 'marginY',
  p: 'padding',
  pt: 'paddingTop',
  pr: 'paddingRight',
  pb: 'paddingBottom',
  pl: 'paddingLeft',
  px: 'paddingX',
  py: 'paddingY'
};
var multiples = {
  marginX: ['marginLeft', 'marginRight'],
  marginY: ['marginTop', 'marginBottom'],
  paddingX: ['paddingLeft', 'paddingRight'],
  paddingY: ['paddingTop', 'paddingBottom'],
  size: ['width', 'height']
};
var scales = (_scales = {
  color: 'colors',
  backgroundColor: 'colors',
  borderColor: 'colors',
  margin: 'space',
  marginTop: 'space',
  marginRight: 'space',
  marginBottom: 'space',
  marginLeft: 'space',
  marginX: 'space',
  marginY: 'space',
  padding: 'space',
  paddingTop: 'space',
  paddingRight: 'space',
  paddingBottom: 'space',
  paddingLeft: 'space',
  paddingX: 'space',
  paddingY: 'space',
  top: 'space',
  right: 'space',
  bottom: 'space',
  left: 'space',
  gridGap: 'space',
  gridColumnGap: 'space',
  gridRowGap: 'space',
  gap: 'space',
  columnGap: 'space',
  rowGap: 'space',
  fontFamily: 'fonts',
  fontSize: 'fontSizes',
  fontWeight: 'fontWeights',
  lineHeight: 'lineHeights',
  letterSpacing: 'letterSpacings',
  border: 'borders',
  borderTop: 'borders',
  borderRight: 'borders',
  borderBottom: 'borders',
  borderLeft: 'borders',
  borderWidth: 'borderWidths',
  borderStyle: 'borderStyles',
  borderRadius: 'radii',
  borderTopRightRadius: 'radii',
  borderTopLeftRadius: 'radii',
  borderBottomRightRadius: 'radii',
  borderBottomLeftRadius: 'radii',
  borderTopWidth: 'borderWidths',
  borderTopColor: 'colors',
  borderTopStyle: 'borderStyles'
}, _scales["borderTopLeftRadius"] = 'radii', _scales["borderTopRightRadius"] = 'radii', _scales.borderBottomWidth = 'borderWidths', _scales.borderBottomColor = 'colors', _scales.borderBottomStyle = 'borderStyles', _scales["borderBottomLeftRadius"] = 'radii', _scales["borderBottomRightRadius"] = 'radii', _scales.borderLeftWidth = 'borderWidths', _scales.borderLeftColor = 'colors', _scales.borderLeftStyle = 'borderStyles', _scales.borderRightWidth = 'borderWidths', _scales.borderRightColor = 'colors', _scales.borderRightStyle = 'borderStyles', _scales.outlineColor = 'colors', _scales.boxShadow = 'shadows', _scales.textShadow = 'shadows', _scales.zIndex = 'zIndices', _scales.width = 'sizes', _scales.minWidth = 'sizes', _scales.maxWidth = 'sizes', _scales.height = 'sizes', _scales.minHeight = 'sizes', _scales.maxHeight = 'sizes', _scales.flexBasis = 'sizes', _scales.size = 'sizes', _scales.fill = 'colors', _scales.stroke = 'colors', _scales);

var positiveOrNegative = function positiveOrNegative(scale, value) {
  if (typeof value !== 'number' || value >= 0) {
    return get$1(scale, value, value);
  }

  var absolute = Math.abs(value);
  var n = get$1(scale, absolute, absolute);
  if (typeof n === 'string') return '-' + n;
  return n * -1;
};

var transforms = ['margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'marginX', 'marginY', 'top', 'bottom', 'left', 'right'].reduce(function (acc, curr) {
  var _extends2;

  return _extends({}, acc, (_extends2 = {}, _extends2[curr] = positiveOrNegative, _extends2));
}, {});
var responsive = function responsive(styles) {
  return function (theme) {
    var next = {};
    var breakpoints = get$1(theme, 'breakpoints', defaultBreakpoints);
    var mediaQueries = [null].concat(breakpoints.map(function (n) {
      return "@media screen and (min-width: " + n + ")";
    }));

    for (var key in styles) {
      var value = typeof styles[key] === 'function' ? styles[key](theme) : styles[key];
      if (value == null) continue;

      if (!Array.isArray(value)) {
        next[key] = value;
        continue;
      }

      for (var i = 0; i < value.slice(0, mediaQueries.length).length; i++) {
        var media = mediaQueries[i];
        if (value[i] == null) continue;

        if (!media) {
          next[key] = value[i];
          continue;
        }

        next[media] = next[media] || {};
        next[media][key] = value[i];
      }
    }

    return next;
  };
};
var css = function css(args) {
  return function (props) {
    if (props === void 0) {
      props = {};
    }

    var theme = _extends({}, defaultTheme, {}, props.theme || props);

    var result = {};
    var obj = typeof args === 'function' ? args(theme) : args;
    var styles = responsive(obj)(theme);

    for (var key in styles) {
      var x = styles[key];
      var val = typeof x === 'function' ? x(theme) : x;

      if (key === 'variant') {
        var variant = css(get$1(theme, val))(theme);
        result = _extends({}, result, {}, variant);
        continue;
      }

      if (val && typeof val === 'object') {
        result[key] = css(val)(theme);
        continue;
      }

      var prop = get$1(aliases, key, key);
      var scaleName = get$1(scales, prop);
      var scale = get$1(theme, scaleName, get$1(theme, prop, {}));
      var transform = get$1(transforms, prop, get$1);
      var value = transform(scale, val, val);

      if (multiples[prop]) {
        var dirs = multiples[prop];

        for (var i = 0; i < dirs.length; i++) {
          result[dirs[i]] = value;
        }
      } else {
        result[prop] = value;
      }
    }

    return result;
  };
};

var variant = function variant(_ref) {
  var _config;

  var scale = _ref.scale,
      _ref$prop = _ref.prop,
      prop = _ref$prop === void 0 ? 'variant' : _ref$prop,
      _ref$variants = _ref.variants,
      variants = _ref$variants === void 0 ? {} : _ref$variants,
      key = _ref.key;
  var sx;

  if (Object.keys(variants).length) {
    sx = function sx(value, scale, props) {
      return css(get(scale, value, null))(props.theme);
    };
  } else {
    sx = function sx(value, scale) {
      return get(scale, value, null);
    };
  }

  sx.scale = scale || key;
  sx.defaults = variants;
  var config = (_config = {}, _config[prop] = sx, _config);
  var parser = createParser(config);
  return parser;
};
var buttonStyle = variant({
  key: 'buttons'
});
var textStyle = variant({
  key: 'textStyles',
  prop: 'textStyle'
});
var colorStyle = variant({
  key: 'colorStyles',
  prop: 'colors'
});

var width = layout.width,
    height = layout.height,
    minWidth = layout.minWidth,
    minHeight = layout.minHeight,
    maxWidth = layout.maxWidth,
    maxHeight = layout.maxHeight,
    size = layout.size,
    verticalAlign = layout.verticalAlign,
    display = layout.display,
    overflow = layout.overflow,
    overflowX = layout.overflowX,
    overflowY = layout.overflowY;
var opacity = color.opacity;
var fontSize = typography.fontSize,
    fontFamily = typography.fontFamily,
    fontWeight = typography.fontWeight,
    lineHeight = typography.lineHeight,
    textAlign = typography.textAlign,
    fontStyle = typography.fontStyle,
    letterSpacing = typography.letterSpacing;
var alignItems = flexbox.alignItems,
    alignContent = flexbox.alignContent,
    justifyItems = flexbox.justifyItems,
    justifyContent = flexbox.justifyContent,
    flexWrap = flexbox.flexWrap,
    flexDirection = flexbox.flexDirection,
    flex = flexbox.flex,
    flexGrow = flexbox.flexGrow,
    flexShrink = flexbox.flexShrink,
    flexBasis = flexbox.flexBasis,
    justifySelf = flexbox.justifySelf,
    alignSelf = flexbox.alignSelf,
    order = flexbox.order;
var gridGap = grid.gridGap,
    gridColumnGap = grid.gridColumnGap,
    gridRowGap = grid.gridRowGap,
    gridColumn = grid.gridColumn,
    gridRow = grid.gridRow,
    gridAutoFlow = grid.gridAutoFlow,
    gridAutoColumns = grid.gridAutoColumns,
    gridAutoRows = grid.gridAutoRows,
    gridTemplateColumns = grid.gridTemplateColumns,
    gridTemplateRows = grid.gridTemplateRows,
    gridTemplateAreas = grid.gridTemplateAreas,
    gridArea = grid.gridArea;
var borderWidth = border.borderWidth,
    borderStyle = border.borderStyle,
    borderColor = border.borderColor,
    borderTop = border.borderTop,
    borderRight = border.borderRight,
    borderBottom = border.borderBottom,
    borderLeft = border.borderLeft,
    borderRadius = border.borderRadius;
var backgroundImage = background.backgroundImage,
    backgroundSize = background.backgroundSize,
    backgroundPosition = background.backgroundPosition,
    backgroundRepeat = background.backgroundRepeat;
var zIndex = position.zIndex,
    top = position.top,
    right = position.right,
    bottom = position.bottom,
    left = position.left;

var style = function style(_ref) {
  var prop = _ref.prop,
      cssProperty = _ref.cssProperty,
      alias = _ref.alias,
      key = _ref.key,
      transformValue = _ref.transformValue,
      scale = _ref.scale,
      properties = _ref.properties;
  var config = {};
  config[prop] = createStyleFunction({
    properties: properties,
    property: cssProperty || prop,
    scale: key,
    defaultScale: scale,
    transform: transformValue
  });
  if (alias) config[alias] = config[prop];
  var parse = createParser(config);
  return parse;
};

export { alignContent, alignItems, alignSelf, background, backgroundImage, backgroundPosition, backgroundRepeat, backgroundSize, border, borderBottom, borderColor, borderLeft, borderRadius, borderRight, borderStyle, borderTop, borderWidth, border as borders, bottom, shadow as boxShadow, buttonStyle, color, colorStyle, compose, createParser, createStyleFunction, display, flex, flexBasis, flexDirection, flexGrow, flexShrink, flexWrap, flexbox, fontFamily, fontSize, fontStyle, fontWeight, get, grid, gridArea, gridAutoColumns, gridAutoFlow, gridAutoRows, gridColumn, gridColumnGap, gridGap, gridRow, gridRowGap, gridTemplateAreas, gridTemplateColumns, gridTemplateRows, height, justifyContent, justifyItems, justifySelf, layout, left, letterSpacing, lineHeight, margin, maxHeight, maxWidth, minHeight, minWidth, opacity, order, overflow, overflowX, overflowY, padding, position, right, shadow, size, space, style, system, textAlign, shadow as textShadow, textStyle, top, typography, variant, verticalAlign, width, zIndex };
//# sourceMappingURL=styled-system.js.map

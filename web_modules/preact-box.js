import { createElement as h, createContext as L } from './preact.js';
import { w } from './common/hooks.module-9795d4f0.js';
import { forwardRef as S } from './preact/compat.js';

var r={data:""},e=function(e){try{var t=e?e.querySelector("#_goober"):self._goober;return t||((t=(e||document.head).appendChild(document.createElement("style"))).innerHTML=" ",t.id="_goober"),t.firstChild}catch(r){}return r},a=/(?:([a-z0-9-%@]+) *:? *([^{;]+?);|([^;}{]*?) +{)|(})/gi,n=/\/\*.*?\*\/|\s{2,}|\n/gm,c=function(r,e,t){var a="",n="",i="";if(/^@[k|f]/.test(t))return t+JSON.stringify(r).replace(/","/g,";").replace(/"|,"/g,"").replace(/:{/g,"{");for(var o in r){var u=r[o];if("object"==typeof u){var s=e+" "+o;/&/g.test(o)&&(s=o.replace(/&/g,e)),"@"==o[0]&&(s=e),n+=c(u,s,s==e?o:t||"");}else/^@i/.test(o)?i=o+" "+u+";":a+=o.replace(/[A-Z]/g,"-$&").toLowerCase()+":"+u+";";}if(a.charCodeAt(0)){var f=e+"{"+a+"}";return t?n+t+"{"+f+"}":i+f+n}return i+n},i={c:0},o=function(r,e,t,o){var u=JSON.stringify(r),s=i[u]||(i[u]=t?"":".go"+u.split("").reduce(function(r,e){return r+e.charCodeAt(0)|8},4));return function(r,e,t){e.data.indexOf(r)<0&&(e.data=t?r+e.data:e.data+r);}(i[s]||(i[s]=c(r[0]?function(r){for(var e,t=[{}];e=a.exec(r.replace(n,""));)e[4]&&t.shift(),e[3]?t.unshift(t[0][e[3]]={}):e[4]||(t[0][e[1]]=e[2]);return t[0]}(r):r,s)),e,o),s.slice(1)},u=function(r,e,t){return r.reduce(function(r,a,n){var c=e[n];if(c&&c.call){var i=c(t),o=i&&i.props&&i.props.className||/^go/.test(i)&&i;c=o?"."+o:i&&i.props?"":i;}return r+a+(c||"")},"")};function s(r){var t=this||{},a=r.call?r(t.p):r;return o(a.map?u(a,[].slice.call(arguments,1),t.p):a,e(t.target),t.g,t.o)}var f,l,p,g=s.bind({g:1}),d=function(r,e,t){f=r,l=e,p=t;};function v(r){var e=this||{};return function(){var t=arguments;function a(a,n){var c=e.p=Object.assign(p?{theme:p()}:{},a),i=c.className;return e.o=/\s*go[0-9]+/g.test(i),c.className=s.apply(e,t)+(i?" "+i:""),c.ref=n,f(r,c)}return l?l(a):a}}

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

var display = layout.display;

function _extends$1() {
  _extends$1 = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$1.apply(this, arguments);
}

var red = {
  "50": "#ffebee",
  "100": "#ffcdd2",
  "200": "#ef9a9a",
  "300": "#e57373",
  "400": "#ef5350",
  "500": "#f44336",
  "600": "#e53935",
  "700": "#d32f2f",
  "800": "#c62828",
  "900": "#b71c1c",
  a100: "#ff8a80",
  a200: "#ff5252",
  a400: "#ff1744",
  a700: "#d50000"
};
var pink = {
  "50": "#fce4ec",
  "100": "#f8bbd0",
  "200": "#f48fb1",
  "300": "#f06292",
  "400": "#ec407a",
  "500": "#e91e63",
  "600": "#d81b60",
  "700": "#c2185b",
  "800": "#ad1457",
  "900": "#880e4f",
  a100: "#ff80ab",
  a200: "#ff4081",
  a400: "#f50057",
  a700: "#c51162"
};
var purple = {
  "50": "#f3e5f5",
  "100": "#e1bee7",
  "200": "#ce93d8",
  "300": "#ba68c8",
  "400": "#ab47bc",
  "500": "#9c27b0",
  "600": "#8e24aa",
  "700": "#7b1fa2",
  "800": "#6a1b9a",
  "900": "#4a148c",
  a100: "#ea80fc",
  a200: "#e040fb",
  a400: "#d500f9",
  a700: "#aa00ff"
};
var deepPurple = {
  "50": "#ede7f6",
  "100": "#d1c4e9",
  "200": "#b39ddb",
  "300": "#9575cd",
  "400": "#7e57c2",
  "500": "#673ab7",
  "600": "#5e35b1",
  "700": "#512da8",
  "800": "#4527a0",
  "900": "#311b92",
  a100: "#b388ff",
  a200: "#7c4dff",
  a400: "#651fff",
  a700: "#6200ea"
};
var indigo = {
  "50": "#e8eaf6",
  "100": "#c5cae9",
  "200": "#9fa8da",
  "300": "#7986cb",
  "400": "#5c6bc0",
  "500": "#3f51b5",
  "600": "#3949ab",
  "700": "#303f9f",
  "800": "#283593",
  "900": "#1a237e",
  a100: "#8c9eff",
  a200: "#536dfe",
  a400: "#3d5afe",
  a700: "#304ffe"
};
var blue = {
  "50": "#e3f2fd",
  "100": "#bbdefb",
  "200": "#90caf9",
  "300": "#64b5f6",
  "400": "#42a5f5",
  "500": "#2196f3",
  "600": "#1e88e5",
  "700": "#1976d2",
  "800": "#1565c0",
  "900": "#0d47a1",
  a100: "#82b1ff",
  a200: "#448aff",
  a400: "#2979ff",
  a700: "#2962ff"
};
var lightBlue = {
  "50": "#e1f5fe",
  "100": "#b3e5fc",
  "200": "#81d4fa",
  "300": "#4fc3f7",
  "400": "#29b6f6",
  "500": "#03a9f4",
  "600": "#039be5",
  "700": "#0288d1",
  "800": "#0277bd",
  "900": "#01579b",
  a100: "#80d8ff",
  a200: "#40c4ff",
  a400: "#00b0ff",
  a700: "#0091ea"
};
var cyan = {
  "50": "#e0f7fa",
  "100": "#b2ebf2",
  "200": "#80deea",
  "300": "#4dd0e1",
  "400": "#26c6da",
  "500": "#00bcd4",
  "600": "#00acc1",
  "700": "#0097a7",
  "800": "#00838f",
  "900": "#006064",
  a100: "#84ffff",
  a200: "#18ffff",
  a400: "#00e5ff",
  a700: "#00b8d4"
};
var teal = {
  "50": "#e0f2f1",
  "100": "#b2dfdb",
  "200": "#80cbc4",
  "300": "#4db6ac",
  "400": "#26a69a",
  "500": "#009688",
  "600": "#00897b",
  "700": "#00796b",
  "800": "#00695c",
  "900": "#004d40",
  a100: "#a7ffeb",
  a200: "#64ffda",
  a400: "#1de9b6",
  a700: "#00bfa5"
};
var green = {
  "50": "#e8f5e9",
  "100": "#c8e6c9",
  "200": "#a5d6a7",
  "300": "#81c784",
  "400": "#66bb6a",
  "500": "#4caf50",
  "600": "#43a047",
  "700": "#388e3c",
  "800": "#2e7d32",
  "900": "#1b5e20",
  a100: "#b9f6ca",
  a200: "#69f0ae",
  a400: "#00e676",
  a700: "#00c853"
};
var lightGreen = {
  "50": "#f1f8e9",
  "100": "#dcedc8",
  "200": "#c5e1a5",
  "300": "#aed581",
  "400": "#9ccc65",
  "500": "#8bc34a",
  "600": "#7cb342",
  "700": "#689f38",
  "800": "#558b2f",
  "900": "#33691e",
  a100: "#ccff90",
  a200: "#b2ff59",
  a400: "#76ff03",
  a700: "#64dd17"
};
var lime = {
  "50": "#f9fbe7",
  "100": "#f0f4c3",
  "200": "#e6ee9c",
  "300": "#dce775",
  "400": "#d4e157",
  "500": "#cddc39",
  "600": "#c0ca33",
  "700": "#afb42b",
  "800": "#9e9d24",
  "900": "#827717",
  a100: "#f4ff81",
  a200: "#eeff41",
  a400: "#c6ff00",
  a700: "#aeea00"
};
var yellow = {
  "50": "#fffde7",
  "100": "#fff9c4",
  "200": "#fff59d",
  "300": "#fff176",
  "400": "#ffee58",
  "500": "#ffeb3b",
  "600": "#fdd835",
  "700": "#fbc02d",
  "800": "#f9a825",
  "900": "#f57f17",
  a100: "#ffff8d",
  a200: "#ffff00",
  a400: "#ffea00",
  a700: "#ffd600"
};
var amber = {
  "50": "#fff8e1",
  "100": "#ffecb3",
  "200": "#ffe082",
  "300": "#ffd54f",
  "400": "#ffca28",
  "500": "#ffc107",
  "600": "#ffb300",
  "700": "#ffa000",
  "800": "#ff8f00",
  "900": "#ff6f00",
  a100: "#ffe57f",
  a200: "#ffd740",
  a400: "#ffc400",
  a700: "#ffab00"
};
var orange = {
  "50": "#fff3e0",
  "100": "#ffe0b2",
  "200": "#ffcc80",
  "300": "#ffb74d",
  "400": "#ffa726",
  "500": "#ff9800",
  "600": "#fb8c00",
  "700": "#f57c00",
  "800": "#ef6c00",
  "900": "#e65100",
  a100: "#ffd180",
  a200: "#ffab40",
  a400: "#ff9100",
  a700: "#ff6d00"
};
var deepOrange = {
  "50": "#fbe9e7",
  "100": "#ffccbc",
  "200": "#ffab91",
  "300": "#ff8a65",
  "400": "#ff7043",
  "500": "#ff5722",
  "600": "#f4511e",
  "700": "#e64a19",
  "800": "#d84315",
  "900": "#bf360c",
  a100: "#ff9e80",
  a200: "#ff6e40",
  a400: "#ff3d00",
  a700: "#dd2c00"
};
var brown = {
  "50": "#efebe9",
  "100": "#d7ccc8",
  "200": "#bcaaa4",
  "300": "#a1887f",
  "400": "#8d6e63",
  "500": "#795548",
  "600": "#6d4c41",
  "700": "#5d4037",
  "800": "#4e342e",
  "900": "#3e2723"
};
var grey = {
  "50": "#fafafa",
  "100": "#f5f5f5",
  "200": "#eeeeee",
  "300": "#e0e0e0",
  "400": "#bdbdbd",
  "500": "#9e9e9e",
  "600": "#757575",
  "700": "#616161",
  "800": "#424242",
  "900": "#212121"
};
var blueGrey = {
  "50": "#eceff1",
  "100": "#cfd8dc",
  "200": "#b0bec5",
  "300": "#90a4ae",
  "400": "#78909c",
  "500": "#607d8b",
  "600": "#546e7a",
  "700": "#455a64",
  "800": "#37474f",
  "900": "#263238"
};
var black = "#000000";
var white = "#ffffff";
var darkText = {
  primary: "rgba(0, 0, 0, 0.87)",
  secondary: "rgba(0, 0, 0, 0.54)",
  disabled: "rgba(0, 0, 0, 0.38)",
  dividers: "rgba(0, 0, 0, 0.12)"
};
var lightText = {
  primary: "rgba(255, 255, 255, 1)",
  secondary: "rgba(255, 255, 255, 0.7)",
  disabled: "rgba(255, 255, 255, 0.5)",
  dividers: "rgba(255, 255, 255, 0.12)"
};
var darkIcons = {
  active: "rgba(0, 0, 0, 0.54)",
  inactive: "rgba(0, 0, 0, 0.38)"
};
var lightIcons = {
  active: "rgba(255, 255, 255, 1)",
  inactive: "rgba(255, 255, 255, 0.5)"
};
var colors = {
  red: red,
  pink: pink,
  purple: purple,
  deepPurple: deepPurple,
  indigo: indigo,
  blue: blue,
  lightBlue: lightBlue,
  cyan: cyan,
  teal: teal,
  green: green,
  lightGreen: lightGreen,
  lime: lime,
  yellow: yellow,
  amber: amber,
  orange: orange,
  deepOrange: deepOrange,
  brown: brown,
  grey: grey,
  blueGrey: blueGrey,
  black: black,
  white: white,
  darkText: darkText,
  lightText: lightText,
  darkIcons: darkIcons,
  lightIcons: lightIcons
};

function fontStack(fonts) {
  return fonts.map(function (font) {
    return font.includes(' ') ? "\"" + font + "\"" : font;
  }).join(', ');
} // const themeColors = {
//   background: colors.white,
//   text: hue[900],
//   hue: hue,
//   darkText: hue[900],
//   lightText: colors.white,
//   pageDivider: colors.red[200],
//   // pageRule: colors.lightBlue[100],
//   pageRule: Color(colors.blue[200])
//     .lighten(0.25)
//     .hex(),
//   form: {
//     active: hue[800],
//     inactive: hue[200],
//     disabled: hue[100],
//     activeText: colors.white,
//     inactiveText: hue[900],
//     disabledText: hue[300]
//   },
//   primary: hue[800],
//   light: hue[50],
//   // accent: colors.lightBlue[300]
//   accent: hue[300]
// };


var other = {
  shadows: {
    none: 'rgba(0,0,0,0) 0 0px 0px 0',
    small: 'rgba(0,0,0,0.15) 0 3px 6px 0',
    large: 'rgba(0,0,0,0.30) 0 4px 10px 0'
  },
  ruleHeight: 32
};
var theme =
/*#__PURE__*/
_extends$1({
  breakpoints: ['544px', '768px', '1012px', '1280px'],
  colors:
  /*#__PURE__*/
  _extends$1({}, colors),
  fontSizes: [12, 14, 16, 20, 24, 32, 40, 48],
  lineHeights: {
    condensedUltra: 1,
    condensed: 1.25,
    "default": 1.5
  },
  maxWidths: {
    small: '544px',
    medium: '768px',
    large: '1012px',
    xlarge: '1280px'
  },
  fonts: {
    normal:
    /*#__PURE__*/
    fontStack(['Barlow', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol']),
    mono:
    /*#__PURE__*/
    fontStack(['SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', 'Courier', 'monospace'])
  },
  fontWeights: {
    lighter: 300,
    normal: 400,
    bold: 500,
    bolder: 600
  },
  borders: [0, '1px solid'],
  radii: [0, 3, 6, 12, 150],
  space: [0, 4, 8, 16, 24, 32, 40, 48, 64, 80, 96, 112, 128],
  sizes: [0, 4, 8, 16, 24, 32, 40, 48, 64, 80, 96, 112, 128]
}, other);

var ThemeContext =
/*#__PURE__*/
L(theme);
var useTheme = function useTheme() {
  var theme = w(ThemeContext) || {};
  return theme;
};
var ThemeProvider = function ThemeProvider(_ref) {
  var _ref$theme = _ref.theme,
      theme = _ref$theme === void 0 ? {} : _ref$theme,
      children = _ref.children;
  return h(ThemeContext.Provider, {
    value: theme
  }, children);
};
d(h, S, useTheme);

var transform =
/*#__PURE__*/
system({
  transform: true,
  transformBox: true,
  transformOrigin: true,
  transformStyle: true,
  translate: true,
  scale: true,
  rotate: true,
  perspective: true,
  perspectiveOrigin: true,
  overflow: true,
  boxSizing: true,
  cursor: true,
  textDecoration: true
});

var frGetter = function frGetter(value) {
  return typeof value === 'number' ? "repeat(" + value + ", 1fr)" : value;
};

var formatAreas = function formatAreas(areas) {
  return areas;
}; // const frGetter = (value: any) =>
//   typeof value === 'number' ? `repeat(${value}, 1fr)` : value;
// const formatAreas = areas => areas;
// // ? areas.map(area => `"${area}"`).join(' ') : "";


var gridStyle =
/*#__PURE__*/
system({
  flow: {
    property: 'gridAutoFlow'
  },
  minRowHeight: {
    property: 'gridAutoRows',
    transform: function transform(value) {
      return "minmax(" + (value || '20px') + ", auto)";
    }
  },
  areas: {
    property: 'gridTemplateAreas',
    transform: function transform(value) {
      return formatAreas(value);
    }
  },
  columns: {
    property: 'gridTemplateColumns',
    transform: function transform(value) {
      return frGetter(value);
    }
  },
  rows: {
    property: 'gridTemplateRows',
    transform: function transform(value) {
      return frGetter(value);
    }
  }
});
var cellStyle =
/*#__PURE__*/
system({
  colSpan: {
    property: 'gridColumnEnd',
    transform: function transform(value) {
      return "" + (value !== undefined ? "span " + (value || 1) : '');
    }
  },
  rowSpan: {
    property: 'gridRowEnd',
    transform: function transform(value) {
      return "" + (value !== undefined ? "span " + (value || 1) : '');
    }
  },
  colIndex: {
    property: 'gridColumnStart',
    transform: function transform(value) {
      return "" + (value !== undefined ? typeof value === 'number' ? value + 1 : value : '');
    }
  },
  rowIndex: {
    property: 'gridRowStart',
    transform: function transform(value) {
      return "" + (value !== undefined ? typeof value === 'number' ? value + 1 : value : '');
    }
  }
});
var styleProps =
/*#__PURE__*/
compose(space, color, display, layout, border, shadow, flexbox, grid, background, border, position, transform, typography, cellStyle, gridStyle);

// const BoxBase = ({ children, ...props }) => {
//   console.log(props);
//   return <div {...props}>{children}</div>;
// };
// Add styled-system functions to your component

var createStyledComponent = function createStyledComponent(tag, name) {
  var Component = v(tag)(styleProps);
  Component.displayName = name;
  return Component;
};

var Box =
/*#__PURE__*/
createStyledComponent('div', 'Box');
var Image =
/*#__PURE__*/
createStyledComponent('img', 'Image');
var Button =
/*#__PURE__*/
createStyledComponent('button', 'Button');
var IFrame =
/*#__PURE__*/
createStyledComponent('iframe', 'IFrame');

export { Box, Button, IFrame, Image, ThemeProvider, v as styled, useTheme };
//# sourceMappingURL=preact-box.js.map

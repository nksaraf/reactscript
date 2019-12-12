/**
 * Transforms the input into a className
 * @param {String} str 
 */
const toHash = (str) => (
    ".go" + str
        .split("")
        .reduce((out, i) => (out + i.charCodeAt(0)) | 8, 4)
);

/**
 * Returns the _commit_ target
 * @param {Object} target
 */
const GOOBER_ID = "_goober";
const ssr = {
    data: ""
};
const getSheet = target => {
    try {
        let sheet = target ? target.querySelector('#' + GOOBER_ID) : self[GOOBER_ID];
        if (!sheet) {
            let _target = target || document.head;
            _target.innerHTML += '<style id="' + GOOBER_ID + '"> </style>';
            sheet = _target.lastChild;
        }
        return sheet.firstChild;
    } catch (e) {}
    return ssr;
};

/**
 * Extracts and wipes the cache
 * @returns {String}
 */
const extractCss = target => {
    const sheet = getSheet(target);
    const out = sheet.data;
    sheet.data = "";
    return out;
};

/**
 * Updates the target and keeps a local cache
 * @param {String} css
 * @param {Object} target
 * @param {Boolean} append
 */
const update = (css, sheet, append) => {
    sheet.data.indexOf(css) < 0 && (
        sheet.data = append ? css + sheet.data : sheet.data + css
    );
};

const newRule = /(?:([a-z0-9-%@]+) *:? *([^{;]+?);|([^;}{]*?) +{)|(})/gi;
const ruleClean = /\/\*.*?\*\/|\s{2,}|\n/gm;

/**
 * Convert a css style string into a object
 * @param {string} val 
 * @returns {object}
 */
const astish = val => {
    let tree = [{}];
    let block;
    
    while ((block = newRule.exec(val.replace(ruleClean, "")))) {
        // Remove the current entry
        if (block[4]) tree.shift();
        
        if (block[3]) {
            tree.unshift((tree[0][block[3]] = {}));
        } else if (!block[4]) {
            tree[0][block[1]] = block[2];
        }
    }
    
    return tree[0];
};

/**
 * Parses the object into css, scoped, blocks
 * @param {Object} obj 
 * @param {String} paren 
 * @param {String} wrapper 
 */
const parse = (obj, paren, wrapper) => {
    let current = "";
    let blocks = "";
    let outer = "";
    
    // If we're dealing with keyframes just flatten them
    if (/^@[k|f]/.test(wrapper)) {
      // Return the wrapper, which should be the @keyframes selector
      // and stringify the obj which should be just flatten 
      return wrapper + JSON.stringify(obj).replace(/","/g, ";").replace(/"|,"/g, "").replace(/:{/g, "{");
    }
    
    for (let key in obj) {
        const val = obj[key];
        
        // If this is a 'block'
        if (typeof val === "object") {

            // Regular selector
            let next = paren + " " + key;
            
            // Nested
            if (/&/g.test(key)) next = key.replace(/&/g, paren);
    
            // Media queries or other
            if (key[0] == '@') next = paren;
    
            // Call the parse for this block
            blocks += parse(val, next, next == paren ? key : wrapper || '');
        } else {
            if (/^@i/.test(key)) outer = key + " " + val + ";";
            // Push the line for this property
            else current += key.replace(/[A-Z]/g, "-$&").toLowerCase() + ":" + val + ";";
        }
    }
    
    // If we have properties
    if (current.charCodeAt(0)) {
        // Standard rule composition
        const rule = paren + "{" + current + "}";
        
        // With wrapper
        if (wrapper) return blocks + wrapper + "{" + rule + "}";
    
        // Else just push the rule
        return outer + rule + blocks;
    }
  
    return outer + blocks;
};

/**
 * In-memory cache.
 */
let cache = {
    c: 0
};

/**
 * Generates the needed className
 * @param {String|Object} compiled
 * @param {Object} sheet StyleSheet target
 * @param {Object} g Global flag
 * @param {Object} append Append or not
 * @returns {String} 
 */
const hash = (compiled, sheet, g, append) => {
    // generate hash
    const compString = JSON.stringify(compiled);
    const className = cache[compString] || (cache[compString] = g ? "" : toHash(compString));

    // Parse the compiled
    const parsed = cache[className] || (
        cache[className] = parse(
            compiled[0] ? astish(compiled) : compiled,
            className
        )
    );

    // add or update
    update(parsed, sheet, append);

    // return hash
    return className.slice(1);
};

/**
 * Can parse a compiled string, from a tagged template
 * @param {String} value
 * @param {Object} [props]
 */
const compile = (str, defs, data) => {
    return str.reduce((out, next, i) => {
        let tail = defs[i];
    
        if (typeof defs[i] == "function") {
          const res = defs[i](data);
          const attr = res && (res.attributes || res.props);
          const end = (attr && attr.className) || (/^go/.test(res) && res);
    
          tail = (end ? "." + end : (attr ? "" : res));
        }
        return out + next + (tail || "");
      }, "");
};

/**
 * css entry
 * @param {String|Object|Function} val
 */
function css(val) {
    const ctx = this || {};
    const _val = val.call ? val(ctx.p) : val;

    return hash(
        _val.map ? compile(_val, [].slice.call(arguments, 1), ctx.p) : _val,
        getSheet(ctx.target),
        ctx.g,
        ctx.o
    );
}

/**
 * CSS Global function to declare global styes
 */
const glob = css.bind({ g: 1 });

let h;
let useTheme = () => ({});
let forwardRef;
const setPragma = pragma => { h = pragma; };
const setForwardRef = fn => { forwardRef = fn; };
const setUseTheme = fn => { useTheme = fn; }

// in styled fn add the following
;

/**
 * Styled function
 * @param {String} tag
 */
function styled(tag) {
  const _ctx = this || {};

  return function () {
    const _args = arguments;

    function Styled(props, ref) {
      const theme = useTheme();
      const _props = _ctx.p = Object.assign({}, props, { theme });
      const _previousClassName = _props.className;

      _ctx.o = /\s*go[0-9]+/g.test(_previousClassName);
      _props.className = css.apply(_ctx, _args) + (_previousClassName ? " " + _previousClassName : "");
      if (forwardRef) {
        _props.ref = ref;
      }

      return h(
        tag,
        _props
      );
    }    return forwardRef ? forwardRef(Styled) : Styled;
  };
}

export { css, extractCss, glob, setForwardRef, setPragma, setUseTheme, styled };
//# sourceMappingURL=goober.js.map

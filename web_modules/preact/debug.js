import { Component as d$1, options as n, Fragment as y$1 } from '../preact.js';

var r={};function o(n){return n.type===y$1?"Wrapper":"function"==typeof n.type?"Composite":"string"==typeof n.type?"Native":"Text"}function i(n){return n.type===y$1?"Fragment":"function"==typeof n.type?n.type.displayName||n.type.name:"string"==typeof n.type?n.type:"#text"}function a(n,t,e){var r=t.pop(),o=t.reduce(function(n,t){return n?n[t]:null},n);o&&(o[r]=e);}function u(t){var e=t.__c,r=null;null!=e&&e instanceof d$1&&(r={setState:e.setState.bind(e),forceUpdate:e.forceUpdate.bind(e),setInState:function(n,t){e.setState(function(e){return a(e,n,t),e});},setInProps:function(n,r){a(t.props,n,r),e.setState({});},setInContext:function(n,t){a(e.context,n,t),e.setState({});}});var u=l(t),c=t.endTime-t.startTime;return {nodeType:o(t),type:t.type,name:i(t),ref:t.ref||null,key:t.key||null,updater:r,text:null===t.type?t.props:null,state:null!=e&&e instanceof d$1?e.state:null,props:t.props,children:null!==t.type?null!=u&&1==u.length&&null===u[0].type?u[0].props:u:null,publicInstance:f(t),memoizedInteractions:[],actualDuration:c,actualStartTime:t.startTime,treeBaseDuration:c}}function l(n){return null==n.__c?null!=n.__k?n.__k.filter(Boolean):[]:null!=n.__k?n.__k.filter(Boolean):null}function c(n){return n.type===y$1&&null===n.__}function f(n){return c(n)?n.__k.length>0&&null!=n.__k[0]&&null!=n.__k[0].__e?n.__k[0].__e.parentNode:n:null!=n.__c?n.__c:n.type===y$1?n.props:n.__e}function s(n,t,e){if(null==n||null==t)return !1;for(var r in n)if((!e||"children"!=r||null==t[r])&&n[r]!==t[r])return !1;return Object.keys(n).length===Object.keys(t).length}var d="function"==typeof WeakMap,p=d$1.prototype.setState;d$1.prototype.setState=function(n,t){return null==this.__v?console.warn('Calling "this.setState" inside the constructor of a component is a no-op and might be a bug in your application. Instead, set "this.state = {}" directly.'):null==this.__P&&console.warn('Can\'t call "this.setState" on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method.'),p.call(this,n,t)};var v=d$1.prototype.forceUpdate;function h(n){var t=n.props,e=i(n),r="";for(var o in t)if(t.hasOwnProperty(o)&&"children"!==o){var a=t[o];"function"==typeof a&&(a="function "+(a.displayName||a.name)+"() {}"),a=Object(a)!==a||a.toString?a+"":Object.prototype.toString.call(a),r+=" "+o+"="+JSON.stringify(a);}var u=t.children;return "<"+e+r+(u&&u.length?">..</"+e+">":" />")}d$1.prototype.forceUpdate=function(n){return null==this.__v?console.warn('Calling "this.forceUpdate" inside the constructor of a component is a no-op and might be a bug in your application.'):null==this.__P&&console.warn('Can\'t call "this.setState" on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method.'),v.call(this,n)};var y=function(){function n(n,t){this.rid=t,this.hook=n,this.pending=[],this.inst2vnode=new WeakMap,this.connected=!1;}var t=n.prototype;return t.markConnected=function(){this.connected=!0,this.flushPendingEvents();},t.flushPendingEvents=function(){if(this.connected){var n=this.pending;this.pending=[];for(var t=0;t<n.length;t++){var e=n[t];this.hook.emit(e.type,e);}}},t.mount=function(n){this.inst2vnode.set(f(n),n);var t=u(n),e=[{internalInstance:n,data:t,renderer:this.rid,type:"mount"}];if(Array.isArray(t.children))for(var r,o=t.children.slice();null!=(r=o.pop());){var i=l(r);o.push.apply(o,i),this.inst2vnode.set(f(r),r);var a=u(r);e.push({internalInstance:r,data:a,renderer:this.rid,type:"mount"});}for(var s=e.length;--s>=0;)this.pending.push(e[s]);c(n)&&this.pending.push({internalInstance:n,data:t,renderer:this.rid,type:"root"});},t.update=function(n){var t=u(n);if(Array.isArray(t.children))for(var e=0;e<t.children.length;e++){var r=t.children[e],o=f(r);null==this.inst2vnode.get(o)?this.mount(r):this.update(r),t.children[e]=this.inst2vnode.get(o);}var i=this.inst2vnode.get(t.publicInstance);!function(n,t){return n.props!==t.props&&!s(n.props,t.props,!0)||null!=n.__c&&!s(t.__c.__u,t.__c.state)||n.__e!==t.__e||n.ref!==t.ref}(i,n)?this.pending.push({internalInstance:i,data:t,renderer:this.rid,type:"updateProfileTimes"}):this.pending.push({internalInstance:i,data:t,renderer:this.rid,type:"update"});},t.handleCommitFiberRoot=function(n){var t=f(n);this.inst2vnode.has(t)?this.update(n):this.mount(n);var e=null;if(c(n))n.treeBaseDuration=0,e=n;else for(e=n;null!=e.__;)e=e.__;return this.pending.push({internalInstance:e,renderer:this.rid,data:u(e),type:"rootCommitted"}),this.flushPendingEvents(),n},t.handleCommitFiberUnmount=function(n){var t=f(n);this.inst2vnode.delete(t),this.pending.push({internalInstance:n,renderer:this.rid,type:"unmount"});},t.getNativeFromReactElement=function(n){return n.__e},t.getReactElementFromNative=function(n){return this.inst2vnode.get(n)||null},t.walkTree=function(){},t.cleanup=function(){},n}();function m(n){return "function"==typeof n.type?n.__c:n.__e}function b(n,t){return n.has(t)||n.set(""+t,n.size+1),n.get(t)}var w=new Map,g=function(n){return n.codePointAt(0)};function I(n){return null==n.__&&n.type===y$1}function O(n){return n.__k||[]}function j(n){return n.type===y$1?"Fragment":"function"==typeof n.type?n.type.displayName||n.type.name:"string"==typeof n.type?n.type:"#text"}function E(n,e){if(null==n.type)return !0;if("function"==typeof n.type){if(n.type===y$1&&e.type.has("fragment"))return null!=n.__}else if(e.type.has("dom"))return !0;if(e.regex.length>0){var r=j(n);return e.regex.some(function(n){return n.test(r)})}return !1}function k(n,t,e){return t in n?Object.defineProperty(n,t,{value:e,enumerable:!0,configurable:!0,writable:!0}):n[t]=e,n}function T(n,t){var e=Object.keys(n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(n);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable})),e.push.apply(e,r);}return e}function N(n){for(var t=1;t<arguments.length;t++){var e=null!=arguments[t]?arguments[t]:{};t%2?T(e,!0).forEach(function(t){k(n,t,e[t]);}):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(e)):T(e).forEach(function(t){Object.defineProperty(n,t,Object.getOwnPropertyDescriptor(e,t));});}return n}function M(n,t,e){if(void 0===e&&(e=new Set),e.has(n))return "...";var r=t(n);if(null!=r)return r;if(Array.isArray(n))return n.map(function(n){return M(n,t,e)});switch(typeof n){case"string":return n.length>300?n.slice(300):n;case"function":return {type:"function",name:n.displayName||n.name||"anonymous"};case"object":if(null===n)return null;e.add(n);var o=N({},n);return Object.keys(o).forEach(function(n){o[n]=M(o[n],t,e);}),o;default:return n}}function C(n){if("string"==typeof n||!n)return null;var t=N({},n);return Object.keys(t).length?t:null}var S=/__cC\d+/;function x(n,t,e){var r=t.pop(),o=t.reduce(function(n,t){return n?n[t]:null},n);o&&r&&(o[r]=e);}var W=1,F=2,_=3,A=4,D=5,U=6,B=1,P=2,Y=3,L=4,z=5,H=/^Memo\(/,R=/^ForwardRef\(/;function J(n){if("function"==typeof n.type&&n.type!==y$1){var e=j(n);return H.test(e)?D:R.test(e)?A:function(n){var t=n.__c;return null!=t&&null!=t.__u}(n)?U:n.type.prototype&&n.type.prototype.render?F:_}return W}function V(n){return function(n){return null!=n&&void 0!==n.type&&void 0!==n.__e}(n)?{type:"vnode",name:j(n)}:null}function X(n){var t,e=n.unmountIds,r=n.operations,o=[n.rootId].concat((t=[0],n.strings.forEach(function(n,e){var r;t[0]+=e.length+1,t.push.apply(t,[e.length].concat((w.has(r=e)||w.set(r,r.split("").map(g)),w.get(r))));}),t));return e.length>0&&o.push.apply(o,[Y,e.length].concat(e)),o.push.apply(o,r),{name:"operation",data:o}}var $={regex:[],type:new Set(["dom","fragment"])};function G(n,t,e,r,o){var i={operations:[],rootId:-1,strings:new Map,unmountIds:[]},a=-1,u=!n.hasId(e);if(I(e)){var l=u?n.createId(e):n.getId(e);a=i.rootId=l,t.add(e);}else{var c=function(n){for(var t=n;null!=(t=t.__);)if(I(t))return t;return n}(e);i.rootId=n.getId(c),a=n.getId(function(n){for(var t=n;null!=(t=t.__);)return t;return null}(e));}return u?q(n,i,e,a,r,o):function n(t,e,r,o,i,a){if(E(r,i))for(var u=O(r),l=0;l<u.length;l++){var c=u[l];null!=c&&n(t,e,c,o,i,a);}else{if(!t.hasId(r))return q(t,e,r,o,i,a),!0;var f=t.getId(r);e.operations.push(L,f,r.endTime-r.startTime),t.update(f,r);for(var s=!1,d=O(r),p=0;p<d.length;p++){var v=d[p];null==v||(t.hasId(v)||E(v,i)?(n(t,e,v,f,i,a),s=!0):(q(t,e,v,f,i,a),s=!0));}s&&function(n,t,e,r,o){var i,a=function(n,t){for(var e,r=O(n).slice(),o=[];r.length;)if(null!=(e=r.pop()))if(E(e,t)){var i=O(e);i.length>0&&r.push.apply(r,i.slice());}else o.push(e);return o.reverse()}(r,o);a.length<2||(i=n.operations).push.apply(i,[z,e,a.length].concat(a.map(function(n){return t.getId(n)})));}(e,t,f,r,i);}}(n,i,e,a,r,o),i}function q(n,t,e,r,o,i){var a=I(e),u=E(e,o);if(a||!u){var l=n.hasId(e)?n.getId(e):n.createId(e);I(e)&&t.operations.push(B,l),t.operations.push(P,l,J(e),r,9999,b(t.strings,j(e)),e.key?b(t.strings,e.key):0),r=l;}if("function"!=typeof e.type){var c=e.__e;c&&i.set(c,e);}for(var f=O(e),s=0;s<f.length;s++){var d=f[s];null!=d&&q(n,t,d,r,o,i);}}function K(n){return function(){try{return n.apply(void 0,arguments)}catch(n){console.error("The react devtools encountered an error"),console.error(n);}}}var Q=function(){},Z=Date.now;try{Z=performance.now.bind(performance);}catch(n){}(function(){var n$1=n.__b,t=n.diffed,o=n.vnode,a=n.__e,u=n.__,l=n.__h,c=d?{useEffect:new WeakMap,useLayoutEffect:new WeakMap,lazyPropTypes:new WeakMap}:null;n.__e=function(n,t,e){if(t&&t.__c&&"function"==typeof n.then){var r=n;n=new Error("Missing Suspense. The throwing component was: "+i(t));for(var o=t;o;o=o.__)if(o.__c&&o.__c.t){n=r;break}if(n instanceof Error)throw n}a(n,t,e);},n.__=function(n,t){if(!t)throw new Error("Undefined parent passed to render(), this is the second argument.\nCheck if the element is available in the DOM/has the correct id.");var e;switch(t.nodeType){case 1:case 11:case 9:e=!0;break;default:e=!1;}if(!e){var r=i(n);throw new Error("Expected a valid HTML node as a second argument to render.\tReceived "+t+" instead: render(<"+r+" />, "+t+");")}u&&u(n,t);},n.__b=function(t){var e,o,a,u,l=t.type,f=function n(t){return t?"function"==typeof t.type?n(t.__):t:{}}(t.__);if(void 0===l)throw new Error("Undefined component passed to createElement()\n\nYou likely forgot to export your component or might have mixed up default and named imports"+h(t));if(null!=l&&"object"==typeof l){if(void 0!==l.o&&void 0!==l.__e)throw new Error("Invalid type passed to createElement(): "+l+"\n\nDid you accidentally pass a JSX literal as JSX twice?\n\n  let My"+i(t)+" = "+h(l)+";\n  let vnode = <My"+i(t)+" />;\n\nThis usually happens when you export a JSX literal and not the component.");throw new Error("Invalid type passed to createElement(): "+(Array.isArray(l)?"array":l))}if("thead"!==l&&"tfoot"!==l&&"tbody"!==l||"table"===f.type?"tr"===l&&"thead"!==f.type&&"tfoot"!==f.type&&"tbody"!==f.type&&"table"!==f.type?console.error("Improper nesting of table. Your <tr> should have a <thead/tbody/tfoot/table> parent."+h(t)):"td"===l&&"tr"!==f.type?console.error("Improper nesting of table. Your <td> should have a <tr> parent."+h(t)):"th"===l&&"tr"!==f.type&&console.error("Improper nesting of table. Your <th> should have a <tr>."+h(t)):console.error("Improper nesting of table. Your <thead/tbody/tfoot> should have a <table> parent."+h(t)),void 0!==t.ref&&"function"!=typeof t.ref&&"object"!=typeof t.ref&&!("$$typeof"in t))throw new Error('Component\'s "ref" property should be a function, or an object created by createRef(), but got ['+typeof t.ref+"] instead\n"+h(t));if("string"==typeof t.type)for(var s in t.props)if("o"===s[0]&&"n"===s[1]&&"function"!=typeof t.props[s]&&null!=t.props[s])throw new Error("Component's \""+s+'" property should be a function, but got ['+typeof t.props[s]+"] instead\n"+h(t));if("function"==typeof t.type&&t.type.propTypes){if("Lazy"===t.type.displayName&&c&&!c.lazyPropTypes.has(t.type)){var d="PropTypes are not supported on lazy(). Use propTypes on the wrapped component itself. ";try{var p=t.type();c.lazyPropTypes.set(t.type,!0),console.warn(d+"Component wrapped in lazy() is "+i(p));}catch(n){console.warn(d+"We will log the wrapped component's name once it is loaded.");}}e=t.type.propTypes,o=t.props,a=i(t),u=h(t),Object.keys(e).forEach(function(n){var t;try{t=e[n](o,n,u,a,null,"SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");}catch(n){t=n;}!t||t.message in r||(r[t.message]=!0,console.error("Failed "+a+" type: "+t.message));});}n$1&&n$1(t);},n.__h=function(n){if(!n)throw new Error("Hook can only be invoked from render methods.");l&&l(n);};var f=function(n,t){return {get:function(){throw new Error("getting vnode."+n+" is deprecated, "+t)},set:function(){throw new Error("setting vnode."+n+" is not allowed, "+t)}}},s={nodeName:f("nodeName","use vnode.type"),attributes:f("attributes","use vnode.props"),children:f("children","use vnode.props.children")};n.vnode=function(n){var t,e;n.props&&n.props.__source&&(t=n.props.__source,delete n.props.__source),n.props&&n.props.__self&&(e=n.props.__self,delete n.props.__self),n.__self=e,n.__source=t,Object.defineProperties(n,s),o&&o(n);},n.diffed=function(n){n.__k&&n.__k.forEach(function(n){if(n&&void 0===n.type){delete n.__,delete n.__b;var t=Object.keys(n).join(",");throw new Error("Objects are not valid as a child. Encountered an object with the keys {"+t+"}.")}});var e=n.__c;if(e&&e.i){var r=e.i;Array.isArray(r.u)&&r.u.forEach(function(t){if(t.l&&(!t.s||!Array.isArray(t.s))){var e=i(n);console.warn("In "+e+" you are calling useMemo/useCallback without passing arguments.\nThis is a noop since it will not be able to memoize, it will execute it every render.");}}),Array.isArray(r.p)&&r.p.forEach(function(t){if(!Array.isArray(t.s)&&c&&!c.useEffect.has(n.type)){c.useEffect.set(n.type,!0);var e=i(n);console.warn('You should provide an array of arguments as the second argument to the "useEffect" hook.\n\nNot doing so will invoke this effect on every render.\n\nThis effect can be found in the render of '+e+".");}}),e.__h.forEach(function(t){if(t.v&&!Array.isArray(t.s)&&c&&!c.useLayoutEffect.has(n.type)){c.useLayoutEffect.set(n.type,!0);var e=i(n);console.warn('You should provide an array of arguments as the second argument to the "useLayoutEffect" hook.\n\nNot doing so will invoke this effect on every render.\n\nThis effect can be found in the render of '+e+".");}});}if(t&&t(n),null!=n.__k)for(var o=[],a=0;a<n.__k.length;a++){var u=n.__k[a];if(u&&null!=u.key){var l=u.key;if(-1!==o.indexOf(l)){console.error('Following component has two or more children with the same key attribute: "'+l+'". This may cause glitches and misbehavior in rendering process. Component: \n\n'+h(n));break}o.push(l);}}};}(),function(){var r=window.__PREACT_DEVTOOLS__;if(r){var o=function(n,t){void 0===t&&(t=$);var e,r,o,i,a,u,l=(e=new Map,r=new Map,o=new Map,i=1,{has:function(n){return o.has(n)},update:function(n,t){var e=m(t);o.set(n,e),r.set(n,t);},getVNode:function(n){return r.get(n)||null},hasId:a=function(n){return null!=n&&e.has(m(n))},createId:function(n){var t=i++,a=m(n);return e.set(a,t),o.set(t,a),r.set(t,n),t},getId:u=function(n){if(null==n)return -1;var t=m(n);return e.get(t)||-1},remove:function(n){if(a(n)){var t=u(n);o.delete(t),r.delete(t);}var i=m(n);e.delete(i);}}),c=new Set,f=[],s=[],d=new WeakMap;return {getVNodeById:function(n){return l.getVNode(n)},has:function(n){return l.has(n)},getDisplayName:j,forceUpdate:function(n){var t=l.getVNode(n);if(t){var e=t.__c;e&&e.forceUpdate();}},log:function(n,t){var e=l.getVNode(n);null!=e?function(n,t,e){var r=j(n);console.group("LOG %c"+("#text"===r?r:"<"+(r||"Component")+" />"),"color: #ea88fd; font-weight: normal"),console.log("props:",n.props);var o=n.__c;null!=o&&console.log("state:",o.state),console.log("vnode:",n),console.log("devtools id:",t),console.log("devtools children:",e),console.groupEnd();}(e,n,t):console.warn("Could not find vnode with id "+n);},inspect:function(n){var t=l.getVNode(n);if(!t)return null;var e=t.__c,r="function"==typeof t.type&&null!=e&&Object.keys(e.state).length>0,o=null!=e&&null!=function(n){return n.i||null}(e),i=null;return null!=e&&(i=function(n){return "Consumer"===j(n)}(t)?{value:e.context}:function(n){var t={};for(var e in n)S.test(e)||(t[e]=n[e]);return 0==Object.keys(t).length?null:t}(e.context)),{context:null!=i?M(i,V):null,canEditHooks:o,hooks:null,id:n,name:j(t),canEditProps:!0,props:M(C(t.props),V),canEditState:!0,state:r?M(e.state,V):null,type:J(t)}},findDomForVNode:function(n){var t=l.getVNode(n);return t?[t.__e,t.o]:null},findVNodeIdForDom:function(n){var e=d.get(n);if(e){if(E(e,t)){for(var r=e;null!=(r=r.__)&&E(r,t););return l.getId(r)}return l.getId(e)}return -1},applyFilters:function(e){var r=this;c.forEach(function(n){var t=O(n);t.length>0&&null!=t[0]&&function(n,t){t(n);for(var e=O(n),r=0;r<e.length;r++){var o=e[r];null!=o&&t(o);}}(t[0],function(n){return r.onUnmount(n)});var e=X({operations:[],rootId:l.getId(n),strings:new Map,unmountIds:s});s=[],f.push(e);}),t.regex=e.regex,t.type=e.type,c.forEach(function(n){var e=X(G(l,c,n,t,d));f.push(e);}),n.connected&&this.flushInitial();},flushInitial:function(){f.forEach(function(t){return n.emit(t.name,t.data)}),n.connected=!0,f=[];},onCommit:function(e){var r,o=G(l,c,e,t,d);(r=o.unmountIds).push.apply(r,s),s=[];var i=X(o);n.connected?n.emit(i.name,i.data):f.push(i);},onUnmount:function(n){if(E(n,t)){if("function"!=typeof n.type){var e=n.__e;null!=e&&d.delete(e);}}else l.hasId(n)&&s.push(l.getId(n));l.remove(n);},update:function(n,t,e,r){var o=l.getVNode(n);if(null!==o&&"function"==typeof o.type){var i=o.__c;"props"===t?x(o.props||{},e.slice(),r):"state"===t?x(i.state||{},e.slice(),r):"context"===t&&x(i.context||{},e.slice(),r),i.forceUpdate();}}}}(r);return function(n,t){var e=n.vnode,r=n.__c,o=n.unmount,i=n.__b,a=n.diffed;n.vnode=function(n){n.startTime=NaN,n.endTime=NaN,n.startTime=0,n.endTime=-1,e&&e(n);},n.__b=function(n){n.startTime=performance.now(),null!=i&&i(n);},n.diffed=function(n){n.endTime=performance.now(),a&&a(n);},n.__c=function(n,e){r&&r(n,e),null!=n&&t.onCommit(n);},n.unmount=function(n){o&&o(n),t.onUnmount(n);};}(n,o),void r.attach(o)}var i=window.__REACT_DEVTOOLS_GLOBAL_HOOK__;if(null!=i){var a=Q,u=Q,l=Math.random().toString(16).slice(2),c=new y(i,l);K(function(){var n=!1;try{n="production"!=="development";}catch(n){}window.parent.postMessage({source:"react-devtools-detector",reactBuildType:n?"development":"production"},"*");var e={bundleType:n?1:0,version:"16.5.2",rendererPackageName:"preact",findHostInstanceByFiber:function(n){return n.__e},findFiberByHostInstance:function(n){return c.inst2vnode.get(n)||null}};if(i._renderers){i._renderers[l]=e,Object.defineProperty(i.helpers,l,{get:function(){return c},set:function(){c.connected||r.markConnected();}});var r=i.helpers[l];i.emit("renderer-attached",{id:l,renderer:e,helpers:r}),a=K(function(n){if(n.type!==y$1||0!=n.__k.length){var e=i.getFiberRoots(l);n=r.handleCommitFiberRoot(n),e.has(n)||e.add(n);}}),u=K(function(n){i.onCommitFiberUnmount(l,n);});}else console.info("Preact is not compatible with your version of react-devtools. We will address this in future releases.");})();var f=n.vnode,s=n.__c,d=n.unmount,p=n.__b,v=n.diffed;n.vnode=function(n){n.startTime=NaN,n.endTime=NaN,n.startTime=0,n.endTime=-1,f&&f(n);},n.__b=function(n){n.startTime=Z(),null!=p&&p(n);},n.diffed=function(n){n.endTime=Z(),null!=v&&v(n);},n.__c=K(function(n,t){null!=s&&s(n,t),null!=n&&a(n);}),n.unmount=K(function(n){null!=d&&d(n),u(n);});var h=d$1.prototype.setState;d$1.prototype.setState=function(n,t){var e=this.__s!==this.state&&this.__s||(this.__s=Object.assign({},this.state));return this.__u=Object.assign({},e),h.call(this,n,t)};}}());
//# sourceMappingURL=debug.js.map
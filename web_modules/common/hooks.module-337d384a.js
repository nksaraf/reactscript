import { options as n$1 } from '../preact.js';

var t,r,u=[],i=n$1.__r;n$1.__r=function(n){i&&i(n),t=0,(r=n.__c).__H&&(r.__H.t=A(r.__H.t));};var f=n$1.diffed;n$1.diffed=function(n){f&&f(n);var t=n.__c;if(t){var r=t.__H;r&&(r.u=(r.u.some(function(n){n.ref&&(n.ref.current=n.createHandle());}),[]),r.i=A(r.i));}};var o=n$1.unmount;function e(t){n$1.__h&&n$1.__h(r);var u=r.__H||(r.__H={o:[],t:[],i:[],u:[]});return t>=u.o.length&&u.o.push({}),u.o[t]}function c(n){return a(q,n)}function a(n,u,i){var f=e(t++);return f.__c||(f.__c=r,f.v=[i?i(u):q(void 0,u),function(t){var r=n(f.v[0],t);f.v[0]!==r&&(f.v[0]=r,f.__c.setState({}));}]),f.v}function v(n,u){var i=e(t++);h(i.m,u)&&(i.v=n,i.m=u,r.__H.t.push(i),T(r));}function m(n,u){var i=e(t++);h(i.m,u)&&(i.v=n,i.m=u,r.__H.i.push(i));}function d(n){return l(function(){return {current:n}},[])}function p(n,u,i){var f=e(t++);h(f.m,i)&&(f.m=i,r.__H.u.push({ref:n,createHandle:u}));}function l(n,r){var u=e(t++);return h(u.m,r)?(u.m=r,u.p=n,u.v=n()):u.v}function s(n,t){return l(function(){return n},t)}function y(n){var u=r.context[n.__c];if(!u)return n.__p;var i=e(t++);return null==i.v&&(i.v=!0,u.sub(r)),u.props.value}function _(t,r){n$1.useDebugValue&&n$1.useDebugValue(r?r(t):t);}n$1.unmount=function(n){o&&o(n);var t=n.__c;if(t){var r=t.__H;r&&r.o.forEach(function(n){return n.l&&n.l()});}};var T=function(){};function g(){u.some(function(n){n.s=!1,n.__P&&(n.__H.t=A(n.__H.t));}),u=[];}if("undefined"!=typeof window){var w=n$1.requestAnimationFrame;T=function(t){(!t.s&&(t.s=!0)&&1===u.push(t)||w!==n$1.requestAnimationFrame)&&(w=n$1.requestAnimationFrame,(n$1.requestAnimationFrame||function(n){var t=function(){clearTimeout(r),cancelAnimationFrame(u),setTimeout(n);},r=setTimeout(t,100),u=requestAnimationFrame(t);})(g));};}function A(n){return n.forEach(E),n.forEach(F),[]}function E(n){n.l&&n.l();}function F(n){var t=n.v();"function"==typeof t&&(n.l=t);}function h(n,t){return !n||t.some(function(t,r){return t!==n[r]})}function q(n,t){return "function"==typeof t?t(n):t}

var n = /*#__PURE__*/Object.freeze({
	__proto__: null,
	useState: c,
	useReducer: a,
	useEffect: v,
	useLayoutEffect: m,
	useRef: d,
	useImperativeHandle: p,
	useMemo: l,
	useCallback: s,
	useContext: y,
	useDebugValue: _
});

export { _, a, c, d, l, m, n, p, s, v, y };
//# sourceMappingURL=hooks.module-337d384a.js.map
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e(t["@linked/react"]={})}(this,function(t){"use strict";var e=function(t,n){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,n)};function n(t,n){function r(){this.constructor=t}e(t,n),t.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}var r=function(){return(r=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++)for(var o in e=arguments[n])Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t}).apply(this,arguments)},o=Array.prototype,u=Object.prototype;function i(t){if(t&&"object"==typeof t)switch(Object.getPrototypeOf(t)){case o:return c;case u:return s}return a}var a={clone:function(t){return t},map:function(t,e){return[]},remove:function(t){return t}},s={map:function(t,e){var n=[],r=t.value;for(var o in r)if(r.hasOwnProperty(o)){var u=e(t.at(o),o);void 0===u||n.push(u)}return n},remove:function(t,e){return delete t[e],t},clone:function(t){return r({},t)}},c={clone:function(t){return t.slice()},remove:function(t,e){return t.splice(e,1),t},map:function(t,e){for(var n=t.value.length,r=Array(n),o=0,u=0;o<n;o++){var i=e(t.at(o),o);void 0===i||(r[u++]=i)}return r.length===u||(r.length=u),r}},p=function(){function t(t){this.value=t}return t.value=function(t,e){return new l(t,e)},t.getValues=function(t){return g(t,"value")},Object.defineProperty(t.prototype,"current",{get:function(){return this.value},set:function(t){this.set(t)},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"_changeToken",{get:function(){return this.value},enumerable:!0,configurable:!0}),t.getErrors=function(t){return g(t,"error")},t.hasErrors=function(t){for(var e in t)if(t.hasOwnProperty(e)&&t[e].error)return!0;return!1},t.setValues=function(t,e){if(e)for(var n in t){var r=m(n);if(e.hasOwnProperty(r)){var o=e[r];void 0===o||t[n].set(o)}}},t.prototype.onChange=function(t){var e=this;return new f(this,function(n){t(n),e.set(n)})},Object.defineProperty(t.prototype,"props",{get:function(){var t=this;return"boolean"==typeof this.value?{checked:this.value,onChange:function(e){return t.set(Boolean(e.target.checked))}}:{value:this.value,onChange:function(e){return t.set(e.target.value)}}},enumerable:!0,configurable:!0}),t.prototype.update=function(t,e){var n=t(this.clone(),e);void 0===n||this.set(n)},t.prototype.pipe=function(t){var e=this;return new f(this,function(n){var r=t(n,e.value);void 0===r||e.set(r)})},t.prototype.action=function(t){var e=this;return function(n){return e.update(t,n)}},t.prototype.equals=function(t){return new h(this,t)},t.prototype.enabled=function(t){return new v(this,t||"")},t.prototype.contains=function(t){return new y(this,t)},t.prototype.push=function(){var t=c.clone(this.value);Array.prototype.push.apply(t,arguments),this.set(t)},t.prototype.unshift=function(){var t=c.clone(this.value);Array.prototype.unshift.apply(t,arguments),this.set(t)},t.prototype.splice=function(){var t=c.clone(this.value);Array.prototype.splice.apply(t,arguments),this.set(t)},t.prototype.map=function(t){return i(this.value).map(this,t)},t.prototype.removeAt=function(t){var e=this.value,n=i(e);this.set(n.remove(n.clone(e),t))},t.prototype.at=function(t){return new b(this,t)},t.prototype.clone=function(){var t=this.value;return i(t).clone(t)},t.prototype.pick=function(){for(var t={},e=arguments.length?arguments:Object.keys(this.value),n=0;n<e.length;n++){var r=e[n];t[r]=new b(this,r)}return t},t.prototype.$links=function(){var t={},e=this.value;for(var n in e)e.hasOwnProperty(n)&&(t["$"+n]=new b(this,n));return t},t.prototype.check=function(t,e){return this.error||t(this.value)||(this.error=e||t.error||d),this},t}(),l=function(t){function e(e,n){var r=t.call(this,e)||this;return r.set=n,r}return n(e,t),e.prototype.set=function(t){},e}(p),f=function(t){function e(e,n){var r=t.call(this,e.value)||this;r.set=n;var o=e.error;return o&&(r.error=o),r}return n(e,t),e.prototype.set=function(t){},e}(p),h=function(t){function e(e,n){var r=t.call(this,e.value===n)||this;return r.parent=e,r.truthyValue=n,r}return n(e,t),e.prototype.set=function(t){this.parent.set(t?this.truthyValue:null)},e}(p),v=function(t){function e(e,n){var r=t.call(this,null!=e.value)||this;return r.parent=e,r.defaultValue=n,r}return n(e,t),e.prototype.set=function(t){this.parent.set(t?this.defaultValue:null)},e}(p),y=function(t){function e(e,n){var r=t.call(this,e.value.indexOf(n)>=0)||this;return r.parent=e,r.element=n,r}return n(e,t),e.prototype.set=function(t){var e=this,n=Boolean(t);if(this.value!==n){var r=this.parent.value,o=t?r.concat(this.element):r.filter(function(t){return t!==e.element});this.parent.set(o)}},e}(p),d="Invalid value",b=function(t){function e(e,n){var r=t.call(this,e.value[n])||this;return r.parent=e,r.key=n,r}return n(e,t),e.prototype.remove=function(){this.parent.removeAt(this.key)},e.prototype.set=function(t){var e=this;this.value!==t&&this.parent.update(function(n){return n[e.key]=t,n})},e}(p);function g(t,e){var n={};for(var r in t)if(t.hasOwnProperty(r)){var o=t[r][e];void 0!==o&&(n[m(r)]=o)}return n}function m(t){return"$"===t[0]?t.slice(1):t}t.ValueLink=p,t.CustomValueLink=l,t.ClonedValueLink=f,t.EqualsValueLink=h,t.EnabledValueLink=v,t.ContainsRef=y,t.PropValueLink=b,t.helpers=i,t.objectHelpers=s,t.arrayHelpers=c,Object.defineProperty(t,"__esModule",{value:!0})});
//# sourceMappingURL=index.js.map
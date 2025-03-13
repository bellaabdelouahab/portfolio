import{R as jt,P as b}from"./index-DJGXM9mn.js";function ct(n,t){var e=Object.keys(n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(n);t&&(a=a.filter(function(r){return Object.getOwnPropertyDescriptor(n,r).enumerable})),e.push.apply(e,a)}return e}function c(n){for(var t=1;t<arguments.length;t++){var e=arguments[t]!=null?arguments[t]:{};t%2?ct(Object(e),!0).forEach(function(a){O(n,a,e[a])}):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(e)):ct(Object(e)).forEach(function(a){Object.defineProperty(n,a,Object.getOwnPropertyDescriptor(e,a))})}return n}function An(n){"@babel/helpers - typeof";return An=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},An(n)}function be(n,t){if(!(n instanceof t))throw new TypeError("Cannot call a class as a function")}function pe(n,t){for(var e=0;e<t.length;e++){var a=t[e];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(n,a.key,a)}}function ge(n,t,e){return t&&pe(n.prototype,t),Object.defineProperty(n,"prototype",{writable:!1}),n}function O(n,t,e){return t in n?Object.defineProperty(n,t,{value:e,enumerable:!0,configurable:!0,writable:!0}):n[t]=e,n}function Jn(n,t){return ye(n)||we(n,t)||Ft(n,t)||Ae()}function ln(n){return he(n)||ke(n)||Ft(n)||xe()}function he(n){if(Array.isArray(n))return Fn(n)}function ye(n){if(Array.isArray(n))return n}function ke(n){if(typeof Symbol<"u"&&n[Symbol.iterator]!=null||n["@@iterator"]!=null)return Array.from(n)}function we(n,t){var e=n==null?null:typeof Symbol<"u"&&n[Symbol.iterator]||n["@@iterator"];if(e!=null){var a=[],r=!0,i=!1,o,s;try{for(e=e.call(n);!(r=(o=e.next()).done)&&(a.push(o.value),!(t&&a.length===t));r=!0);}catch(f){i=!0,s=f}finally{try{!r&&e.return!=null&&e.return()}finally{if(i)throw s}}return a}}function Ft(n,t){if(n){if(typeof n=="string")return Fn(n,t);var e=Object.prototype.toString.call(n).slice(8,-1);if(e==="Object"&&n.constructor&&(e=n.constructor.name),e==="Map"||e==="Set")return Array.from(n);if(e==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e))return Fn(n,t)}}function Fn(n,t){(t==null||t>n.length)&&(t=n.length);for(var e=0,a=new Array(t);e<t;e++)a[e]=n[e];return a}function xe(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Ae(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var mt=function(){},Zn={},Dt={},Yt=null,$t={mark:mt,measure:mt};try{typeof window<"u"&&(Zn=window),typeof document<"u"&&(Dt=document),typeof MutationObserver<"u"&&(Yt=MutationObserver),typeof performance<"u"&&($t=performance)}catch{}var Oe=Zn.navigator||{},dt=Oe.userAgent,vt=dt===void 0?"":dt,F=Zn,h=Dt,bt=Yt,mn=$t;F.document;var z=!!h.documentElement&&!!h.head&&typeof h.addEventListener=="function"&&typeof h.createElement=="function",Ut=~vt.indexOf("MSIE")||~vt.indexOf("Trident/"),dn,vn,bn,pn,gn,_="___FONT_AWESOME___",Dn=16,Wt="fa",Ht="svg-inline--fa",G="data-fa-i2svg",Yn="data-fa-pseudo-element",Pe="data-fa-pseudo-element-pending",nt="data-prefix",tt="data-icon",pt="fontawesome-i2svg",Se="async",Ee=["HTML","HEAD","STYLE","SCRIPT"],Gt=function(){try{return!0}catch{return!1}}(),g="classic",y="sharp",et=[g,y];function un(n){return new Proxy(n,{get:function(e,a){return a in e?e[a]:e[g]}})}var an=un((dn={},O(dn,g,{fa:"solid",fas:"solid","fa-solid":"solid",far:"regular","fa-regular":"regular",fal:"light","fa-light":"light",fat:"thin","fa-thin":"thin",fad:"duotone","fa-duotone":"duotone",fab:"brands","fa-brands":"brands",fak:"kit",fakd:"kit","fa-kit":"kit","fa-kit-duotone":"kit"}),O(dn,y,{fa:"solid",fass:"solid","fa-solid":"solid",fasr:"regular","fa-regular":"regular",fasl:"light","fa-light":"light",fast:"thin","fa-thin":"thin"}),dn)),rn=un((vn={},O(vn,g,{solid:"fas",regular:"far",light:"fal",thin:"fat",duotone:"fad",brands:"fab",kit:"fak"}),O(vn,y,{solid:"fass",regular:"fasr",light:"fasl",thin:"fast"}),vn)),on=un((bn={},O(bn,g,{fab:"fa-brands",fad:"fa-duotone",fak:"fa-kit",fal:"fa-light",far:"fa-regular",fas:"fa-solid",fat:"fa-thin"}),O(bn,y,{fass:"fa-solid",fasr:"fa-regular",fasl:"fa-light",fast:"fa-thin"}),bn)),Ce=un((pn={},O(pn,g,{"fa-brands":"fab","fa-duotone":"fad","fa-kit":"fak","fa-light":"fal","fa-regular":"far","fa-solid":"fas","fa-thin":"fat"}),O(pn,y,{"fa-solid":"fass","fa-regular":"fasr","fa-light":"fasl","fa-thin":"fast"}),pn)),Ie=/fa(s|r|l|t|d|b|k|ss|sr|sl|st)?[\-\ ]/,Xt="fa-layers-text",Ne=/Font ?Awesome ?([56 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp|Kit)?.*/i,Te=un((gn={},O(gn,g,{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"}),O(gn,y,{900:"fass",400:"fasr",300:"fasl",100:"fast"}),gn)),Bt=[1,2,3,4,5,6,7,8,9,10],_e=Bt.concat([11,12,13,14,15,16,17,18,19,20]),Me=["class","data-prefix","data-icon","data-fa-transform","data-fa-mask"],W={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},sn=new Set;Object.keys(rn[g]).map(sn.add.bind(sn));Object.keys(rn[y]).map(sn.add.bind(sn));var Le=[].concat(et,ln(sn),["2xs","xs","sm","lg","xl","2xl","beat","border","fade","beat-fade","bounce","flip-both","flip-horizontal","flip-vertical","flip","fw","inverse","layers-counter","layers-text","layers","li","pull-left","pull-right","pulse","rotate-180","rotate-270","rotate-90","rotate-by","shake","spin-pulse","spin-reverse","spin","stack-1x","stack-2x","stack","ul",W.GROUP,W.SWAP_OPACITY,W.PRIMARY,W.SECONDARY]).concat(Bt.map(function(n){return"".concat(n,"x")})).concat(_e.map(function(n){return"w-".concat(n)})),tn=F.FontAwesomeConfig||{};function ze(n){var t=h.querySelector("script["+n+"]");if(t)return t.getAttribute(n)}function Re(n){return n===""?!0:n==="false"?!1:n==="true"?!0:n}if(h&&typeof h.querySelector=="function"){var je=[["data-family-prefix","familyPrefix"],["data-css-prefix","cssPrefix"],["data-family-default","familyDefault"],["data-style-default","styleDefault"],["data-replacement-class","replacementClass"],["data-auto-replace-svg","autoReplaceSvg"],["data-auto-add-css","autoAddCss"],["data-auto-a11y","autoA11y"],["data-search-pseudo-elements","searchPseudoElements"],["data-observe-mutations","observeMutations"],["data-mutate-approach","mutateApproach"],["data-keep-original-source","keepOriginalSource"],["data-measure-performance","measurePerformance"],["data-show-missing-icons","showMissingIcons"]];je.forEach(function(n){var t=Jn(n,2),e=t[0],a=t[1],r=Re(ze(e));r!=null&&(tn[a]=r)})}var Vt={styleDefault:"solid",familyDefault:"classic",cssPrefix:Wt,replacementClass:Ht,autoReplaceSvg:!0,autoAddCss:!0,autoA11y:!0,searchPseudoElements:!1,observeMutations:!0,mutateApproach:"async",keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};tn.familyPrefix&&(tn.cssPrefix=tn.familyPrefix);var J=c(c({},Vt),tn);J.autoReplaceSvg||(J.observeMutations=!1);var d={};Object.keys(Vt).forEach(function(n){Object.defineProperty(d,n,{enumerable:!0,set:function(e){J[n]=e,en.forEach(function(a){return a(d)})},get:function(){return J[n]}})});Object.defineProperty(d,"familyPrefix",{enumerable:!0,set:function(t){J.cssPrefix=t,en.forEach(function(e){return e(d)})},get:function(){return J.cssPrefix}});F.FontAwesomeConfig=d;var en=[];function Fe(n){return en.push(n),function(){en.splice(en.indexOf(n),1)}}var B=Dn,T={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function De(n){if(!(!n||!z)){var t=h.createElement("style");t.setAttribute("type","text/css"),t.innerHTML=n;for(var e=h.head.childNodes,a=null,r=e.length-1;r>-1;r--){var i=e[r],o=(i.tagName||"").toUpperCase();["STYLE","LINK"].indexOf(o)>-1&&(a=i)}return h.head.insertBefore(t,a),n}}var Ye="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function fn(){for(var n=12,t="";n-- >0;)t+=Ye[Math.random()*62|0];return t}function Z(n){for(var t=[],e=(n||[]).length>>>0;e--;)t[e]=n[e];return t}function at(n){return n.classList?Z(n.classList):(n.getAttribute("class")||"").split(" ").filter(function(t){return t})}function qt(n){return"".concat(n).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function $e(n){return Object.keys(n||{}).reduce(function(t,e){return t+"".concat(e,'="').concat(qt(n[e]),'" ')},"").trim()}function En(n){return Object.keys(n||{}).reduce(function(t,e){return t+"".concat(e,": ").concat(n[e].trim(),";")},"")}function rt(n){return n.size!==T.size||n.x!==T.x||n.y!==T.y||n.rotate!==T.rotate||n.flipX||n.flipY}function Ue(n){var t=n.transform,e=n.containerWidth,a=n.iconWidth,r={transform:"translate(".concat(e/2," 256)")},i="translate(".concat(t.x*32,", ").concat(t.y*32,") "),o="scale(".concat(t.size/16*(t.flipX?-1:1),", ").concat(t.size/16*(t.flipY?-1:1),") "),s="rotate(".concat(t.rotate," 0 0)"),f={transform:"".concat(i," ").concat(o," ").concat(s)},u={transform:"translate(".concat(a/2*-1," -256)")};return{outer:r,inner:f,path:u}}function We(n){var t=n.transform,e=n.width,a=e===void 0?Dn:e,r=n.height,i=r===void 0?Dn:r,o="";return Ut?o+="translate(".concat(t.x/B-a/2,"em, ").concat(t.y/B-i/2,"em) "):o+="translate(calc(-50% + ".concat(t.x/B,"em), calc(-50% + ").concat(t.y/B,"em)) "),o+="scale(".concat(t.size/B*(t.flipX?-1:1),", ").concat(t.size/B*(t.flipY?-1:1),") "),o+="rotate(".concat(t.rotate,"deg) "),o}var He=`:root, :host {
  --fa-font-solid: normal 900 1em/1 "Font Awesome 6 Solid";
  --fa-font-regular: normal 400 1em/1 "Font Awesome 6 Regular";
  --fa-font-light: normal 300 1em/1 "Font Awesome 6 Light";
  --fa-font-thin: normal 100 1em/1 "Font Awesome 6 Thin";
  --fa-font-duotone: normal 900 1em/1 "Font Awesome 6 Duotone";
  --fa-font-sharp-solid: normal 900 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-regular: normal 400 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-light: normal 300 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-thin: normal 100 1em/1 "Font Awesome 6 Sharp";
  --fa-font-brands: normal 400 1em/1 "Font Awesome 6 Brands";
}

svg:not(:root).svg-inline--fa, svg:not(:host).svg-inline--fa {
  overflow: visible;
  box-sizing: content-box;
}

.svg-inline--fa {
  display: var(--fa-display, inline-block);
  height: 1em;
  overflow: visible;
  vertical-align: -0.125em;
}
.svg-inline--fa.fa-2xs {
  vertical-align: 0.1em;
}
.svg-inline--fa.fa-xs {
  vertical-align: 0em;
}
.svg-inline--fa.fa-sm {
  vertical-align: -0.0714285705em;
}
.svg-inline--fa.fa-lg {
  vertical-align: -0.2em;
}
.svg-inline--fa.fa-xl {
  vertical-align: -0.25em;
}
.svg-inline--fa.fa-2xl {
  vertical-align: -0.3125em;
}
.svg-inline--fa.fa-pull-left {
  margin-right: var(--fa-pull-margin, 0.3em);
  width: auto;
}
.svg-inline--fa.fa-pull-right {
  margin-left: var(--fa-pull-margin, 0.3em);
  width: auto;
}
.svg-inline--fa.fa-li {
  width: var(--fa-li-width, 2em);
  top: 0.25em;
}
.svg-inline--fa.fa-fw {
  width: var(--fa-fw-width, 1.25em);
}

.fa-layers svg.svg-inline--fa {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
}

.fa-layers-counter, .fa-layers-text {
  display: inline-block;
  position: absolute;
  text-align: center;
}

.fa-layers {
  display: inline-block;
  height: 1em;
  position: relative;
  text-align: center;
  vertical-align: -0.125em;
  width: 1em;
}
.fa-layers svg.svg-inline--fa {
  -webkit-transform-origin: center center;
          transform-origin: center center;
}

.fa-layers-text {
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
  -webkit-transform-origin: center center;
          transform-origin: center center;
}

.fa-layers-counter {
  background-color: var(--fa-counter-background-color, #ff253a);
  border-radius: var(--fa-counter-border-radius, 1em);
  box-sizing: border-box;
  color: var(--fa-inverse, #fff);
  line-height: var(--fa-counter-line-height, 1);
  max-width: var(--fa-counter-max-width, 5em);
  min-width: var(--fa-counter-min-width, 1.5em);
  overflow: hidden;
  padding: var(--fa-counter-padding, 0.25em 0.5em);
  right: var(--fa-right, 0);
  text-overflow: ellipsis;
  top: var(--fa-top, 0);
  -webkit-transform: scale(var(--fa-counter-scale, 0.25));
          transform: scale(var(--fa-counter-scale, 0.25));
  -webkit-transform-origin: top right;
          transform-origin: top right;
}

.fa-layers-bottom-right {
  bottom: var(--fa-bottom, 0);
  right: var(--fa-right, 0);
  top: auto;
  -webkit-transform: scale(var(--fa-layers-scale, 0.25));
          transform: scale(var(--fa-layers-scale, 0.25));
  -webkit-transform-origin: bottom right;
          transform-origin: bottom right;
}

.fa-layers-bottom-left {
  bottom: var(--fa-bottom, 0);
  left: var(--fa-left, 0);
  right: auto;
  top: auto;
  -webkit-transform: scale(var(--fa-layers-scale, 0.25));
          transform: scale(var(--fa-layers-scale, 0.25));
  -webkit-transform-origin: bottom left;
          transform-origin: bottom left;
}

.fa-layers-top-right {
  top: var(--fa-top, 0);
  right: var(--fa-right, 0);
  -webkit-transform: scale(var(--fa-layers-scale, 0.25));
          transform: scale(var(--fa-layers-scale, 0.25));
  -webkit-transform-origin: top right;
          transform-origin: top right;
}

.fa-layers-top-left {
  left: var(--fa-left, 0);
  right: auto;
  top: var(--fa-top, 0);
  -webkit-transform: scale(var(--fa-layers-scale, 0.25));
          transform: scale(var(--fa-layers-scale, 0.25));
  -webkit-transform-origin: top left;
          transform-origin: top left;
}

.fa-1x {
  font-size: 1em;
}

.fa-2x {
  font-size: 2em;
}

.fa-3x {
  font-size: 3em;
}

.fa-4x {
  font-size: 4em;
}

.fa-5x {
  font-size: 5em;
}

.fa-6x {
  font-size: 6em;
}

.fa-7x {
  font-size: 7em;
}

.fa-8x {
  font-size: 8em;
}

.fa-9x {
  font-size: 9em;
}

.fa-10x {
  font-size: 10em;
}

.fa-2xs {
  font-size: 0.625em;
  line-height: 0.1em;
  vertical-align: 0.225em;
}

.fa-xs {
  font-size: 0.75em;
  line-height: 0.0833333337em;
  vertical-align: 0.125em;
}

.fa-sm {
  font-size: 0.875em;
  line-height: 0.0714285718em;
  vertical-align: 0.0535714295em;
}

.fa-lg {
  font-size: 1.25em;
  line-height: 0.05em;
  vertical-align: -0.075em;
}

.fa-xl {
  font-size: 1.5em;
  line-height: 0.0416666682em;
  vertical-align: -0.125em;
}

.fa-2xl {
  font-size: 2em;
  line-height: 0.03125em;
  vertical-align: -0.1875em;
}

.fa-fw {
  text-align: center;
  width: 1.25em;
}

.fa-ul {
  list-style-type: none;
  margin-left: var(--fa-li-margin, 2.5em);
  padding-left: 0;
}
.fa-ul > li {
  position: relative;
}

.fa-li {
  left: calc(var(--fa-li-width, 2em) * -1);
  position: absolute;
  text-align: center;
  width: var(--fa-li-width, 2em);
  line-height: inherit;
}

.fa-border {
  border-color: var(--fa-border-color, #eee);
  border-radius: var(--fa-border-radius, 0.1em);
  border-style: var(--fa-border-style, solid);
  border-width: var(--fa-border-width, 0.08em);
  padding: var(--fa-border-padding, 0.2em 0.25em 0.15em);
}

.fa-pull-left {
  float: left;
  margin-right: var(--fa-pull-margin, 0.3em);
}

.fa-pull-right {
  float: right;
  margin-left: var(--fa-pull-margin, 0.3em);
}

.fa-beat {
  -webkit-animation-name: fa-beat;
          animation-name: fa-beat;
  -webkit-animation-delay: var(--fa-animation-delay, 0s);
          animation-delay: var(--fa-animation-delay, 0s);
  -webkit-animation-direction: var(--fa-animation-direction, normal);
          animation-direction: var(--fa-animation-direction, normal);
  -webkit-animation-duration: var(--fa-animation-duration, 1s);
          animation-duration: var(--fa-animation-duration, 1s);
  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);
          animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  -webkit-animation-timing-function: var(--fa-animation-timing, ease-in-out);
          animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-bounce {
  -webkit-animation-name: fa-bounce;
          animation-name: fa-bounce;
  -webkit-animation-delay: var(--fa-animation-delay, 0s);
          animation-delay: var(--fa-animation-delay, 0s);
  -webkit-animation-direction: var(--fa-animation-direction, normal);
          animation-direction: var(--fa-animation-direction, normal);
  -webkit-animation-duration: var(--fa-animation-duration, 1s);
          animation-duration: var(--fa-animation-duration, 1s);
  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);
          animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  -webkit-animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
          animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
}

.fa-fade {
  -webkit-animation-name: fa-fade;
          animation-name: fa-fade;
  -webkit-animation-delay: var(--fa-animation-delay, 0s);
          animation-delay: var(--fa-animation-delay, 0s);
  -webkit-animation-direction: var(--fa-animation-direction, normal);
          animation-direction: var(--fa-animation-direction, normal);
  -webkit-animation-duration: var(--fa-animation-duration, 1s);
          animation-duration: var(--fa-animation-duration, 1s);
  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);
          animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  -webkit-animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
          animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-beat-fade {
  -webkit-animation-name: fa-beat-fade;
          animation-name: fa-beat-fade;
  -webkit-animation-delay: var(--fa-animation-delay, 0s);
          animation-delay: var(--fa-animation-delay, 0s);
  -webkit-animation-direction: var(--fa-animation-direction, normal);
          animation-direction: var(--fa-animation-direction, normal);
  -webkit-animation-duration: var(--fa-animation-duration, 1s);
          animation-duration: var(--fa-animation-duration, 1s);
  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);
          animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  -webkit-animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
          animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-flip {
  -webkit-animation-name: fa-flip;
          animation-name: fa-flip;
  -webkit-animation-delay: var(--fa-animation-delay, 0s);
          animation-delay: var(--fa-animation-delay, 0s);
  -webkit-animation-direction: var(--fa-animation-direction, normal);
          animation-direction: var(--fa-animation-direction, normal);
  -webkit-animation-duration: var(--fa-animation-duration, 1s);
          animation-duration: var(--fa-animation-duration, 1s);
  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);
          animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  -webkit-animation-timing-function: var(--fa-animation-timing, ease-in-out);
          animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-shake {
  -webkit-animation-name: fa-shake;
          animation-name: fa-shake;
  -webkit-animation-delay: var(--fa-animation-delay, 0s);
          animation-delay: var(--fa-animation-delay, 0s);
  -webkit-animation-direction: var(--fa-animation-direction, normal);
          animation-direction: var(--fa-animation-direction, normal);
  -webkit-animation-duration: var(--fa-animation-duration, 1s);
          animation-duration: var(--fa-animation-duration, 1s);
  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);
          animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  -webkit-animation-timing-function: var(--fa-animation-timing, linear);
          animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin {
  -webkit-animation-name: fa-spin;
          animation-name: fa-spin;
  -webkit-animation-delay: var(--fa-animation-delay, 0s);
          animation-delay: var(--fa-animation-delay, 0s);
  -webkit-animation-direction: var(--fa-animation-direction, normal);
          animation-direction: var(--fa-animation-direction, normal);
  -webkit-animation-duration: var(--fa-animation-duration, 2s);
          animation-duration: var(--fa-animation-duration, 2s);
  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);
          animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  -webkit-animation-timing-function: var(--fa-animation-timing, linear);
          animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin-reverse {
  --fa-animation-direction: reverse;
}

.fa-pulse,
.fa-spin-pulse {
  -webkit-animation-name: fa-spin;
          animation-name: fa-spin;
  -webkit-animation-direction: var(--fa-animation-direction, normal);
          animation-direction: var(--fa-animation-direction, normal);
  -webkit-animation-duration: var(--fa-animation-duration, 1s);
          animation-duration: var(--fa-animation-duration, 1s);
  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);
          animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  -webkit-animation-timing-function: var(--fa-animation-timing, steps(8));
          animation-timing-function: var(--fa-animation-timing, steps(8));
}

@media (prefers-reduced-motion: reduce) {
  .fa-beat,
.fa-bounce,
.fa-fade,
.fa-beat-fade,
.fa-flip,
.fa-pulse,
.fa-shake,
.fa-spin,
.fa-spin-pulse {
    -webkit-animation-delay: -1ms;
            animation-delay: -1ms;
    -webkit-animation-duration: 1ms;
            animation-duration: 1ms;
    -webkit-animation-iteration-count: 1;
            animation-iteration-count: 1;
    -webkit-transition-delay: 0s;
            transition-delay: 0s;
    -webkit-transition-duration: 0s;
            transition-duration: 0s;
  }
}
@-webkit-keyframes fa-beat {
  0%, 90% {
    -webkit-transform: scale(1);
            transform: scale(1);
  }
  45% {
    -webkit-transform: scale(var(--fa-beat-scale, 1.25));
            transform: scale(var(--fa-beat-scale, 1.25));
  }
}
@keyframes fa-beat {
  0%, 90% {
    -webkit-transform: scale(1);
            transform: scale(1);
  }
  45% {
    -webkit-transform: scale(var(--fa-beat-scale, 1.25));
            transform: scale(var(--fa-beat-scale, 1.25));
  }
}
@-webkit-keyframes fa-bounce {
  0% {
    -webkit-transform: scale(1, 1) translateY(0);
            transform: scale(1, 1) translateY(0);
  }
  10% {
    -webkit-transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
            transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
  }
  30% {
    -webkit-transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
            transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
  }
  50% {
    -webkit-transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
            transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
  }
  57% {
    -webkit-transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
            transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
  }
  64% {
    -webkit-transform: scale(1, 1) translateY(0);
            transform: scale(1, 1) translateY(0);
  }
  100% {
    -webkit-transform: scale(1, 1) translateY(0);
            transform: scale(1, 1) translateY(0);
  }
}
@keyframes fa-bounce {
  0% {
    -webkit-transform: scale(1, 1) translateY(0);
            transform: scale(1, 1) translateY(0);
  }
  10% {
    -webkit-transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
            transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
  }
  30% {
    -webkit-transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
            transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
  }
  50% {
    -webkit-transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
            transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
  }
  57% {
    -webkit-transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
            transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
  }
  64% {
    -webkit-transform: scale(1, 1) translateY(0);
            transform: scale(1, 1) translateY(0);
  }
  100% {
    -webkit-transform: scale(1, 1) translateY(0);
            transform: scale(1, 1) translateY(0);
  }
}
@-webkit-keyframes fa-fade {
  50% {
    opacity: var(--fa-fade-opacity, 0.4);
  }
}
@keyframes fa-fade {
  50% {
    opacity: var(--fa-fade-opacity, 0.4);
  }
}
@-webkit-keyframes fa-beat-fade {
  0%, 100% {
    opacity: var(--fa-beat-fade-opacity, 0.4);
    -webkit-transform: scale(1);
            transform: scale(1);
  }
  50% {
    opacity: 1;
    -webkit-transform: scale(var(--fa-beat-fade-scale, 1.125));
            transform: scale(var(--fa-beat-fade-scale, 1.125));
  }
}
@keyframes fa-beat-fade {
  0%, 100% {
    opacity: var(--fa-beat-fade-opacity, 0.4);
    -webkit-transform: scale(1);
            transform: scale(1);
  }
  50% {
    opacity: 1;
    -webkit-transform: scale(var(--fa-beat-fade-scale, 1.125));
            transform: scale(var(--fa-beat-fade-scale, 1.125));
  }
}
@-webkit-keyframes fa-flip {
  50% {
    -webkit-transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));
            transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));
  }
}
@keyframes fa-flip {
  50% {
    -webkit-transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));
            transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));
  }
}
@-webkit-keyframes fa-shake {
  0% {
    -webkit-transform: rotate(-15deg);
            transform: rotate(-15deg);
  }
  4% {
    -webkit-transform: rotate(15deg);
            transform: rotate(15deg);
  }
  8%, 24% {
    -webkit-transform: rotate(-18deg);
            transform: rotate(-18deg);
  }
  12%, 28% {
    -webkit-transform: rotate(18deg);
            transform: rotate(18deg);
  }
  16% {
    -webkit-transform: rotate(-22deg);
            transform: rotate(-22deg);
  }
  20% {
    -webkit-transform: rotate(22deg);
            transform: rotate(22deg);
  }
  32% {
    -webkit-transform: rotate(-12deg);
            transform: rotate(-12deg);
  }
  36% {
    -webkit-transform: rotate(12deg);
            transform: rotate(12deg);
  }
  40%, 100% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
  }
}
@keyframes fa-shake {
  0% {
    -webkit-transform: rotate(-15deg);
            transform: rotate(-15deg);
  }
  4% {
    -webkit-transform: rotate(15deg);
            transform: rotate(15deg);
  }
  8%, 24% {
    -webkit-transform: rotate(-18deg);
            transform: rotate(-18deg);
  }
  12%, 28% {
    -webkit-transform: rotate(18deg);
            transform: rotate(18deg);
  }
  16% {
    -webkit-transform: rotate(-22deg);
            transform: rotate(-22deg);
  }
  20% {
    -webkit-transform: rotate(22deg);
            transform: rotate(22deg);
  }
  32% {
    -webkit-transform: rotate(-12deg);
            transform: rotate(-12deg);
  }
  36% {
    -webkit-transform: rotate(12deg);
            transform: rotate(12deg);
  }
  40%, 100% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
  }
}
@-webkit-keyframes fa-spin {
  0% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
  }
}
@keyframes fa-spin {
  0% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
  }
}
.fa-rotate-90 {
  -webkit-transform: rotate(90deg);
          transform: rotate(90deg);
}

.fa-rotate-180 {
  -webkit-transform: rotate(180deg);
          transform: rotate(180deg);
}

.fa-rotate-270 {
  -webkit-transform: rotate(270deg);
          transform: rotate(270deg);
}

.fa-flip-horizontal {
  -webkit-transform: scale(-1, 1);
          transform: scale(-1, 1);
}

.fa-flip-vertical {
  -webkit-transform: scale(1, -1);
          transform: scale(1, -1);
}

.fa-flip-both,
.fa-flip-horizontal.fa-flip-vertical {
  -webkit-transform: scale(-1, -1);
          transform: scale(-1, -1);
}

.fa-rotate-by {
  -webkit-transform: rotate(var(--fa-rotate-angle, none));
          transform: rotate(var(--fa-rotate-angle, none));
}

.fa-stack {
  display: inline-block;
  vertical-align: middle;
  height: 2em;
  position: relative;
  width: 2.5em;
}

.fa-stack-1x,
.fa-stack-2x {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
  z-index: var(--fa-stack-z-index, auto);
}

.svg-inline--fa.fa-stack-1x {
  height: 1em;
  width: 1.25em;
}
.svg-inline--fa.fa-stack-2x {
  height: 2em;
  width: 2.5em;
}

.fa-inverse {
  color: var(--fa-inverse, #fff);
}

.sr-only,
.fa-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only-focusable:not(:focus),
.fa-sr-only-focusable:not(:focus) {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.svg-inline--fa .fa-primary {
  fill: var(--fa-primary-color, currentColor);
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa .fa-secondary {
  fill: var(--fa-secondary-color, currentColor);
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-primary {
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-secondary {
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa mask .fa-primary,
.svg-inline--fa mask .fa-secondary {
  fill: black;
}

.fad.fa-inverse,
.fa-duotone.fa-inverse {
  color: var(--fa-inverse, #fff);
}`;function Kt(){var n=Wt,t=Ht,e=d.cssPrefix,a=d.replacementClass,r=He;if(e!==n||a!==t){var i=new RegExp("\\.".concat(n,"\\-"),"g"),o=new RegExp("\\--".concat(n,"\\-"),"g"),s=new RegExp("\\.".concat(t),"g");r=r.replace(i,".".concat(e,"-")).replace(o,"--".concat(e,"-")).replace(s,".".concat(a))}return r}var gt=!1;function Mn(){d.autoAddCss&&!gt&&(De(Kt()),gt=!0)}var Ge={mixout:function(){return{dom:{css:Kt,insertCss:Mn}}},hooks:function(){return{beforeDOMElementCreation:function(){Mn()},beforeI2svg:function(){Mn()}}}},M=F||{};M[_]||(M[_]={});M[_].styles||(M[_].styles={});M[_].hooks||(M[_].hooks={});M[_].shims||(M[_].shims=[]);var N=M[_],Qt=[],Xe=function n(){h.removeEventListener("DOMContentLoaded",n),On=1,Qt.map(function(t){return t()})},On=!1;z&&(On=(h.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(h.readyState),On||h.addEventListener("DOMContentLoaded",Xe));function Be(n){z&&(On?setTimeout(n,0):Qt.push(n))}function cn(n){var t=n.tag,e=n.attributes,a=e===void 0?{}:e,r=n.children,i=r===void 0?[]:r;return typeof n=="string"?qt(n):"<".concat(t," ").concat($e(a),">").concat(i.map(cn).join(""),"</").concat(t,">")}function ht(n,t,e){if(n&&n[t]&&n[t][e])return{prefix:t,iconName:e,icon:n[t][e]}}var Ln=function(t,e,a,r){var i=Object.keys(t),o=i.length,s=e,f,u,l;for(a===void 0?(f=1,l=t[i[0]]):(f=0,l=a);f<o;f++)u=i[f],l=s(l,t[u],u,t);return l};function Ve(n){for(var t=[],e=0,a=n.length;e<a;){var r=n.charCodeAt(e++);if(r>=55296&&r<=56319&&e<a){var i=n.charCodeAt(e++);(i&64512)==56320?t.push(((r&1023)<<10)+(i&1023)+65536):(t.push(r),e--)}else t.push(r)}return t}function $n(n){var t=Ve(n);return t.length===1?t[0].toString(16):null}function qe(n,t){var e=n.length,a=n.charCodeAt(t),r;return a>=55296&&a<=56319&&e>t+1&&(r=n.charCodeAt(t+1),r>=56320&&r<=57343)?(a-55296)*1024+r-56320+65536:a}function yt(n){return Object.keys(n).reduce(function(t,e){var a=n[e],r=!!a.icon;return r?t[a.iconName]=a.icon:t[e]=a,t},{})}function Un(n,t){var e=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},a=e.skipHooks,r=a===void 0?!1:a,i=yt(t);typeof N.hooks.addPack=="function"&&!r?N.hooks.addPack(n,yt(t)):N.styles[n]=c(c({},N.styles[n]||{}),i),n==="fas"&&Un("fa",t)}var hn,yn,kn,V=N.styles,Ke=N.shims,Qe=(hn={},O(hn,g,Object.values(on[g])),O(hn,y,Object.values(on[y])),hn),it=null,Jt={},Zt={},ne={},te={},ee={},Je=(yn={},O(yn,g,Object.keys(an[g])),O(yn,y,Object.keys(an[y])),yn);function Ze(n){return~Le.indexOf(n)}function na(n,t){var e=t.split("-"),a=e[0],r=e.slice(1).join("-");return a===n&&r!==""&&!Ze(r)?r:null}var ae=function(){var t=function(i){return Ln(V,function(o,s,f){return o[f]=Ln(s,i,{}),o},{})};Jt=t(function(r,i,o){if(i[3]&&(r[i[3]]=o),i[2]){var s=i[2].filter(function(f){return typeof f=="number"});s.forEach(function(f){r[f.toString(16)]=o})}return r}),Zt=t(function(r,i,o){if(r[o]=o,i[2]){var s=i[2].filter(function(f){return typeof f=="string"});s.forEach(function(f){r[f]=o})}return r}),ee=t(function(r,i,o){var s=i[2];return r[o]=o,s.forEach(function(f){r[f]=o}),r});var e="far"in V||d.autoFetchSvg,a=Ln(Ke,function(r,i){var o=i[0],s=i[1],f=i[2];return s==="far"&&!e&&(s="fas"),typeof o=="string"&&(r.names[o]={prefix:s,iconName:f}),typeof o=="number"&&(r.unicodes[o.toString(16)]={prefix:s,iconName:f}),r},{names:{},unicodes:{}});ne=a.names,te=a.unicodes,it=Cn(d.styleDefault,{family:d.familyDefault})};Fe(function(n){it=Cn(n.styleDefault,{family:d.familyDefault})});ae();function ot(n,t){return(Jt[n]||{})[t]}function ta(n,t){return(Zt[n]||{})[t]}function H(n,t){return(ee[n]||{})[t]}function re(n){return ne[n]||{prefix:null,iconName:null}}function ea(n){var t=te[n],e=ot("fas",n);return t||(e?{prefix:"fas",iconName:e}:null)||{prefix:null,iconName:null}}function D(){return it}var st=function(){return{prefix:null,iconName:null,rest:[]}};function Cn(n){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},e=t.family,a=e===void 0?g:e,r=an[a][n],i=rn[a][n]||rn[a][r],o=n in N.styles?n:null;return i||o||null}var kt=(kn={},O(kn,g,Object.keys(on[g])),O(kn,y,Object.keys(on[y])),kn);function In(n){var t,e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},a=e.skipLookups,r=a===void 0?!1:a,i=(t={},O(t,g,"".concat(d.cssPrefix,"-").concat(g)),O(t,y,"".concat(d.cssPrefix,"-").concat(y)),t),o=null,s=g;(n.includes(i[g])||n.some(function(u){return kt[g].includes(u)}))&&(s=g),(n.includes(i[y])||n.some(function(u){return kt[y].includes(u)}))&&(s=y);var f=n.reduce(function(u,l){var m=na(d.cssPrefix,l);if(V[l]?(l=Qe[s].includes(l)?Ce[s][l]:l,o=l,u.prefix=l):Je[s].indexOf(l)>-1?(o=l,u.prefix=Cn(l,{family:s})):m?u.iconName=m:l!==d.replacementClass&&l!==i[g]&&l!==i[y]&&u.rest.push(l),!r&&u.prefix&&u.iconName){var v=o==="fa"?re(u.iconName):{},p=H(u.prefix,u.iconName);v.prefix&&(o=null),u.iconName=v.iconName||p||u.iconName,u.prefix=v.prefix||u.prefix,u.prefix==="far"&&!V.far&&V.fas&&!d.autoFetchSvg&&(u.prefix="fas")}return u},st());return(n.includes("fa-brands")||n.includes("fab"))&&(f.prefix="fab"),(n.includes("fa-duotone")||n.includes("fad"))&&(f.prefix="fad"),!f.prefix&&s===y&&(V.fass||d.autoFetchSvg)&&(f.prefix="fass",f.iconName=H(f.prefix,f.iconName)||f.iconName),(f.prefix==="fa"||o==="fa")&&(f.prefix=D()||"fas"),f}var aa=function(){function n(){be(this,n),this.definitions={}}return ge(n,[{key:"add",value:function(){for(var e=this,a=arguments.length,r=new Array(a),i=0;i<a;i++)r[i]=arguments[i];var o=r.reduce(this._pullDefinitions,{});Object.keys(o).forEach(function(s){e.definitions[s]=c(c({},e.definitions[s]||{}),o[s]),Un(s,o[s]);var f=on[g][s];f&&Un(f,o[s]),ae()})}},{key:"reset",value:function(){this.definitions={}}},{key:"_pullDefinitions",value:function(e,a){var r=a.prefix&&a.iconName&&a.icon?{0:a}:a;return Object.keys(r).map(function(i){var o=r[i],s=o.prefix,f=o.iconName,u=o.icon,l=u[2];e[s]||(e[s]={}),l.length>0&&l.forEach(function(m){typeof m=="string"&&(e[s][m]=u)}),e[s][f]=u}),e}}]),n}(),wt=[],q={},Q={},ra=Object.keys(Q);function ia(n,t){var e=t.mixoutsTo;return wt=n,q={},Object.keys(Q).forEach(function(a){ra.indexOf(a)===-1&&delete Q[a]}),wt.forEach(function(a){var r=a.mixout?a.mixout():{};if(Object.keys(r).forEach(function(o){typeof r[o]=="function"&&(e[o]=r[o]),An(r[o])==="object"&&Object.keys(r[o]).forEach(function(s){e[o]||(e[o]={}),e[o][s]=r[o][s]})}),a.hooks){var i=a.hooks();Object.keys(i).forEach(function(o){q[o]||(q[o]=[]),q[o].push(i[o])})}a.provides&&a.provides(Q)}),e}function Wn(n,t){for(var e=arguments.length,a=new Array(e>2?e-2:0),r=2;r<e;r++)a[r-2]=arguments[r];var i=q[n]||[];return i.forEach(function(o){t=o.apply(null,[t].concat(a))}),t}function X(n){for(var t=arguments.length,e=new Array(t>1?t-1:0),a=1;a<t;a++)e[a-1]=arguments[a];var r=q[n]||[];r.forEach(function(i){i.apply(null,e)})}function L(){var n=arguments[0],t=Array.prototype.slice.call(arguments,1);return Q[n]?Q[n].apply(null,t):void 0}function Hn(n){n.prefix==="fa"&&(n.prefix="fas");var t=n.iconName,e=n.prefix||D();if(t)return t=H(e,t)||t,ht(ie.definitions,e,t)||ht(N.styles,e,t)}var ie=new aa,oa=function(){d.autoReplaceSvg=!1,d.observeMutations=!1,X("noAuto")},sa={i2svg:function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return z?(X("beforeI2svg",t),L("pseudoElements2svg",t),L("i2svg",t)):Promise.reject("Operation requires a DOM of some kind.")},watch:function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},e=t.autoReplaceSvgRoot;d.autoReplaceSvg===!1&&(d.autoReplaceSvg=!0),d.observeMutations=!0,Be(function(){la({autoReplaceSvgRoot:e}),X("watch",t)})}},fa={icon:function(t){if(t===null)return null;if(An(t)==="object"&&t.prefix&&t.iconName)return{prefix:t.prefix,iconName:H(t.prefix,t.iconName)||t.iconName};if(Array.isArray(t)&&t.length===2){var e=t[1].indexOf("fa-")===0?t[1].slice(3):t[1],a=Cn(t[0]);return{prefix:a,iconName:H(a,e)||e}}if(typeof t=="string"&&(t.indexOf("".concat(d.cssPrefix,"-"))>-1||t.match(Ie))){var r=In(t.split(" "),{skipLookups:!0});return{prefix:r.prefix||D(),iconName:H(r.prefix,r.iconName)||r.iconName}}if(typeof t=="string"){var i=D();return{prefix:i,iconName:H(i,t)||t}}}},I={noAuto:oa,config:d,dom:sa,parse:fa,library:ie,findIconDefinition:Hn,toHtml:cn},la=function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},e=t.autoReplaceSvgRoot,a=e===void 0?h:e;(Object.keys(N.styles).length>0||d.autoFetchSvg)&&z&&d.autoReplaceSvg&&I.dom.i2svg({node:a})};function Nn(n,t){return Object.defineProperty(n,"abstract",{get:t}),Object.defineProperty(n,"html",{get:function(){return n.abstract.map(function(a){return cn(a)})}}),Object.defineProperty(n,"node",{get:function(){if(z){var a=h.createElement("div");return a.innerHTML=n.html,a.children}}}),n}function ua(n){var t=n.children,e=n.main,a=n.mask,r=n.attributes,i=n.styles,o=n.transform;if(rt(o)&&e.found&&!a.found){var s=e.width,f=e.height,u={x:s/f/2,y:.5};r.style=En(c(c({},i),{},{"transform-origin":"".concat(u.x+o.x/16,"em ").concat(u.y+o.y/16,"em")}))}return[{tag:"svg",attributes:r,children:t}]}function ca(n){var t=n.prefix,e=n.iconName,a=n.children,r=n.attributes,i=n.symbol,o=i===!0?"".concat(t,"-").concat(d.cssPrefix,"-").concat(e):i;return[{tag:"svg",attributes:{style:"display: none;"},children:[{tag:"symbol",attributes:c(c({},r),{},{id:o}),children:a}]}]}function ft(n){var t=n.icons,e=t.main,a=t.mask,r=n.prefix,i=n.iconName,o=n.transform,s=n.symbol,f=n.title,u=n.maskId,l=n.titleId,m=n.extra,v=n.watchable,p=v===void 0?!1:v,x=a.found?a:e,S=x.width,k=x.height,E=r==="fak",w=[d.replacementClass,i?"".concat(d.cssPrefix,"-").concat(i):""].filter(function(R){return m.classes.indexOf(R)===-1}).filter(function(R){return R!==""||!!R}).concat(m.classes).join(" "),A={children:[],attributes:c(c({},m.attributes),{},{"data-prefix":r,"data-icon":i,class:w,role:m.attributes.role||"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 ".concat(S," ").concat(k)})},C=E&&!~m.classes.indexOf("fa-fw")?{width:"".concat(S/k*16*.0625,"em")}:{};p&&(A.attributes[G]=""),f&&(A.children.push({tag:"title",attributes:{id:A.attributes["aria-labelledby"]||"title-".concat(l||fn())},children:[f]}),delete A.attributes.title);var P=c(c({},A),{},{prefix:r,iconName:i,main:e,mask:a,maskId:u,transform:o,symbol:s,styles:c(c({},C),m.styles)}),$=a.found&&e.found?L("generateAbstractMask",P)||{children:[],attributes:{}}:L("generateAbstractIcon",P)||{children:[],attributes:{}},U=$.children,_n=$.attributes;return P.children=U,P.attributes=_n,s?ca(P):ua(P)}function xt(n){var t=n.content,e=n.width,a=n.height,r=n.transform,i=n.title,o=n.extra,s=n.watchable,f=s===void 0?!1:s,u=c(c(c({},o.attributes),i?{title:i}:{}),{},{class:o.classes.join(" ")});f&&(u[G]="");var l=c({},o.styles);rt(r)&&(l.transform=We({transform:r,width:e,height:a}),l["-webkit-transform"]=l.transform);var m=En(l);m.length>0&&(u.style=m);var v=[];return v.push({tag:"span",attributes:u,children:[t]}),i&&v.push({tag:"span",attributes:{class:"sr-only"},children:[i]}),v}function ma(n){var t=n.content,e=n.title,a=n.extra,r=c(c(c({},a.attributes),e?{title:e}:{}),{},{class:a.classes.join(" ")}),i=En(a.styles);i.length>0&&(r.style=i);var o=[];return o.push({tag:"span",attributes:r,children:[t]}),e&&o.push({tag:"span",attributes:{class:"sr-only"},children:[e]}),o}var zn=N.styles;function Gn(n){var t=n[0],e=n[1],a=n.slice(4),r=Jn(a,1),i=r[0],o=null;return Array.isArray(i)?o={tag:"g",attributes:{class:"".concat(d.cssPrefix,"-").concat(W.GROUP)},children:[{tag:"path",attributes:{class:"".concat(d.cssPrefix,"-").concat(W.SECONDARY),fill:"currentColor",d:i[0]}},{tag:"path",attributes:{class:"".concat(d.cssPrefix,"-").concat(W.PRIMARY),fill:"currentColor",d:i[1]}}]}:o={tag:"path",attributes:{fill:"currentColor",d:i}},{found:!0,width:t,height:e,icon:o}}var da={found:!1,width:512,height:512};function va(n,t){!Gt&&!d.showMissingIcons&&n&&console.error('Icon with name "'.concat(n,'" and prefix "').concat(t,'" is missing.'))}function Xn(n,t){var e=t;return t==="fa"&&d.styleDefault!==null&&(t=D()),new Promise(function(a,r){if(L("missingIconAbstract"),e==="fa"){var i=re(n)||{};n=i.iconName||n,t=i.prefix||t}if(n&&t&&zn[t]&&zn[t][n]){var o=zn[t][n];return a(Gn(o))}va(n,t),a(c(c({},da),{},{icon:d.showMissingIcons&&n?L("missingIconAbstract")||{}:{}}))})}var At=function(){},Bn=d.measurePerformance&&mn&&mn.mark&&mn.measure?mn:{mark:At,measure:At},nn='FA "6.5.1"',ba=function(t){return Bn.mark("".concat(nn," ").concat(t," begins")),function(){return oe(t)}},oe=function(t){Bn.mark("".concat(nn," ").concat(t," ends")),Bn.measure("".concat(nn," ").concat(t),"".concat(nn," ").concat(t," begins"),"".concat(nn," ").concat(t," ends"))},lt={begin:ba,end:oe},wn=function(){};function Ot(n){var t=n.getAttribute?n.getAttribute(G):null;return typeof t=="string"}function pa(n){var t=n.getAttribute?n.getAttribute(nt):null,e=n.getAttribute?n.getAttribute(tt):null;return t&&e}function ga(n){return n&&n.classList&&n.classList.contains&&n.classList.contains(d.replacementClass)}function ha(){if(d.autoReplaceSvg===!0)return xn.replace;var n=xn[d.autoReplaceSvg];return n||xn.replace}function ya(n){return h.createElementNS("http://www.w3.org/2000/svg",n)}function ka(n){return h.createElement(n)}function se(n){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},e=t.ceFn,a=e===void 0?n.tag==="svg"?ya:ka:e;if(typeof n=="string")return h.createTextNode(n);var r=a(n.tag);Object.keys(n.attributes||[]).forEach(function(o){r.setAttribute(o,n.attributes[o])});var i=n.children||[];return i.forEach(function(o){r.appendChild(se(o,{ceFn:a}))}),r}function wa(n){var t=" ".concat(n.outerHTML," ");return t="".concat(t,"Font Awesome fontawesome.com "),t}var xn={replace:function(t){var e=t[0];if(e.parentNode)if(t[1].forEach(function(r){e.parentNode.insertBefore(se(r),e)}),e.getAttribute(G)===null&&d.keepOriginalSource){var a=h.createComment(wa(e));e.parentNode.replaceChild(a,e)}else e.remove()},nest:function(t){var e=t[0],a=t[1];if(~at(e).indexOf(d.replacementClass))return xn.replace(t);var r=new RegExp("".concat(d.cssPrefix,"-.*"));if(delete a[0].attributes.id,a[0].attributes.class){var i=a[0].attributes.class.split(" ").reduce(function(s,f){return f===d.replacementClass||f.match(r)?s.toSvg.push(f):s.toNode.push(f),s},{toNode:[],toSvg:[]});a[0].attributes.class=i.toSvg.join(" "),i.toNode.length===0?e.removeAttribute("class"):e.setAttribute("class",i.toNode.join(" "))}var o=a.map(function(s){return cn(s)}).join(`
`);e.setAttribute(G,""),e.innerHTML=o}};function Pt(n){n()}function fe(n,t){var e=typeof t=="function"?t:wn;if(n.length===0)e();else{var a=Pt;d.mutateApproach===Se&&(a=F.requestAnimationFrame||Pt),a(function(){var r=ha(),i=lt.begin("mutate");n.map(r),i(),e()})}}var ut=!1;function le(){ut=!0}function Vn(){ut=!1}var Pn=null;function St(n){if(bt&&d.observeMutations){var t=n.treeCallback,e=t===void 0?wn:t,a=n.nodeCallback,r=a===void 0?wn:a,i=n.pseudoElementsCallback,o=i===void 0?wn:i,s=n.observeMutationsRoot,f=s===void 0?h:s;Pn=new bt(function(u){if(!ut){var l=D();Z(u).forEach(function(m){if(m.type==="childList"&&m.addedNodes.length>0&&!Ot(m.addedNodes[0])&&(d.searchPseudoElements&&o(m.target),e(m.target)),m.type==="attributes"&&m.target.parentNode&&d.searchPseudoElements&&o(m.target.parentNode),m.type==="attributes"&&Ot(m.target)&&~Me.indexOf(m.attributeName))if(m.attributeName==="class"&&pa(m.target)){var v=In(at(m.target)),p=v.prefix,x=v.iconName;m.target.setAttribute(nt,p||l),x&&m.target.setAttribute(tt,x)}else ga(m.target)&&r(m.target)})}}),z&&Pn.observe(f,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}}function xa(){Pn&&Pn.disconnect()}function Aa(n){var t=n.getAttribute("style"),e=[];return t&&(e=t.split(";").reduce(function(a,r){var i=r.split(":"),o=i[0],s=i.slice(1);return o&&s.length>0&&(a[o]=s.join(":").trim()),a},{})),e}function Oa(n){var t=n.getAttribute("data-prefix"),e=n.getAttribute("data-icon"),a=n.innerText!==void 0?n.innerText.trim():"",r=In(at(n));return r.prefix||(r.prefix=D()),t&&e&&(r.prefix=t,r.iconName=e),r.iconName&&r.prefix||(r.prefix&&a.length>0&&(r.iconName=ta(r.prefix,n.innerText)||ot(r.prefix,$n(n.innerText))),!r.iconName&&d.autoFetchSvg&&n.firstChild&&n.firstChild.nodeType===Node.TEXT_NODE&&(r.iconName=n.firstChild.data)),r}function Pa(n){var t=Z(n.attributes).reduce(function(r,i){return r.name!=="class"&&r.name!=="style"&&(r[i.name]=i.value),r},{}),e=n.getAttribute("title"),a=n.getAttribute("data-fa-title-id");return d.autoA11y&&(e?t["aria-labelledby"]="".concat(d.replacementClass,"-title-").concat(a||fn()):(t["aria-hidden"]="true",t.focusable="false")),t}function Sa(){return{iconName:null,title:null,titleId:null,prefix:null,transform:T,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function Et(n){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0},e=Oa(n),a=e.iconName,r=e.prefix,i=e.rest,o=Pa(n),s=Wn("parseNodeAttributes",{},n),f=t.styleParser?Aa(n):[];return c({iconName:a,title:n.getAttribute("title"),titleId:n.getAttribute("data-fa-title-id"),prefix:r,transform:T,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:i,styles:f,attributes:o}},s)}var Ea=N.styles;function ue(n){var t=d.autoReplaceSvg==="nest"?Et(n,{styleParser:!1}):Et(n);return~t.extra.classes.indexOf(Xt)?L("generateLayersText",n,t):L("generateSvgReplacementMutation",n,t)}var Y=new Set;et.map(function(n){Y.add("fa-".concat(n))});Object.keys(an[g]).map(Y.add.bind(Y));Object.keys(an[y]).map(Y.add.bind(Y));Y=ln(Y);function Ct(n){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!z)return Promise.resolve();var e=h.documentElement.classList,a=function(m){return e.add("".concat(pt,"-").concat(m))},r=function(m){return e.remove("".concat(pt,"-").concat(m))},i=d.autoFetchSvg?Y:et.map(function(l){return"fa-".concat(l)}).concat(Object.keys(Ea));i.includes("fa")||i.push("fa");var o=[".".concat(Xt,":not([").concat(G,"])")].concat(i.map(function(l){return".".concat(l,":not([").concat(G,"])")})).join(", ");if(o.length===0)return Promise.resolve();var s=[];try{s=Z(n.querySelectorAll(o))}catch{}if(s.length>0)a("pending"),r("complete");else return Promise.resolve();var f=lt.begin("onTree"),u=s.reduce(function(l,m){try{var v=ue(m);v&&l.push(v)}catch(p){Gt||p.name==="MissingIcon"&&console.error(p)}return l},[]);return new Promise(function(l,m){Promise.all(u).then(function(v){fe(v,function(){a("active"),a("complete"),r("pending"),typeof t=="function"&&t(),f(),l()})}).catch(function(v){f(),m(v)})})}function Ca(n){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;ue(n).then(function(e){e&&fe([e],t)})}function Ia(n){return function(t){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},a=(t||{}).icon?t:Hn(t||{}),r=e.mask;return r&&(r=(r||{}).icon?r:Hn(r||{})),n(a,c(c({},e),{},{mask:r}))}}var Na=function(t){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},a=e.transform,r=a===void 0?T:a,i=e.symbol,o=i===void 0?!1:i,s=e.mask,f=s===void 0?null:s,u=e.maskId,l=u===void 0?null:u,m=e.title,v=m===void 0?null:m,p=e.titleId,x=p===void 0?null:p,S=e.classes,k=S===void 0?[]:S,E=e.attributes,w=E===void 0?{}:E,A=e.styles,C=A===void 0?{}:A;if(t){var P=t.prefix,$=t.iconName,U=t.icon;return Nn(c({type:"icon"},t),function(){return X("beforeDOMElementCreation",{iconDefinition:t,params:e}),d.autoA11y&&(v?w["aria-labelledby"]="".concat(d.replacementClass,"-title-").concat(x||fn()):(w["aria-hidden"]="true",w.focusable="false")),ft({icons:{main:Gn(U),mask:f?Gn(f.icon):{found:!1,width:null,height:null,icon:{}}},prefix:P,iconName:$,transform:c(c({},T),r),symbol:o,title:v,maskId:l,titleId:x,extra:{attributes:w,styles:C,classes:k}})})}},Ta={mixout:function(){return{icon:Ia(Na)}},hooks:function(){return{mutationObserverCallbacks:function(e){return e.treeCallback=Ct,e.nodeCallback=Ca,e}}},provides:function(t){t.i2svg=function(e){var a=e.node,r=a===void 0?h:a,i=e.callback,o=i===void 0?function(){}:i;return Ct(r,o)},t.generateSvgReplacementMutation=function(e,a){var r=a.iconName,i=a.title,o=a.titleId,s=a.prefix,f=a.transform,u=a.symbol,l=a.mask,m=a.maskId,v=a.extra;return new Promise(function(p,x){Promise.all([Xn(r,s),l.iconName?Xn(l.iconName,l.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(function(S){var k=Jn(S,2),E=k[0],w=k[1];p([e,ft({icons:{main:E,mask:w},prefix:s,iconName:r,transform:f,symbol:u,maskId:m,title:i,titleId:o,extra:v,watchable:!0})])}).catch(x)})},t.generateAbstractIcon=function(e){var a=e.children,r=e.attributes,i=e.main,o=e.transform,s=e.styles,f=En(s);f.length>0&&(r.style=f);var u;return rt(o)&&(u=L("generateAbstractTransformGrouping",{main:i,transform:o,containerWidth:i.width,iconWidth:i.width})),a.push(u||i.icon),{children:a,attributes:r}}}},_a={mixout:function(){return{layer:function(e){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=a.classes,i=r===void 0?[]:r;return Nn({type:"layer"},function(){X("beforeDOMElementCreation",{assembler:e,params:a});var o=[];return e(function(s){Array.isArray(s)?s.map(function(f){o=o.concat(f.abstract)}):o=o.concat(s.abstract)}),[{tag:"span",attributes:{class:["".concat(d.cssPrefix,"-layers")].concat(ln(i)).join(" ")},children:o}]})}}}},Ma={mixout:function(){return{counter:function(e){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=a.title,i=r===void 0?null:r,o=a.classes,s=o===void 0?[]:o,f=a.attributes,u=f===void 0?{}:f,l=a.styles,m=l===void 0?{}:l;return Nn({type:"counter",content:e},function(){return X("beforeDOMElementCreation",{content:e,params:a}),ma({content:e.toString(),title:i,extra:{attributes:u,styles:m,classes:["".concat(d.cssPrefix,"-layers-counter")].concat(ln(s))}})})}}}},La={mixout:function(){return{text:function(e){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=a.transform,i=r===void 0?T:r,o=a.title,s=o===void 0?null:o,f=a.classes,u=f===void 0?[]:f,l=a.attributes,m=l===void 0?{}:l,v=a.styles,p=v===void 0?{}:v;return Nn({type:"text",content:e},function(){return X("beforeDOMElementCreation",{content:e,params:a}),xt({content:e,transform:c(c({},T),i),title:s,extra:{attributes:m,styles:p,classes:["".concat(d.cssPrefix,"-layers-text")].concat(ln(u))}})})}}},provides:function(t){t.generateLayersText=function(e,a){var r=a.title,i=a.transform,o=a.extra,s=null,f=null;if(Ut){var u=parseInt(getComputedStyle(e).fontSize,10),l=e.getBoundingClientRect();s=l.width/u,f=l.height/u}return d.autoA11y&&!r&&(o.attributes["aria-hidden"]="true"),Promise.resolve([e,xt({content:e.innerHTML,width:s,height:f,transform:i,title:r,extra:o,watchable:!0})])}}},za=new RegExp('"',"ug"),It=[1105920,1112319];function Ra(n){var t=n.replace(za,""),e=qe(t,0),a=e>=It[0]&&e<=It[1],r=t.length===2?t[0]===t[1]:!1;return{value:$n(r?t[0]:t),isSecondary:a||r}}function Nt(n,t){var e="".concat(Pe).concat(t.replace(":","-"));return new Promise(function(a,r){if(n.getAttribute(e)!==null)return a();var i=Z(n.children),o=i.filter(function(U){return U.getAttribute(Yn)===t})[0],s=F.getComputedStyle(n,t),f=s.getPropertyValue("font-family").match(Ne),u=s.getPropertyValue("font-weight"),l=s.getPropertyValue("content");if(o&&!f)return n.removeChild(o),a();if(f&&l!=="none"&&l!==""){var m=s.getPropertyValue("content"),v=~["Sharp"].indexOf(f[2])?y:g,p=~["Solid","Regular","Light","Thin","Duotone","Brands","Kit"].indexOf(f[2])?rn[v][f[2].toLowerCase()]:Te[v][u],x=Ra(m),S=x.value,k=x.isSecondary,E=f[0].startsWith("FontAwesome"),w=ot(p,S),A=w;if(E){var C=ea(S);C.iconName&&C.prefix&&(w=C.iconName,p=C.prefix)}if(w&&!k&&(!o||o.getAttribute(nt)!==p||o.getAttribute(tt)!==A)){n.setAttribute(e,A),o&&n.removeChild(o);var P=Sa(),$=P.extra;$.attributes[Yn]=t,Xn(w,p).then(function(U){var _n=ft(c(c({},P),{},{icons:{main:U,mask:st()},prefix:p,iconName:A,extra:$,watchable:!0})),R=h.createElementNS("http://www.w3.org/2000/svg","svg");t==="::before"?n.insertBefore(R,n.firstChild):n.appendChild(R),R.outerHTML=_n.map(function(ve){return cn(ve)}).join(`
`),n.removeAttribute(e),a()}).catch(r)}else a()}else a()})}function ja(n){return Promise.all([Nt(n,"::before"),Nt(n,"::after")])}function Fa(n){return n.parentNode!==document.head&&!~Ee.indexOf(n.tagName.toUpperCase())&&!n.getAttribute(Yn)&&(!n.parentNode||n.parentNode.tagName!=="svg")}function Tt(n){if(z)return new Promise(function(t,e){var a=Z(n.querySelectorAll("*")).filter(Fa).map(ja),r=lt.begin("searchPseudoElements");le(),Promise.all(a).then(function(){r(),Vn(),t()}).catch(function(){r(),Vn(),e()})})}var Da={hooks:function(){return{mutationObserverCallbacks:function(e){return e.pseudoElementsCallback=Tt,e}}},provides:function(t){t.pseudoElements2svg=function(e){var a=e.node,r=a===void 0?h:a;d.searchPseudoElements&&Tt(r)}}},_t=!1,Ya={mixout:function(){return{dom:{unwatch:function(){le(),_t=!0}}}},hooks:function(){return{bootstrap:function(){St(Wn("mutationObserverCallbacks",{}))},noAuto:function(){xa()},watch:function(e){var a=e.observeMutationsRoot;_t?Vn():St(Wn("mutationObserverCallbacks",{observeMutationsRoot:a}))}}}},Mt=function(t){var e={size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0};return t.toLowerCase().split(" ").reduce(function(a,r){var i=r.toLowerCase().split("-"),o=i[0],s=i.slice(1).join("-");if(o&&s==="h")return a.flipX=!0,a;if(o&&s==="v")return a.flipY=!0,a;if(s=parseFloat(s),isNaN(s))return a;switch(o){case"grow":a.size=a.size+s;break;case"shrink":a.size=a.size-s;break;case"left":a.x=a.x-s;break;case"right":a.x=a.x+s;break;case"up":a.y=a.y-s;break;case"down":a.y=a.y+s;break;case"rotate":a.rotate=a.rotate+s;break}return a},e)},$a={mixout:function(){return{parse:{transform:function(e){return Mt(e)}}}},hooks:function(){return{parseNodeAttributes:function(e,a){var r=a.getAttribute("data-fa-transform");return r&&(e.transform=Mt(r)),e}}},provides:function(t){t.generateAbstractTransformGrouping=function(e){var a=e.main,r=e.transform,i=e.containerWidth,o=e.iconWidth,s={transform:"translate(".concat(i/2," 256)")},f="translate(".concat(r.x*32,", ").concat(r.y*32,") "),u="scale(".concat(r.size/16*(r.flipX?-1:1),", ").concat(r.size/16*(r.flipY?-1:1),") "),l="rotate(".concat(r.rotate," 0 0)"),m={transform:"".concat(f," ").concat(u," ").concat(l)},v={transform:"translate(".concat(o/2*-1," -256)")},p={outer:s,inner:m,path:v};return{tag:"g",attributes:c({},p.outer),children:[{tag:"g",attributes:c({},p.inner),children:[{tag:a.icon.tag,children:a.icon.children,attributes:c(c({},a.icon.attributes),p.path)}]}]}}}},Rn={x:0,y:0,width:"100%",height:"100%"};function Lt(n){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return n.attributes&&(n.attributes.fill||t)&&(n.attributes.fill="black"),n}function Ua(n){return n.tag==="g"?n.children:[n]}var Wa={hooks:function(){return{parseNodeAttributes:function(e,a){var r=a.getAttribute("data-fa-mask"),i=r?In(r.split(" ").map(function(o){return o.trim()})):st();return i.prefix||(i.prefix=D()),e.mask=i,e.maskId=a.getAttribute("data-fa-mask-id"),e}}},provides:function(t){t.generateAbstractMask=function(e){var a=e.children,r=e.attributes,i=e.main,o=e.mask,s=e.maskId,f=e.transform,u=i.width,l=i.icon,m=o.width,v=o.icon,p=Ue({transform:f,containerWidth:m,iconWidth:u}),x={tag:"rect",attributes:c(c({},Rn),{},{fill:"white"})},S=l.children?{children:l.children.map(Lt)}:{},k={tag:"g",attributes:c({},p.inner),children:[Lt(c({tag:l.tag,attributes:c(c({},l.attributes),p.path)},S))]},E={tag:"g",attributes:c({},p.outer),children:[k]},w="mask-".concat(s||fn()),A="clip-".concat(s||fn()),C={tag:"mask",attributes:c(c({},Rn),{},{id:w,maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse"}),children:[x,E]},P={tag:"defs",children:[{tag:"clipPath",attributes:{id:A},children:Ua(v)},C]};return a.push(P,{tag:"rect",attributes:c({fill:"currentColor","clip-path":"url(#".concat(A,")"),mask:"url(#".concat(w,")")},Rn)}),{children:a,attributes:r}}}},Ha={provides:function(t){var e=!1;F.matchMedia&&(e=F.matchMedia("(prefers-reduced-motion: reduce)").matches),t.missingIconAbstract=function(){var a=[],r={fill:"currentColor"},i={attributeType:"XML",repeatCount:"indefinite",dur:"2s"};a.push({tag:"path",attributes:c(c({},r),{},{d:"M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"})});var o=c(c({},i),{},{attributeName:"opacity"}),s={tag:"circle",attributes:c(c({},r),{},{cx:"256",cy:"364",r:"28"}),children:[]};return e||s.children.push({tag:"animate",attributes:c(c({},i),{},{attributeName:"r",values:"28;14;28;28;14;28;"})},{tag:"animate",attributes:c(c({},o),{},{values:"1;0;1;1;0;1;"})}),a.push(s),a.push({tag:"path",attributes:c(c({},r),{},{opacity:"1",d:"M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"}),children:e?[]:[{tag:"animate",attributes:c(c({},o),{},{values:"1;0;0;0;0;1;"})}]}),e||a.push({tag:"path",attributes:c(c({},r),{},{opacity:"0",d:"M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"}),children:[{tag:"animate",attributes:c(c({},o),{},{values:"0;0;1;1;0;0;"})}]}),{tag:"g",attributes:{class:"missing"},children:a}}}},Ga={hooks:function(){return{parseNodeAttributes:function(e,a){var r=a.getAttribute("data-fa-symbol"),i=r===null?!1:r===""?!0:r;return e.symbol=i,e}}}},Xa=[Ge,Ta,_a,Ma,La,Da,Ya,$a,Wa,Ha,Ga];ia(Xa,{mixoutsTo:I});I.noAuto;I.config;I.library;I.dom;var qn=I.parse;I.findIconDefinition;I.toHtml;var Ba=I.icon;I.layer;I.text;I.counter;function zt(n,t){var e=Object.keys(n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(n);t&&(a=a.filter(function(r){return Object.getOwnPropertyDescriptor(n,r).enumerable})),e.push.apply(e,a)}return e}function j(n){for(var t=1;t<arguments.length;t++){var e=arguments[t]!=null?arguments[t]:{};t%2?zt(Object(e),!0).forEach(function(a){K(n,a,e[a])}):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(e)):zt(Object(e)).forEach(function(a){Object.defineProperty(n,a,Object.getOwnPropertyDescriptor(e,a))})}return n}function Sn(n){"@babel/helpers - typeof";return Sn=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},Sn(n)}function K(n,t,e){return t in n?Object.defineProperty(n,t,{value:e,enumerable:!0,configurable:!0,writable:!0}):n[t]=e,n}function Va(n,t){if(n==null)return{};var e={},a=Object.keys(n),r,i;for(i=0;i<a.length;i++)r=a[i],!(t.indexOf(r)>=0)&&(e[r]=n[r]);return e}function qa(n,t){if(n==null)return{};var e=Va(n,t),a,r;if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(n);for(r=0;r<i.length;r++)a=i[r],!(t.indexOf(a)>=0)&&Object.prototype.propertyIsEnumerable.call(n,a)&&(e[a]=n[a])}return e}function Kn(n){return Ka(n)||Qa(n)||Ja(n)||Za()}function Ka(n){if(Array.isArray(n))return Qn(n)}function Qa(n){if(typeof Symbol<"u"&&n[Symbol.iterator]!=null||n["@@iterator"]!=null)return Array.from(n)}function Ja(n,t){if(n){if(typeof n=="string")return Qn(n,t);var e=Object.prototype.toString.call(n).slice(8,-1);if(e==="Object"&&n.constructor&&(e=n.constructor.name),e==="Map"||e==="Set")return Array.from(n);if(e==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e))return Qn(n,t)}}function Qn(n,t){(t==null||t>n.length)&&(t=n.length);for(var e=0,a=new Array(t);e<t;e++)a[e]=n[e];return a}function Za(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function nr(n){var t,e=n.beat,a=n.fade,r=n.beatFade,i=n.bounce,o=n.shake,s=n.flash,f=n.spin,u=n.spinPulse,l=n.spinReverse,m=n.pulse,v=n.fixedWidth,p=n.inverse,x=n.border,S=n.listItem,k=n.flip,E=n.size,w=n.rotation,A=n.pull,C=(t={"fa-beat":e,"fa-fade":a,"fa-beat-fade":r,"fa-bounce":i,"fa-shake":o,"fa-flash":s,"fa-spin":f,"fa-spin-reverse":l,"fa-spin-pulse":u,"fa-pulse":m,"fa-fw":v,"fa-inverse":p,"fa-border":x,"fa-li":S,"fa-flip":k===!0,"fa-flip-horizontal":k==="horizontal"||k==="both","fa-flip-vertical":k==="vertical"||k==="both"},K(t,"fa-".concat(E),typeof E<"u"&&E!==null),K(t,"fa-rotate-".concat(w),typeof w<"u"&&w!==null&&w!==0),K(t,"fa-pull-".concat(A),typeof A<"u"&&A!==null),K(t,"fa-swap-opacity",n.swapOpacity),t);return Object.keys(C).map(function(P){return C[P]?P:null}).filter(function(P){return P})}function tr(n){return n=n-0,n===n}function ce(n){return tr(n)?n:(n=n.replace(/[\-_\s]+(.)?/g,function(t,e){return e?e.toUpperCase():""}),n.substr(0,1).toLowerCase()+n.substr(1))}var er=["style"];function ar(n){return n.charAt(0).toUpperCase()+n.slice(1)}function rr(n){return n.split(";").map(function(t){return t.trim()}).filter(function(t){return t}).reduce(function(t,e){var a=e.indexOf(":"),r=ce(e.slice(0,a)),i=e.slice(a+1).trim();return r.startsWith("webkit")?t[ar(r)]=i:t[r]=i,t},{})}function me(n,t){var e=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};if(typeof t=="string")return t;var a=(t.children||[]).map(function(f){return me(n,f)}),r=Object.keys(t.attributes||{}).reduce(function(f,u){var l=t.attributes[u];switch(u){case"class":f.attrs.className=l,delete t.attributes.class;break;case"style":f.attrs.style=rr(l);break;default:u.indexOf("aria-")===0||u.indexOf("data-")===0?f.attrs[u.toLowerCase()]=l:f.attrs[ce(u)]=l}return f},{attrs:{}}),i=e.style,o=i===void 0?{}:i,s=qa(e,er);return r.attrs.style=j(j({},r.attrs.style),o),n.apply(void 0,[t.tag,j(j({},r.attrs),s)].concat(Kn(a)))}var de=!1;try{de=!0}catch{}function ir(){if(!de&&console&&typeof console.error=="function"){var n;(n=console).error.apply(n,arguments)}}function Rt(n){if(n&&Sn(n)==="object"&&n.prefix&&n.iconName&&n.icon)return n;if(qn.icon)return qn.icon(n);if(n===null)return null;if(n&&Sn(n)==="object"&&n.prefix&&n.iconName)return n;if(Array.isArray(n)&&n.length===2)return{prefix:n[0],iconName:n[1]};if(typeof n=="string")return{prefix:"fas",iconName:n}}function jn(n,t){return Array.isArray(t)&&t.length>0||!Array.isArray(t)&&t?K({},n,t):{}}var Tn=jt.forwardRef(function(n,t){var e=n.icon,a=n.mask,r=n.symbol,i=n.className,o=n.title,s=n.titleId,f=n.maskId,u=Rt(e),l=jn("classes",[].concat(Kn(nr(n)),Kn(i.split(" ")))),m=jn("transform",typeof n.transform=="string"?qn.transform(n.transform):n.transform),v=jn("mask",Rt(a)),p=Ba(u,j(j(j(j({},l),m),v),{},{symbol:r,title:o,titleId:s,maskId:f}));if(!p)return ir("Could not find icon",u),null;var x=p.abstract,S={ref:t};return Object.keys(n).forEach(function(k){Tn.defaultProps.hasOwnProperty(k)||(S[k]=n[k])}),or(x[0],S)});Tn.displayName="FontAwesomeIcon";Tn.propTypes={beat:b.bool,border:b.bool,beatFade:b.bool,bounce:b.bool,className:b.string,fade:b.bool,flash:b.bool,mask:b.oneOfType([b.object,b.array,b.string]),maskId:b.string,fixedWidth:b.bool,inverse:b.bool,flip:b.oneOf([!0,!1,"horizontal","vertical","both"]),icon:b.oneOfType([b.object,b.array,b.string]),listItem:b.bool,pull:b.oneOf(["right","left"]),pulse:b.bool,rotation:b.oneOf([0,90,180,270]),shake:b.bool,size:b.oneOf(["2xs","xs","sm","lg","xl","2xl","1x","2x","3x","4x","5x","6x","7x","8x","9x","10x"]),spin:b.bool,spinPulse:b.bool,spinReverse:b.bool,symbol:b.oneOfType([b.bool,b.string]),title:b.string,titleId:b.string,transform:b.oneOfType([b.string,b.object]),swapOpacity:b.bool};Tn.defaultProps={border:!1,className:"",mask:null,maskId:null,fixedWidth:!1,inverse:!1,flip:!1,icon:null,listItem:!1,pull:null,pulse:!1,rotation:null,size:null,spin:!1,spinPulse:!1,spinReverse:!1,beat:!1,fade:!1,beatFade:!1,bounce:!1,shake:!1,symbol:!1,title:"",titleId:null,transform:null,swapOpacity:!1};var or=me.bind(null,jt.createElement),fr={prefix:"fab",iconName:"github",icon:[496,512,[],"f09b","M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"]};export{Tn as F,fr as f};

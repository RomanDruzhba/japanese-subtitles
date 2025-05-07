(function (exports) {
    'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol, Iterator */


    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    /**
     * @license
     * Copyright 2019 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */
    const t$1=globalThis,e$4=t$1.ShadowRoot&&(void 0===t$1.ShadyCSS||t$1.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$4=new WeakMap;let n$3 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$4&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$4.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$4.set(s,t));}return t}toString(){return this.cssText}};const r$3=t=>new n$3("string"==typeof t?t:t+"",void 0,s$2),i$3=(t,...e)=>{const o=1===t.length?t[0]:e.reduce(((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1]),t[0]);return new n$3(o,t,s$2)},S$1=(s,o)=>{if(e$4)s.adoptedStyleSheets=o.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const e of o){const o=document.createElement("style"),n=t$1.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$4?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$3(e)})(t):t;

    /**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */const{is:i$2,defineProperty:e$3,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$2,getOwnPropertySymbols:o$3,getPrototypeOf:n$2}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$1=c$1?c$1.emptyScript:"",p$1=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$2(t,s),b={attribute:true,type:String,converter:u$1,reflect:false,useDefault:false,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$3(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$2(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$2(t),...o$3(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach((t=>t.hostConnected?.()));}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()));}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e,this[e]=h.fromAttribute(s,t.type)??this._$Ej?.get(e)??null,this._$Em=null;}}requestUpdate(t,s,i){if(void 0!==t){const e=this.constructor,h=this[t];if(i??=e.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(e._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach((t=>this._$ET(t,this[t]))),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$1?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.0");

    /**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */
    const t=globalThis,i$1=t.trustedTypes,s$1=i$1?i$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,e$2="$lit$",h=`lit$${Math.random().toFixed(9).slice(2)}$`,o$2="?"+h,n$1=`<${o$2}>`,r$1=document,l=()=>r$1.createComment(""),c=t=>null===t||"object"!=typeof t&&"function"!=typeof t,a=Array.isArray,u=t=>a(t)||"function"==typeof t?.[Symbol.iterator],d="[ \t\n\f\r]",f=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,v=/-->/g,_=/>/g,m=RegExp(`>|${d}(?:([^\\s"'>=/]+)(${d}*=${d}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),p=/'/g,g=/"/g,$=/^(?:script|style|textarea|title)$/i,y=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),x=y(1),T=Symbol.for("lit-noChange"),E=Symbol.for("lit-nothing"),A=new WeakMap,C=r$1.createTreeWalker(r$1,129);function P(t,i){if(!a(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==s$1?s$1.createHTML(i):i}const V=(t,i)=>{const s=t.length-1,o=[];let r,l=2===i?"<svg>":3===i?"<math>":"",c=f;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,y=0;for(;y<s.length&&(c.lastIndex=y,u=c.exec(s),null!==u);)y=c.lastIndex,c===f?"!--"===u[1]?c=v:void 0!==u[1]?c=_:void 0!==u[2]?($.test(u[2])&&(r=RegExp("</"+u[2],"g")),c=m):void 0!==u[3]&&(c=m):c===m?">"===u[0]?(c=r??f,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?m:'"'===u[3]?g:p):c===g||c===p?c=m:c===v||c===_?c=f:(c=m,r=void 0);const x=c===m&&t[i+1].startsWith("/>")?" ":"";l+=c===f?s+n$1:d>=0?(o.push(a),s.slice(0,d)+e$2+s.slice(d)+h+x):s+h+(-2===d?i:x);}return [P(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),o]};class N{constructor({strings:t,_$litType$:s},n){let r;this.parts=[];let c=0,a=0;const u=t.length-1,d=this.parts,[f,v]=V(t,s);if(this.el=N.createElement(f,n),C.currentNode=this.el.content,2===s||3===s){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=C.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(e$2)){const i=v[a++],s=r.getAttribute(t).split(h),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:c,name:e[2],strings:s,ctor:"."===e[1]?H:"?"===e[1]?I:"@"===e[1]?L:k}),r.removeAttribute(t);}else t.startsWith(h)&&(d.push({type:6,index:c}),r.removeAttribute(t));if($.test(r.tagName)){const t=r.textContent.split(h),s=t.length-1;if(s>0){r.textContent=i$1?i$1.emptyScript:"";for(let i=0;i<s;i++)r.append(t[i],l()),C.nextNode(),d.push({type:2,index:++c});r.append(t[s],l());}}}else if(8===r.nodeType)if(r.data===o$2)d.push({type:2,index:c});else {let t=-1;for(;-1!==(t=r.data.indexOf(h,t+1));)d.push({type:7,index:c}),t+=h.length-1;}c++;}}static createElement(t,i){const s=r$1.createElement("template");return s.innerHTML=t,s}}function S(t,i,s=t,e){if(i===T)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=c(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=S(t,h._$AS(t,i.values),h,e)),i}class M{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??r$1).importNode(i,true);C.currentNode=e;let h=C.nextNode(),o=0,n=0,l=s[0];for(;void 0!==l;){if(o===l.index){let i;2===l.type?i=new R(h,h.nextSibling,this,t):1===l.type?i=new l.ctor(h,l.name,l.strings,this,t):6===l.type&&(i=new z(h,this,t)),this._$AV.push(i),l=s[++n];}o!==l?.index&&(h=C.nextNode(),o++);}return C.currentNode=r$1,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class R{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=E,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=S(this,t,i),c(t)?t===E||null==t||""===t?(this._$AH!==E&&this._$AR(),this._$AH=E):t!==this._$AH&&t!==T&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):u(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==E&&c(this._$AH)?this._$AA.nextSibling.data=t:this.T(r$1.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=N.createElement(P(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new M(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=A.get(t.strings);return void 0===i&&A.set(t.strings,i=new N(t)),i}k(t){a(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new R(this.O(l()),this.O(l()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,i){for(this._$AP?.(false,true,i);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class k{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=E,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=E;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=S(this,t,i,0),o=!c(t)||t!==this._$AH&&t!==T,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=S(this,e[s+n],i,n),r===T&&(r=this._$AH[n]),o||=!c(r)||r!==this._$AH[n],r===E?t=E:t!==E&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===E?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class H extends k{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===E?void 0:t;}}class I extends k{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==E);}}class L extends k{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=S(this,t,i,0)??E)===T)return;const s=this._$AH,e=t===E&&s!==E||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==E&&(s===E||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){S(this,t);}}const j=t.litHtmlPolyfillSupport;j?.(N,R),(t.litHtmlVersions??=[]).push("3.3.0");const B=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new R(i.insertBefore(l(),t),t,void 0,s??{});}return h._$AI(t),h};

    /**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */const s=globalThis;class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=B(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return T}}i._$litElement$=true,i["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i});const o$1=s.litElementPolyfillSupport;o$1?.({LitElement:i});(s.litElementVersions??=[]).push("4.2.0");

    /**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */const o={attribute:true,type:String,converter:u$1,reflect:false,hasChanged:f$1},r=(t=o,e,r)=>{const{kind:n,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(void 0===s&&globalThis.litPropertyMetadata.set(i,s=new Map),"setter"===n&&((t=Object.create(t)).wrapped=true),s.set(r.name,t),"accessor"===n){const{name:o}=r;return {set(r){const n=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,n,t);},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===n){const{name:o}=r;return function(r){const n=this[o];e.call(this,r),this.requestUpdate(o,n,t);}}throw Error("Unsupported decorator location: "+n)};function n(t){return (e,o)=>"object"==typeof o?r(t,e,o):((t,e,o)=>{const r=e.hasOwnProperty(o);return e.constructor.createProperty(o,t),r?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}

    /**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */
    const e$1=(e,t,c)=>(c.configurable=true,c.enumerable=true,Reflect.decorate&&"object"!=typeof t&&Object.defineProperty(e,t,c),c);

    /**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */function e(e,r){return (n,s,i)=>{const o=t=>t.renderRoot?.querySelector(e)??null;return e$1(n,s,{get(){return o(this)}})}}

    const style$1 = i$3`
    :host {
      display: block;
      position: relative;
    }

    video {
      width: 100%;
    }
`;

    const styles$2 = i$3`
  :host {
    position: absolute;
    display: grid;
    top: 8px;
    right: 8px;
    color: white;
  }

  #dropdown {
    box-sizing: border-box;
    margin: 2px 0 0;
    padding: 16px 4px;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.2);
    cursor: default;
  }

  #dropdown ul {
    box-sizing: border-box;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  #dropdown li {
    box-sizing: border-box;
    width: 100%;
    padding: 8px 24px;

    border-radius: 8px;
  }

  #dropdown li:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  svg {
    fill: white;
  }

  #subtitles {
    justify-self: end;

    width: 40px;
    height: 40px;

    padding: 8px;
    border-radius: 8px;

    transition: background 300ms ease;
  }

  #subtitles:hover {
    background: rgba(0, 0, 0, 0.2);
  }

  button {
    box-sizing: border-box;
    background: none;
    color: inherit;
    border: none;
    font: inherit;
    cursor: default;
    outline: inherit;
    margin: 0;
  }
`;

    const renderSubtitlesIcon = () => {
      return x`
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
        <path d="M18.795 4H5.205c-1.115 0-1.519.116-1.926.334a2.272 2.272 0 0 0-.945.945C2.116 5.686 2 6.09 2 7.205v9.59c0 1.114.116 1.519.334 1.926.218.407.538.727.945.945.407.218.811.334 1.926.334h13.59c1.114 0 1.519-.116 1.926-.334.407-.218.727-.538.945-.945.218-.407.334-.811.334-1.926v-9.59c0-1.115-.116-1.519-.334-1.926a2.272 2.272 0 0 0-.945-.945C20.314 4.116 19.91 4 18.795 4ZM4.356 6.049c.155-.03.422-.049.849-.049h13.59c.427 0 .694.019.849.049.06.012.074.017.134.049a.275.275 0 0 1 .125.124c.031.06.036.073.048.134.03.155.049.422.049.849v9.59c0 .427-.019.694-.049.849a.353.353 0 0 1-.049.134.275.275 0 0 1-.124.125.353.353 0 0 1-.134.048c-.155.03-.422.049-.849.049H5.205c-.427 0-.694-.019-.849-.049a.353.353 0 0 1-.134-.049.275.275 0 0 1-.124-.124.353.353 0 0 1-.049-.134c-.03-.155-.049-.422-.049-.849v-9.59c0-.427.019-.694.049-.849a.353.353 0 0 1 .049-.134.275.275 0 0 1 .124-.124.353.353 0 0 1 .134-.049ZM6 15a1 1 0 0 1 1-1h5a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1Zm9-1a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2h-2Zm-9-3a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1Zm5-1a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-6Z"/>
    </svg>
  `;
    };
    class JpPanel extends i {
      constructor() {
        super(...arguments);
        this.showDropdown = false;
      }
      render() {
        return x`
      <button id="subtitles" @click="${this.toggleDropDown}">
        ${renderSubtitlesIcon()}
      </button>
      <div id="dropdown" ?hidden="${!this.showDropdown}">
        <ul>
          ${Array.from(this.textTracks ?? []).map(textTrack => x`
              <li>
                <button @click="${() => this.onSelectItem(textTrack)}">
                  ${textTrack.label} ${!textTrack.isActive || textTrack.isActive === 'true' ? '  ✔' : ''}
                </button>
              </li>
            `)}
        </ul>
      </div>
    `;
      }
      firstUpdated() {
        this.addEventListener('blur', () => {
          if (this.showDropdown) {
            this.showDropdown = false;
          }
        }, true);
      }
      onSelectItem(textTrack) {
        this.handleTextTrackClick?.(textTrack);
        this.showDropdown = false;
      }
      toggleDropDown() {
        this.showDropdown = !this.showDropdown;
      }
    }
    JpPanel.is = 'jp-panel';
    JpPanel.styles = styles$2;
    __decorate([n({
      type: Function
    }), __metadata("design:type", Function)], JpPanel.prototype, "handleTextTrackClick", void 0);
    __decorate([n({
      type: Object
    }), __metadata("design:type", Object)], JpPanel.prototype, "textTracks", void 0);
    __decorate([n({
      type: Boolean
    }), __metadata("design:type", Object)], JpPanel.prototype, "showDropdown", void 0);
    customElements.define(JpPanel.is, JpPanel);

    const styles$1 = i$3`
  :host {
    position: absolute;
    top: 12%;
    left: 0;
    right: 0;
    max-width: 80%;
    margin: 0 auto;
    text-align: center;
    cursor: default;
    box-sizing: border-box;
  }
`;

    const styles = i$3`
  :host {
    pointer-events: none;
    display: block;
    width: 100%;
    min-height: 24px;
    border-radius: 8px;
    margin-bottom: 4px;
    padding: 4px 8px;
    letter-spacing: 1px;
    transition: all 150ms ease-in-out;
  }

  :host([active]) {
    background-color: rgba(0, 0, 0, 0.5);
    pointer-events: all;
  }

  :host([hidden="true"]) {
    display: none;
  }
`;

    const style = i$3`
:host {
  color: #ddd;
}

:host(:hover) {
  color: #fff;
}

button {
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: default;
  outline: inherit;
}
`;

    // import {html, LitElement} from 'lit';
    // import {property} from 'lit/decorators.js';
    // import styles from 'subtitles/components/jp_token/style';
    class JpToken extends i {
      constructor() {
        super(...arguments);
        this.token = '';
        this.lang = ''; // Добавили язык токена (например, 'jpn', 'ru')
      }
      render() {
        return x`
      <button @click="${this.handleClick}" data-lang="${this.lang}">
        ${this.token}
      </button>
    `;
      }
      handleClick() {
        if (this.lang === 'jpn' && this.handleJapaneseClick) {
          this.handleJapaneseClick(this.token);
        } else if (this.handleTokenClick) {
          this.handleTokenClick(this.token);
        }
      }
    }
    JpToken.is = 'jp-token';
    JpToken.styles = style;
    __decorate([n({
      type: String
    }), __metadata("design:type", Object)], JpToken.prototype, "token", void 0);
    __decorate([n({
      type: String
    }), __metadata("design:type", Object)], JpToken.prototype, "lang", void 0);
    __decorate([n({
      type: Function
    }), __metadata("design:type", Function)], JpToken.prototype, "handleTokenClick", void 0);
    __decorate([n({
      type: Function
    }), __metadata("design:type", Function)], JpToken.prototype, "handleJapaneseClick", void 0);
    customElements.define(JpToken.is, JpToken);

    // import styles from 'subtitles/components/jp_line/style';
    // import {html, LitElement} from 'lit';
    // import {property} from 'lit/decorators.js';
    // import 'subtitles/components/jp_token/jp_token';
    class JpLine extends i {
      constructor() {
        super();
        this.lang = '';
        this.tokens = [];
        this.active = false;
        this.handleCueChange = this.handleCueChange.bind(this);
        this.handleCueEnter = this.handleCueEnter.bind(this);
        this.handleCueExit = this.handleCueExit.bind(this);
      }
      render() {
        return x`
      ${this.tokens.map((token, index) => x`
        <jp-token
          token="${token}"
          lang="${this.lang}"
          .handleTokenClick="${this.handleTokenClick}"
          .handleJapaneseClick="${this.handleJapaneseClick}"
        ></jp-token>
        ${index === this.tokens.length - 1 ? '' : x`<span> </span>`}
      `)}
    `;
      }
      connectedCallback() {
        super.connectedCallback();
        this.textTrack.addEventListener('cuechange', this.handleCueChange);
      }
      disconnectedCallback() {
        super.disconnectedCallback();
        this.textTrack.removeEventListener('cuechange', this.handleCueChange);
      }
      handleCueChange(event) {
        const textTrack = event.target;
        const vttCue = textTrack.activeCues?.[0];
        if (!vttCue) return;
        this.handleCueEnter(vttCue);
        const exitHandler = () => this.handleCueExit(vttCue);
        // @ts-expect-error: расширяем VTTCue, чтобы хранить обработчик выхода
        vttCue.exitHandler = exitHandler;
        vttCue.addEventListener('exit', exitHandler);
      }
      handleCueEnter(vttCue) {
        this.updateLine(vttCue.text);
      }
      handleCueExit(vttCue) {
        // @ts-expect-error: проверяем
        if (vttCue.exitHandler) {
          // @ts-expect-error: удаляем ранее добавленный обработчик выхода
          vttCue.removeEventListener('exit', vttCue.exitHandler);
          // @ts-expect-error: обнуляем кастомное свойство
          vttCue.exitHandler = null;
        }
        this.clearLine();
      }
      updateLine(line) {
        this.clearLine();
        this.tokens = this.parseTokens(line);
        this.active = true;
      }
      clearLine() {
        this.active = false;
        this.tokens = [];
      }
      parseTokens(line) {
        if (this.lang === 'jpn' || this.lang === 'jp') {
          // Для японского — по символам
          return Array.from(line.trim());
        } else {
          // Для остальных языков — по словам
          return line.trim().split(/\s+/);
        }
      }
    }
    JpLine.is = 'jp-line';
    JpLine.styles = styles;
    __decorate([n({
      type: String
    }), __metadata("design:type", Object)], JpLine.prototype, "lang", void 0);
    __decorate([n({
      type: Object
    }), __metadata("design:type", TextTrack)], JpLine.prototype, "textTrack", void 0);
    __decorate([n({
      type: Array
    }), __metadata("design:type", Array)], JpLine.prototype, "tokens", void 0);
    __decorate([n({
      type: Boolean,
      reflect: true
    }), __metadata("design:type", Object)], JpLine.prototype, "active", void 0);
    __decorate([n({
      type: Function
    }), __metadata("design:type", Function)], JpLine.prototype, "handleTokenClick", void 0);
    __decorate([n({
      type: Function
    }), __metadata("design:type", Function)], JpLine.prototype, "handleJapaneseClick", void 0);
    customElements.define(JpLine.is, JpLine);

    // import {property} from 'lit/decorators.js';
    // import styles from 'subtitles/style';
    // import {LitElement, html} from 'lit';
    // import {TextTrackExtendedList} from 'types';
    class JpSubtitles extends i {
      render() {
        if (!this.textTracks) {
          return x``;
        }
        return x`
      ${Array.from(this.textTracks).filter(track => track.isActive !== 'false').map(track => x`
          <jp-line
            lang="${track.language}"
            .textTrack="${track}"
            .handleTokenClick="${this.handleTokenClick}"
          ></jp-line>
        `)}
    `;
      }
      forceUpdate() {
        this.requestUpdate();
      }
    }
    JpSubtitles.is = 'jp-subtitles';
    JpSubtitles.styles = styles$1;
    __decorate([n({
      type: Object
    }), __metadata("design:type", Object)], JpSubtitles.prototype, "textTracks", void 0);
    __decorate([n({
      type: Function
    }), __metadata("design:type", Function)], JpSubtitles.prototype, "handleTokenClick", void 0);
    customElements.define(JpSubtitles.is, JpSubtitles);

    // import { LitElement, html, PropertyValues } from 'lit';
    // import { property, query } from 'lit/decorators.js';
    // import style from './style';
    // import { JpPanel } from 'subtitles/components/jp_panel/jp_panel';
    // import { JpSubtitles } from 'subtitles/jp_subtitles';
    // import { Subtitle, TextTrackExtended, TextTrackExtendedList, DictionaryEntry } from 'types';
    // import './DictionaryModal'; // убедись, что путь правильный
    class JapaneseVideoPlayer extends i {
      constructor() {
        super(...arguments);
        this.src = '';
        this.subtitles = [];
        this.dictionary = {};
        this.toggleSubtitle = textTrack => {
          textTrack.isActive = textTrack.isActive === 'true' ? 'false' : 'true';
          this.subtitlesElement.forceUpdate();
        };
        this.handleTokenClickInternal = token => {
          if (this.handleTokenClick) {
            this.handleTokenClick(token);
          }
        };
      }
      render() {
        return x`
      <video
        id="video"
        src="${this.src}"
        preload="auto"
        controls
        controlsList="nodownload"
      >
        ${this.subtitles.map(subtitle => x`
            <track
              id="${subtitle.srclang}"
              kind="subtitles"
              src="${subtitle.src}"
              srclang="${subtitle.srclang}"
              label="${subtitle.label}"
              ${subtitle.default ? 'default' : ''}
            >
          `)}
        Your browser does not support the video tag.
      </video>

      <jp-subtitles .handleTokenClick="${this.handleTokenClickInternal}"></jp-subtitles>
      <jp-panel .handleTextTrackClick="${this.toggleSubtitle}"></jp-panel>
    `;
      }
      updated(changedProperties) {
        if (changedProperties.has('subtitles') && this.videoElement) {
          const trackList = this.videoElement.textTracks;
          const tracks = Array.from(trackList); // безопасно и типизировано
          const textTracks = tracks.map(track => {
            const extended = track;
            extended.isActive = 'true';
            return extended;
          });
          this.subtitlesElement.textTracks = textTracks;
          this.panelElement.textTracks = textTracks;
        }
      }
      async firstUpdated(changedProperties) {
        if (changedProperties.has('subtitles') && this.videoElement) {
          this.loadSubtitles();
        }
      }
      loadSubtitles() {
        for (const textTrack of Array.from(this.videoElement.textTracks)) {
          textTrack.mode = 'showing';
          textTrack.mode = 'hidden';
        }
      }
    }
    JapaneseVideoPlayer.is = 'japanese-video-player';
    JapaneseVideoPlayer.styles = style$1;
    __decorate([n({
      type: String
    }), __metadata("design:type", Object)], JapaneseVideoPlayer.prototype, "src", void 0);
    __decorate([n({
      type: Array
    }), __metadata("design:type", Array)], JapaneseVideoPlayer.prototype, "subtitles", void 0);
    __decorate([n({
      type: Function
    }), __metadata("design:type", Function)], JapaneseVideoPlayer.prototype, "handleTokenClick", void 0);
    __decorate([e('#video'), __metadata("design:type", HTMLVideoElement)], JapaneseVideoPlayer.prototype, "videoElement", void 0);
    __decorate([e(JpSubtitles.is), __metadata("design:type", JpSubtitles)], JapaneseVideoPlayer.prototype, "subtitlesElement", void 0);
    __decorate([e(JpPanel.is), __metadata("design:type", JpPanel)], JapaneseVideoPlayer.prototype, "panelElement", void 0);
    customElements.define(JapaneseVideoPlayer.is, JapaneseVideoPlayer);

    exports.JapaneseVideoPlayer = JapaneseVideoPlayer;

    return exports;

})({});
//# sourceMappingURL=japanese_video_player.js.map

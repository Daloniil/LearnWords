(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[926],{1366:function(n,r,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/enter",function(){return t(7162)}])},4690:function(n,r,t){"use strict";t.d(r,{E3:function(){return e},f8:function(){return i},Xm:function(){return o},dV:function(){return a},gb:function(){return u},xk:function(){return s},Me:function(){return c},ri:function(){return d},pt:function(){return l},cp:function(){return f},ib:function(){return p},mY:function(){return x},yD:function(){return h},IS:function(){return g},Tz:function(){return m}});var e={fontSize:"22px",textAlign:"center",fontWeight:"bold",margin:"10px 0 5px 0"},i={display:"flex",justifyContent:"center",margin:"5px 0 25px 0"},o={margin:"0 2px 0 2px"},a={borderRadius:"50%",width:"25px",height:"25px",backgroundColor:"green"},u={borderRadius:"50%",width:"25px",height:"25px",backgroundColor:"gray"},s={maxWidth:"340px",display:"flex",flexWrap:"wrap",justifyContent:"center",margin:"0 auto 0 auto"},c={minWidth:"120px",minHeight:"100px",textAlign:"center",border:2,borderColor:"#E0E0E0",borderRadius:"5px"},d={padding:"30px 0 0 0",margin:"5px 0 25px 0",maxWidth:"120px"},l={display:"flex",justifyContent:"center",margin:"5px 0 0 0"},f={border:2,borderColor:"#E0E0E0",borderRadius:"5px",textAlign:"center",maxWidth:"225px",height:"35px",maxHeight:"100%"},p={width:"75%",margin:"10px auto 0 auto"},x={textAlign:"center",margin:"0 0 0 10px"},h={margin:"0 0 0 10px"},g={display:"flex",alignItems:"center"},m={minWidth:"70px",height:"30px",margin:"-5px -5px 0 auto"}},834:function(n,r,t){"use strict";t.d(r,{R:function(){return o}});var e=t(6832),i=t(4239),o=function(){var n=(0,e.b)().englishWords;return{findWords:function(r,t){return t===i.Dj.ENGLISH?n.find((function(n){return n.word===r.englishWord})):n.find((function(n){return n.correctTranslation===r.russianWord}))},search:function(n,r){var t=[];return n.filter((function(n){return n.word.toLowerCase().includes(r)||n.correctTranslation.toLowerCase().includes(r)})).forEach((function(n){t.push(n)})),t}}}},7162:function(n,r,t){"use strict";t.r(r),t.d(r,{default:function(){return O}});var e=t(4051),i=t.n(e),o=t(5893),a=t(7357),u=t(2474),s=t(5861),c=t(8456),d=t(8216),l=t(3321),f=t(7536),p=t(4231),x=t(5496),h=t(7381),g=t(834),m=t(3928),W={display:"flex",padding:"20px 0 0 0",maxWidth:"650px",flexWrap:"wrap",justifyContent:"center",minHeight:"100px"},v={margin:"5px 5px 10px 5px"},b={margin:"5px 0 0 0",color:"#3874CB",textAlign:"center",borderBlockColor:"#C4C4C4",fontSize:"20px"},E={margin:"0 10px 0 0",float:"right"},y=t(4239),S=t(1360),j=t(7294),w=t(9669),I=t.n(w)().create({baseURL:"https://microsoft-translator-text.p.rapidapi.com"});I.interceptors.request.use((function(n){return n.params=C,n.headers=N,n}),(function(n){return Promise.reject(n)}));var C={to:"ru","api-version":"3.0",profanityAction:"NoAction",textType:"plain"},N={"content-type":"application/json","X-RapidAPI-Host":"microsoft-translator-text.p.rapidapi.com","X-RapidAPI-Key":"de7df71105msh595cc98825cd7ccp17ba88jsnf8d71fc903e6"};var R=function(){function n(){!function(n,r){if(!(n instanceof r))throw new TypeError("Cannot call a class as a function")}(this,n)}return n.translate=function(n){return I.post("/translate",n)},n}(),A=t(6832),T=t(4690),L=[{title:"russian",ru:"\u0420\u0443\u0441\u0441\u043a\u0438\u0439",en:"Russian"},{title:"english",ru:"\u0410\u043d\u0433\u043b\u0438\u0441\u044c\u043a\u0438\u0439",en:"English"},{title:"enterWord",ru:"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0441\u043b\u043e\u0432\u043e \u043a\u043e\u0442\u043e\u0440\u043e\u0435 \u0445\u043e\u0442\u0438\u0442\u0435 \u0432\u044b\u0443\u0447\u0438\u0442\u044c",en:"Enter the word you want to learn"},{title:"translation",ru:"\u0420\u0435\u043a\u043e\u043c\u0435\u043d\u0434\u043e\u0432\u0430\u043d\u044b\u0439 \u043f\u0435\u0440\u0435\u0432\u043e\u0434",en:"Recommend Translation"},{title:"addButton",ru:"\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c",en:"Add"}],H=t(6917),Z=t(158);function P(n,r,t,e,i,o,a){try{var u=n[o](a),s=u.value}catch(c){return void t(c)}u.done?r(s):Promise.resolve(s).then(e,i)}function _(n,r,t){return r in n?Object.defineProperty(n,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):n[r]=t,n}function k(n){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{},e=Object.keys(t);"function"===typeof Object.getOwnPropertySymbols&&(e=e.concat(Object.getOwnPropertySymbols(t).filter((function(n){return Object.getOwnPropertyDescriptor(t,n).enumerable})))),e.forEach((function(r){_(n,r,t[r])}))}return n}var O=function(){var n,r,t=(0,m.l)().addNotification,e=(0,g.R)().findWords,w=function(){var n=(0,A.b)(),r=n.englishWords,t=n.updateWord,e=n.setWord;return{words:r,addWord:function(n,r){var t={id:0,word:r===y.Dj.ENGLISH?n.englishWord:n.russianWord,correctTranslation:r===y.Dj.ENGLISH?n.russianWord:n.englishWord,point:0};e(t,r)},addUpdateWord:function(n,e){var i=e===y.Dj.ENGLISH,o=i?y.IY.word:y.IY.correctTranslation,a=i?y.rW.ENGLISH:y.rW.RUSSIAN,u=i?y.IY.correctTranslation:y.IY.word,s=i?y.rW.RUSSIAN:y.rW.ENGLISH,c=r.map((function(n){return n[o]})).indexOf(n[a]),d=r[c],l=r[c];d[u]="".concat(d[u],", ").concat(n[s]),t(d,y.Dj.ENGLISH),l[u]="".concat(l[u],", ").concat(n[s]," "),t(l,y.Dj.RUSSIAN)}}}(),I=w.words,C=w.addWord,N=w.addUpdateWord,_=(0,H.Z)().languageContext,O=(0,j.useState)(""),D=O[0],G=O[1],U=function(n,r){var t=(0,j.useState)(n),e=t[0],i=t[1];return(0,j.useEffect)((function(){var t=setTimeout((function(){i(n)}),r);return function(){clearTimeout(t)}}),[n,r]),e}(D,200),B=(0,j.useState)(!1),X=B[0],Y=B[1],q=(0,j.useState)([]),z=q[0],F=q[1],M=p.Ry().shape({englishWord:p.Z_().required("This Field Cannot Be Empty"),russianWord:p.Z_().required("This Field Cannot Be Empty")}),V=(0,f.cI)({resolver:(0,x.X)(M)}),K=V.register,J=V.handleSubmit,Q=V.formState.errors,$=V.setError,nn=V.reset,rn=V.setValue,tn=function(){nn({englishWord:"",russianWord:""}),t("wordAdd",y.dr.SUCCESS)},en=function(){var n,r=(n=i().mark((function n(r){var e,o;return i().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,R.translate(r).catch((function(n){t(n.message,y.dr.ERROR),Y(!1)}));case 2:e=n.sent,o=null===e||void 0===e?void 0:e.data,Y(!1),o&&F(o);case 6:case"end":return n.stop()}}),n)})),function(){var r=this,t=arguments;return new Promise((function(e,i){var o=n.apply(r,t);function a(n){P(o,e,i,a,u,"next",n)}function u(n){P(o,e,i,a,u,"throw",n)}a(void 0)}))});return function(n){return r.apply(this,arguments)}}(),on=function(n){return(0,Z._)(n,L,_)};return(0,j.useEffect)((function(){en([{Text:U}])}),[U]),(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(a.Z,{sx:b,children:on("enterWord")}),(0,o.jsxs)("form",{onSubmit:J((function(n){(function(n){var r=!0;return Object.keys(n).forEach((function(t){var e=t;if((0,S.n)(n[e]).length>y.tY.MAXLENGHT){var i=t===y.rW.ENGLISH?y.rW.ENGLISH:y.rW.RUSSIAN;$(i,{type:"manual",message:"".concat(n[i]," Too Big A Word")}),r=!1}})),r})(n)&&function(n){if(I.length>0){var r=[y.Dj.ENGLISH,y.Dj.RUSSIAN],i=[];if(r.forEach((function(r){e(n,r)&&i.push(r)})),0!==i.length)return i.length>1?void t("hasAlready",y.dr.ERROR):(N(n,i[0]),void tn())}G(""),C(n,y.Dj.ENGLISH),C(n,y.Dj.RUSSIAN),tn()}(n=(0,h.P)(n))})),style:{margin:"0 auto"},children:[(0,o.jsxs)(a.Z,{sx:W,children:[(0,o.jsx)(u.Z,k({error:!!Q.englishWord,sx:v,label:on("english")},K("englishWord",{required:!0}),{InputLabelProps:{shrink:!0},helperText:null===(n=Q.englishWord)||void 0===n?void 0:n.message,onChange:function(n){Y(!0),G(n.target.value)}})),(0,o.jsxs)(a.Z,{children:[(0,o.jsx)(u.Z,k({error:!!Q.russianWord,sx:v,label:on("russian")},K("russianWord",{required:!0}),{InputLabelProps:{shrink:!0},helperText:null===(r=Q.russianWord)||void 0===r?void 0:r.message})),(0,o.jsxs)(a.Z,{style:{margin:"-5px 0 5px 5px",display:D?"":"none"},children:[(0,o.jsx)(s.Z,{sx:{textAlign:"center"},children:on("translation")}),X?(0,o.jsx)(a.Z,{sx:T.pt,children:(0,o.jsx)(c.Z,{})}):(0,o.jsx)(a.Z,{sx:T.cp,onClick:function(){return rn("russianWord",z[0].translations[0].text)},children:(0,o.jsx)(s.Z,{sx:{margin:"5px"},children:z[0]?(0,d.Z)(z[0].translations[0].text):""})})]})]})]}),(0,o.jsx)(l.Z,{variant:"outlined",size:"medium",type:"submit",sx:E,children:on("addButton")})]})]})}},1360:function(n,r,t){"use strict";t.d(r,{n:function(){return e}});var e=function(n){return n.split(/\W+/).reduce((function(n,r){return r.length>n.length?r:n}),"")}},7381:function(n,r,t){"use strict";t.d(r,{P:function(){return e}});var e=function(n){return n.englishWord=n.englishWord.toLowerCase(),n.russianWord=n.russianWord.toLowerCase(),n}}},function(n){n.O(0,[683,984,263,774,888,179],(function(){return r=1366,n(n.s=r);var r}));var r=n.O();_N_E=r}]);
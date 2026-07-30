import{i as e,n as t,t as n}from"./jsx-runtime-ByY1xr43.js";import{t as r}from"./index-MdVTdvfE.js";var i=e(t(),1),a=n(),o={SIM_RESOLUTION:128,DYE_RESOLUTION:1440,DENSITY_DISSIPATION:3.5,VELOCITY_DISSIPATION:2,PRESSURE:.1,PRESSURE_ITERATIONS:20,CURL:3,SPLAT_RADIUS:.2,SPLAT_FORCE:6e3,SHADING:!0,COLOR_UPDATE_SPEED:10};function s(){return{id:-1,texcoordX:0,texcoordY:0,prevTexcoordX:0,prevTexcoordY:0,deltaX:0,deltaY:0,moved:!1,color:[.03,.06,.09]}}function c(e,t,n){let r,i,a,o=Math.floor(e*6),s=e*6-o,c=n*(1-t),l=n*(1-s*t),u=n*(1-(1-s)*t);switch(o%6){case 0:r=n,i=u,a=c;break;case 1:r=l,i=n,a=c;break;case 2:r=c,i=n,a=u;break;case 3:r=c,i=l,a=n;break;case 4:r=u,i=c,a=n;break;default:r=n,i=c,a=l;break}return{r,g:i,b:a}}function l(){let e=c(.515+Math.random()*.115,.75+Math.random()*.25,1);return[e.r*.15,e.g*.15,e.b*.15]}function u(){let e=(0,i.useRef)(null);return(0,i.useEffect)(()=>{let t=e.current;if(!t)return;let n=document.createElement(`canvas`);n.className=r.canvas,t.appendChild(n);let i=Math.min(window.devicePixelRatio||1,2),a=e=>Math.floor(e*i),c={alpha:!0,depth:!1,stencil:!1,antialias:!1,preserveDrawingBuffer:!1},u=n.getContext(`webgl2`,c),d=!!u;if(u||=n.getContext(`webgl`,c)||n.getContext(`experimental-webgl`,c),!u){n.remove();return}let f=null,p=null;d?(u.getExtension(`EXT_color_buffer_float`),p=u.getExtension(`OES_texture_float_linear`)):(f=u.getExtension(`OES_texture_half_float`),p=u.getExtension(`OES_texture_half_float_linear`)),u.clearColor(0,0,0,0);let m=d?u.HALF_FLOAT:f&&f.HALF_FLOAT_OES;function ee(e,t,n){let r=u.createTexture();u.bindTexture(u.TEXTURE_2D,r),u.texParameteri(u.TEXTURE_2D,u.TEXTURE_MIN_FILTER,u.NEAREST),u.texParameteri(u.TEXTURE_2D,u.TEXTURE_MAG_FILTER,u.NEAREST),u.texParameteri(u.TEXTURE_2D,u.TEXTURE_WRAP_S,u.CLAMP_TO_EDGE),u.texParameteri(u.TEXTURE_2D,u.TEXTURE_WRAP_T,u.CLAMP_TO_EDGE),u.texImage2D(u.TEXTURE_2D,0,e,4,4,0,t,n,null);let i=u.createFramebuffer();return u.bindFramebuffer(u.FRAMEBUFFER,i),u.framebufferTexture2D(u.FRAMEBUFFER,u.COLOR_ATTACHMENT0,u.TEXTURE_2D,r,0),u.checkFramebufferStatus(u.FRAMEBUFFER)===u.FRAMEBUFFER_COMPLETE}function h(e,t,n){if(!ee(e,t,n)){if(!d)return null;switch(e){case u.R16F:return h(u.RG16F,u.RG,n);case u.RG16F:return h(u.RGBA16F,u.RGBA,n);default:return null}}return{internalFormat:e,format:t}}let g,_,v;if(d?(g=h(u.RGBA16F,u.RGBA,m),_=h(u.RG16F,u.RG,m),v=h(u.R16F,u.RED,m)):(g=h(u.RGBA,u.RGBA,m),_=g,v=g),!g){n.remove();return}function y(e,t,n){let r=t;if(n){let e=``;n.forEach(t=>{e+=`#define ${t}\n`}),r=e+t}let i=u.createShader(e);return u.shaderSource(i,r),u.compileShader(i),i}let te=y(u.VERTEX_SHADER,`
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;
      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `),ne=y(u.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      void main () {
        gl_FragColor = texture2D(uTexture, vUv);
      }
    `),re=y(u.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;
      void main () {
        gl_FragColor = value * texture2D(uTexture, vUv);
      }
    `),ie=y(u.FRAGMENT_SHADER,`
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;
      void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }
    `),ae=y(u.FRAGMENT_SHADER,`
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform vec2 dyeTexelSize;
      uniform float dt;
      uniform float dissipation;
      vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
        vec2 st = uv / tsize - 0.5;
        vec2 iuv = floor(st);
        vec2 fuv = fract(st);
        vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
        vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
        vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
        vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
        return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
      }
      void main () {
        #ifdef MANUAL_FILTERING
          vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
          vec4 result = bilerp(uSource, coord, dyeTexelSize);
        #else
          vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
          vec4 result = texture2D(uSource, coord);
        #endif
        float decay = 1.0 + dissipation * dt;
        gl_FragColor = result / decay;
      }
    `,p?null:[`MANUAL_FILTERING`]),oe=y(u.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;
        vec2 C = texture2D(uVelocity, vUv).xy;
        if (vL.x < 0.0) { L = -C.x; }
        if (vR.x > 1.0) { R = -C.x; }
        if (vT.y > 1.0) { T = -C.y; }
        if (vB.y < 0.0) { B = -C.y; }
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `),se=y(u.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }
    `),ce=y(u.FRAGMENT_SHADER,`
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;
      void main () {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity += force * dt;
        velocity = min(max(velocity, -1000.0), 1000.0);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `),le=y(u.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float divergence = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - divergence) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `),ue=y(u.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `);function de(e,t){let n=u.createProgram();return u.attachShader(n,e),u.attachShader(n,t),u.linkProgram(n),n}function fe(e){let t={},n=u.getProgramParameter(e,u.ACTIVE_UNIFORMS);for(let r=0;r<n;r+=1){let n=u.getActiveUniform(e,r).name;t[n]=u.getUniformLocation(e,n)}return t}function b(e){let t=de(te,e);return{program:t,uniforms:fe(t)}}let pe=b(ne),x=b(re),S=b(ie),C=b(ae),w=b(oe),T=b(se),E=b(ce),D=b(le),O=b(ue),k=b(y(u.FRAGMENT_SHADER,`
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      uniform vec2 texelSize;
      void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;
        #ifdef SHADING
          vec3 lc = texture2D(uTexture, vL).rgb;
          vec3 rc = texture2D(uTexture, vR).rgb;
          vec3 tc = texture2D(uTexture, vT).rgb;
          vec3 bc = texture2D(uTexture, vB).rgb;
          float dx = length(rc) - length(lc);
          float dy = length(tc) - length(bc);
          vec3 n = normalize(vec3(dx, dy, length(texelSize)));
          vec3 l = vec3(0.0, 0.0, 1.0);
          float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
          c *= diffuse;
        #endif
        float a = max(c.r, max(c.g, c.b));
        gl_FragColor = vec4(c, a);
      }
    `,o.SHADING?[`SHADING`]:null)),me=u.createBuffer();u.bindBuffer(u.ARRAY_BUFFER,me),u.bufferData(u.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),u.STATIC_DRAW);let he=u.createBuffer();u.bindBuffer(u.ELEMENT_ARRAY_BUFFER,he),u.bufferData(u.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),u.STATIC_DRAW),u.vertexAttribPointer(0,2,u.FLOAT,!1,0,0),u.enableVertexAttribArray(0);function A(e,t=!1){e==null?(u.viewport(0,0,u.drawingBufferWidth,u.drawingBufferHeight),u.bindFramebuffer(u.FRAMEBUFFER,null)):(u.viewport(0,0,e.width,e.height),u.bindFramebuffer(u.FRAMEBUFFER,e.fbo)),t&&(u.clearColor(0,0,0,1),u.clear(u.COLOR_BUFFER_BIT)),u.drawElements(u.TRIANGLES,6,u.UNSIGNED_SHORT,0)}let j,M,N,P,F;function I(e,t,n,r,i,a){u.activeTexture(u.TEXTURE0);let o=u.createTexture();u.bindTexture(u.TEXTURE_2D,o),u.texParameteri(u.TEXTURE_2D,u.TEXTURE_MIN_FILTER,a),u.texParameteri(u.TEXTURE_2D,u.TEXTURE_MAG_FILTER,a),u.texParameteri(u.TEXTURE_2D,u.TEXTURE_WRAP_S,u.CLAMP_TO_EDGE),u.texParameteri(u.TEXTURE_2D,u.TEXTURE_WRAP_T,u.CLAMP_TO_EDGE),u.texImage2D(u.TEXTURE_2D,0,n,e,t,0,r,i,null);let s=u.createFramebuffer();return u.bindFramebuffer(u.FRAMEBUFFER,s),u.framebufferTexture2D(u.FRAMEBUFFER,u.COLOR_ATTACHMENT0,u.TEXTURE_2D,o,0),u.viewport(0,0,e,t),u.clear(u.COLOR_BUFFER_BIT),{texture:o,fbo:s,width:e,height:t,texelSizeX:1/e,texelSizeY:1/t,attach(e){return u.activeTexture(u.TEXTURE0+e),u.bindTexture(u.TEXTURE_2D,o),e}}}function L(e,t,n,r,i,a){let o=I(e,t,n,r,i,a),s=I(e,t,n,r,i,a);return{width:e,height:t,texelSizeX:o.texelSizeX,texelSizeY:o.texelSizeY,get read(){return o},set read(e){o=e},get write(){return s},set write(e){s=e},swap(){let e=o;o=s,s=e}}}function ge(e,t,n,r,i,a,o){let s=I(t,n,r,i,a,o);return u.useProgram(pe.program),u.uniform1i(pe.uniforms.uTexture,e.attach(0)),A(s),s}function R(e,t,n,r,i,a,o){return e.width===t&&e.height===n?e:(e.read=ge(e.read,t,n,r,i,a,o),e.write=I(t,n,r,i,a,o),e.width=t,e.height=n,e.texelSizeX=1/t,e.texelSizeY=1/n,e)}function z(e){let t=u.drawingBufferWidth/u.drawingBufferHeight;t<1&&(t=1/t);let n=Math.round(e),r=Math.round(e*t);return u.drawingBufferWidth>u.drawingBufferHeight?{width:r,height:n}:{width:n,height:r}}function B(){let e=z(o.SIM_RESOLUTION),t=z(o.DYE_RESOLUTION),n=m,r=g,i=_,a=v,s=p?u.LINEAR:u.NEAREST;u.disable(u.BLEND),j=j?R(j,t.width,t.height,r.internalFormat,r.format,n,s):L(t.width,t.height,r.internalFormat,r.format,n,s),M=M?R(M,e.width,e.height,i.internalFormat,i.format,n,s):L(e.width,e.height,i.internalFormat,i.format,n,s),N=I(e.width,e.height,a.internalFormat,a.format,n,u.NEAREST),P=I(e.width,e.height,a.internalFormat,a.format,n,u.NEAREST),F=L(e.width,e.height,a.internalFormat,a.format,n,u.NEAREST)}let V=s(),H=performance.now(),U=0,W=0,G=!0,K=!1;function _e(){let e=performance.now(),t=(e-H)/1e3;return t=Math.min(t,.016666),H=e,t}function q(){let e=a(n.clientWidth),t=a(n.clientHeight);return n.width!==e||n.height!==t?(n.width=e,n.height=t,!0):!1}function ve(e){U+=e*o.COLOR_UPDATE_SPEED,U>=1&&(U-=Math.floor(U),V.color=l())}function ye(e){let t=n.width/n.height;return t>1?e*t:e}function J(e,t,r,i,a){u.useProgram(S.program),u.uniform1i(S.uniforms.uTarget,M.read.attach(0)),u.uniform1f(S.uniforms.aspectRatio,n.width/n.height),u.uniform2f(S.uniforms.point,e,t),u.uniform3f(S.uniforms.color,r,i,0),u.uniform1f(S.uniforms.radius,ye(o.SPLAT_RADIUS/100)),A(M.write),M.swap(),u.uniform1i(S.uniforms.uTarget,j.read.attach(0)),u.uniform3f(S.uniforms.color,a[0],a[1],a[2]),A(j.write),j.swap()}function be(e){let t=e.deltaX*o.SPLAT_FORCE,n=e.deltaY*o.SPLAT_FORCE;J(e.texcoordX,e.texcoordY,t,n,e.color)}function xe(e){let t=l();t[0]*=10,t[1]*=10,t[2]*=10;let n=10*(Math.random()-.5),r=30*(Math.random()-.5);J(e.texcoordX,e.texcoordY,n,r,t)}function Se(e){u.disable(u.BLEND),u.useProgram(T.program),u.uniform2f(T.uniforms.texelSize,M.texelSizeX,M.texelSizeY),u.uniform1i(T.uniforms.uVelocity,M.read.attach(0)),A(P),u.useProgram(E.program),u.uniform2f(E.uniforms.texelSize,M.texelSizeX,M.texelSizeY),u.uniform1i(E.uniforms.uVelocity,M.read.attach(0)),u.uniform1i(E.uniforms.uCurl,P.attach(1)),u.uniform1f(E.uniforms.curl,o.CURL),u.uniform1f(E.uniforms.dt,e),A(M.write),M.swap(),u.useProgram(w.program),u.uniform2f(w.uniforms.texelSize,M.texelSizeX,M.texelSizeY),u.uniform1i(w.uniforms.uVelocity,M.read.attach(0)),A(N),u.useProgram(x.program),u.uniform1i(x.uniforms.uTexture,F.read.attach(0)),u.uniform1f(x.uniforms.value,o.PRESSURE),A(F.write),F.swap(),u.useProgram(D.program),u.uniform2f(D.uniforms.texelSize,M.texelSizeX,M.texelSizeY),u.uniform1i(D.uniforms.uDivergence,N.attach(0));for(let e=0;e<o.PRESSURE_ITERATIONS;e+=1)u.uniform1i(D.uniforms.uPressure,F.read.attach(1)),A(F.write),F.swap();u.useProgram(O.program),u.uniform2f(O.uniforms.texelSize,M.texelSizeX,M.texelSizeY),u.uniform1i(O.uniforms.uPressure,F.read.attach(0)),u.uniform1i(O.uniforms.uVelocity,M.read.attach(1)),A(M.write),M.swap(),u.useProgram(C.program),u.uniform2f(C.uniforms.texelSize,M.texelSizeX,M.texelSizeY),p||u.uniform2f(C.uniforms.dyeTexelSize,M.texelSizeX,M.texelSizeY);let t=M.read.attach(0);u.uniform1i(C.uniforms.uVelocity,t),u.uniform1i(C.uniforms.uSource,t),u.uniform1f(C.uniforms.dt,e),u.uniform1f(C.uniforms.dissipation,o.VELOCITY_DISSIPATION),A(M.write),M.swap(),p||u.uniform2f(C.uniforms.dyeTexelSize,j.texelSizeX,j.texelSizeY),u.uniform1i(C.uniforms.uVelocity,M.read.attach(0)),u.uniform1i(C.uniforms.uSource,j.read.attach(1)),u.uniform1f(C.uniforms.dissipation,o.DENSITY_DISSIPATION),A(j.write),j.swap()}function Ce(){u.blendFunc(u.ONE,u.ONE_MINUS_SRC_ALPHA),u.enable(u.BLEND),u.useProgram(k.program),o.SHADING&&u.uniform2f(k.uniforms.texelSize,1/u.drawingBufferWidth,1/u.drawingBufferHeight),u.uniform1i(k.uniforms.uTexture,j.read.attach(0)),A(null)}function Y(){if(K||!G)return;let e=_e();q()&&B(),ve(e),V.moved&&(V.moved=!1,be(V)),Se(e),Ce(),W=requestAnimationFrame(Y)}let X=!1;function Z(e,t,n){return t>=e.left&&t<=e.right&&n>=e.top&&n<=e.bottom}function Q(e){let t=n.getBoundingClientRect();if(!Z(t,e.clientX,e.clientY)){X=!1;return}let r=a(e.clientX-t.left),i=a(e.clientY-t.top);if(!X){X=!0,V.texcoordX=r/n.width,V.texcoordY=1-i/n.height,V.prevTexcoordX=V.texcoordX,V.prevTexcoordY=V.texcoordY,V.deltaX=0,V.deltaY=0,V.color=l();return}V.prevTexcoordX=V.texcoordX,V.prevTexcoordY=V.texcoordY,V.texcoordX=r/n.width,V.texcoordY=1-i/n.height;let o=n.width/n.height;V.deltaX=(V.texcoordX-V.prevTexcoordX)*(o<1?o:1),V.deltaY=(V.texcoordY-V.prevTexcoordY)*(o>1?1/o:1),V.moved=Math.abs(V.deltaX)>0||Math.abs(V.deltaY)>0}function we(e){let t=n.getBoundingClientRect();if(!Z(t,e.clientX,e.clientY))return;let r=a(e.clientX-t.left),i=a(e.clientY-t.top);V.texcoordX=r/n.width,V.texcoordY=1-i/n.height,xe(V)}window.addEventListener(`pointermove`,Q,{passive:!0}),window.addEventListener(`pointerdown`,we,{passive:!0});function Te(e){K||G===e||(G=e,G?(H=performance.now(),W=requestAnimationFrame(Y)):cancelAnimationFrame(W))}let Ee=new IntersectionObserver(e=>Te(e.some(e=>e.isIntersecting)),{threshold:0});Ee.observe(n);function $(){Te(!document.hidden)}return document.addEventListener(`visibilitychange`,$),q(),B(),W=requestAnimationFrame(Y),()=>{K=!0,cancelAnimationFrame(W),Ee.disconnect(),document.removeEventListener(`visibilitychange`,$),window.removeEventListener(`pointermove`,Q),window.removeEventListener(`pointerdown`,we);let e=u.getExtension(`WEBGL_lose_context`);e&&e.loseContext(),n.remove()}},[]),(0,a.jsx)(`div`,{ref:e,className:r.canvas})}export{u as default};
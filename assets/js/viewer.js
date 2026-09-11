import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

// Embedded GLB materials are shared with the paper-style Blender thumbnails.
const draco = new DRACOLoader().setDecoderPath('assets/vendor/three/addons/libs/draco/gltf/').setWorkerLimit(2);
const loader = new GLTFLoader().setDRACOLoader(draco);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

function dispose(group) {
  group.traverse(o => {
    if (!o.isMesh) return;
    o.geometry.dispose();
    const materials = new Set([...(Array.isArray(o.material) ? o.material : [o.material]), o.userData.baseMaterial]);
    materials.forEach(m => { if (m) m.dispose(); });
  });
  group.clear();
}

class PartViewer {
  constructor(el) {
    this.el=el; this.canvas=el.querySelector('canvas'); this.parts=[]; this.loadId=0;
    this.visible=true; this.explode=0; this.selected=null; this.hovered=null;
    this.count=el.querySelector('.hud-count'); this.overlay=el.querySelector('.ws-loader');
    this.tip=el.querySelector('.ws-tooltip'); this.slider=el.querySelector('.explode');
    this.method=el.dataset.scenes==='methodScenes';
    this.renderer=new THREE.WebGLRenderer({canvas:this.canvas,alpha:true,antialias:true,preserveDrawingBuffer:true});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
    this.renderer.setClearColor(0x000000,0);
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;
    this.renderer.toneMapping=THREE.NoToneMapping;this.renderer.toneMappingExposure=1;
    this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.VSMShadowMap;
    this.renderer.shadowMap.autoUpdate=false;
    this.scene=new THREE.Scene();this.root=new THREE.Group();this.scene.add(this.root);
    this.camera=new THREE.PerspectiveCamera(36,1,.01,100);
    this.controls=new OrbitControls(this.camera,this.canvas);
    this.controls.enableDamping=true;this.controls.autoRotate=!reducedMotion;this.controls.autoRotateSpeed=.55;
    this.controls.maxPolarAngle=Math.PI*.49;this.controls.minDistance=.35;this.controls.maxDistance=8;
    // Calibrated against the paper-style Blender previews: soft fill and a warm key,
    // with Standard/sRGB output instead of a second cinematic tone curve.
    this.scene.add(new THREE.HemisphereLight(0xffffff,0xffffff,1.3));
    this.key=new THREE.DirectionalLight(0xfff4df,3.2);this.key.position.set(-3,5,4);
    this.key.castShadow=true;this.key.shadow.mapSize.set(1024,1024);
    Object.assign(this.key.shadow.camera,{left:-1.4,right:1.4,top:1.4,bottom:-1.4,near:.1,far:15});
    this.key.shadow.bias=-.00015;this.key.shadow.normalBias=.007;this.key.shadow.radius=5;this.key.shadow.blurSamples=12;this.scene.add(this.key);
    const fill=new THREE.DirectionalLight(0xffffff,.8);fill.position.set(3,2,-4);this.scene.add(fill);
    const warm=new THREE.DirectionalLight(0xffffff,.25);warm.position.set(2,.7,3);this.scene.add(warm);
    this.floor=new THREE.Mesh(new THREE.PlaneGeometry(20,20),new THREE.ShadowMaterial({color:0x51463b,opacity:.13}));
    this.floor.rotation.x=-Math.PI/2;this.floor.receiveShadow=true;this.scene.add(this.floor);
    this.ray=new THREE.Raycaster();this.pointer=new THREE.Vector2();
    this.buildTabs();this.bind();this.resize();
    this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(this.canvas);
    this.visibilityObserver=new IntersectionObserver(es=>{this.visible=es[0].isIntersecting;},{rootMargin:'100px'});this.visibilityObserver.observe(el);
    this.renderer.setAnimationLoop(()=>{
      if(!this.visible||document.hidden)return;
      this.controls.update();this.renderer.render(this.scene,this.camera);
    });
    this.load(this.configs[0]);
  }
  buildTabs() {
    this.configs=window.WS_CONFIG[this.el.dataset.scenes];
    const holder=this.el.querySelector('.scene-tabs');holder.setAttribute('role','group');holder.setAttribute('aria-label',this.method?'Volume views':'Choose a generated asset');
    for(const cfg of this.configs) {
      const b=document.createElement('button');b.className='scene-tab';b.type='button';b.dataset.asset=cfg.id;
      b.setAttribute('aria-pressed','false');
      if(!this.method){
        const img=document.createElement('img');img.src=cfg.preview||cfg.input;img.alt='';img.loading='lazy';img.width=240;img.height=160;b.append(img);
        const text=document.createElement('span');text.textContent=cfg.label;b.append(text);
        const sub=document.createElement('small');sub.textContent=cfg.category;b.append(sub);
      } else b.textContent=cfg.label;
      b.addEventListener('click',()=>{this.load(cfg);this.el.querySelector('.viewer-shell').scrollIntoView({block:'start',behavior:reducedMotion?'instant':'smooth'});});holder.append(b);
    }
  }
  bind() {
    this.slider.setAttribute('aria-label','Separate parts');
    this.slider.addEventListener('input',()=>{this.explode=Number(this.slider.value)/100;this.applyExplode();});
    const rotate=this.el.querySelector('.btn-rotate');rotate.classList.toggle('on',this.controls.autoRotate);rotate.setAttribute('aria-pressed',String(this.controls.autoRotate));
    rotate.addEventListener('click',()=>{this.controls.autoRotate=!this.controls.autoRotate;rotate.classList.toggle('on',this.controls.autoRotate);rotate.setAttribute('aria-pressed',String(this.controls.autoRotate));});
    this.el.querySelector('.btn-reset').addEventListener('click',()=>{this.isolate(null);this.explode=0;this.slider.value=0;this.applyExplode();this.frame();});
    let down=null;
    this.canvas.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY];});
    this.canvas.addEventListener('pointermove',e=>{
      if(e.buttons)return;
      const hit=this.pick(e);this.highlight(hit);
      if(hit){const r=this.canvas.getBoundingClientRect();this.tip.style.left=Math.min(e.clientX-r.left,r.width-150)+'px';this.tip.style.top=(e.clientY-r.top)+'px';this.tip.textContent=hit.name;this.tip.style.display='block';}
      else this.tip.style.display='none';
    });
    this.canvas.addEventListener('pointerleave',()=>{this.highlight(null);this.tip.style.display='none';});
    this.canvas.addEventListener('pointerup',e=>{if(down&&Math.hypot(e.clientX-down[0],e.clientY-down[1])<6){const hit=this.pick(e);this.isolate(hit===this.selected?null:hit);}down=null;});
    this.canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();this.showLoading('3D view interrupted. Reload the page to continue.');});
  }
  pick(e) {
    const r=this.canvas.getBoundingClientRect();this.pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);
    this.ray.setFromCamera(this.pointer,this.camera);
    return this.ray.intersectObjects(this.parts.filter(p=>p.visible),false)[0]?.object||null;
  }
  highlight(part) {
    if(this.hovered)this.hovered.material.emissive.setHex(0);
    this.hovered=part;if(part){part.material.emissive.copy(part.material.color).multiplyScalar(.16);}
    this.canvas.style.cursor=part?'pointer':'grab';
  }
  isolate(part) {
    this.selected=part;
    for(const p of this.parts)p.visible=!part||part===p;
    this.count.textContent=part?part.name+' · click again to restore':this.countText();
    this.renderer.shadowMap.needsUpdate=true;
  }
  countText(){return this.parts.length+' '+(this.method&&this.cfg.mode!=='parts'?'volume components':'parts');}
  showLoading(label) {
    this.overlay.classList.add('show');this.overlay.querySelector('.ws-loader-label').textContent=label;
    this.overlay.querySelector('.ws-loader-fill').style.width='0%';
  }
  async load(cfg) {
    const id=++this.loadId;this.cfg=cfg;this.el.dataset.ready='false';
    this.el.querySelectorAll('.scene-tab').forEach(b=>{const active=b.dataset.asset===cfg.id;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
    this.highlight(null);this.selected=null;this.explode=0;this.slider.value=0;
    dispose(this.root);this.parts=[];this.count.textContent='Loading '+cfg.label;
    this.showLoading('Preparing '+cfg.label+'…');
    const title=this.el.querySelector('.asset-title');if(title)title.textContent=cfg.label;
    const inp=this.el.querySelector('.input-reference');
    if(inp){inp.hidden=!cfg.input;if(cfg.input){inp.querySelector('img').src=cfg.input;inp.querySelector('img').alt=cfg.label+' — input image';}}
    try {
      const gltf=await loader.loadAsync(cfg.glb,e=>{
        if(id!==this.loadId)return;
        if(e.total){this.overlay.querySelector('.ws-loader-fill').style.width=(100*e.loaded/e.total)+'%';}
      });
      if(id!==this.loadId){dispose(gltf.scene);return;}
      gltf.scene.traverse(o=>{if(o.isMesh)this.parts.push(o);});
      this.parts.forEach((o,i)=>{
        const old=o.material;
        // GLTFLoader already reads baseColorFactor as linear RGB. Never reinterpret
        // it as an sRGB hex color or replace it according to mesh traversal order.
        const color=old.color.clone();
        o.name=o.name.replaceAll('_',' ');
        o.material=new THREE.MeshStandardMaterial({color,roughness:.9,metalness:0,side:THREE.DoubleSide});
        if(old)old.dispose();
        if(!o.geometry.attributes.normal)o.geometry.computeVertexNormals();
        o.castShadow=true;o.receiveShadow=false;
        o.userData.baseMaterial=o.material;
      });
      this.root.add(gltf.scene);this.root.updateMatrixWorld(true);
      const box=new THREE.Box3().setFromObject(this.root);if(this.method){if(!this.methodBounds)this.methodBounds=box.clone();box.copy(this.methodBounds);}this.center=box.getCenter(new THREE.Vector3());this.size=box.getSize(new THREE.Vector3());this.radius=this.size.length()/2;
      this.floor.position.y=box.min.y-.005;this.floor.visible=true;
      this.parts.forEach((o,i)=>{
        o.userData.home=o.position.clone();const c=new THREE.Box3().setFromObject(o).getCenter(new THREE.Vector3());
        let direction=c.sub(this.center);if(direction.lengthSq()<1e-8)direction.set(Math.cos(i*2.4),.7,Math.sin(i*2.4));
        o.userData.direction=direction.normalize();
      });
      this.count.textContent=this.countText();this.frame();this.renderer.shadowMap.needsUpdate=true;
      this.overlay.classList.remove('show');this.el.dataset.ready='true';this.el.dataset.asset=cfg.id;
      this.el.querySelector('.hud-ph')?.setAttribute('style','display:none');
    } catch(error) {
      if(id!==this.loadId)return;
      this.count.textContent='Asset unavailable';this.showLoading('Could not load this asset. Choose another or tap its tile to retry.');
      console.error('Asset load failed:',cfg.id,error);
    }
  }
  frame() {
    if(!this.center)return;
    const vfov=THREE.MathUtils.degToRad(this.camera.fov);
    const fit=Math.max(this.size.y,this.size.x/this.camera.aspect,this.size.z/this.camera.aspect);
    const distance=this.radius / Math.sin(Math.min(vfov,2*Math.atan(Math.tan(vfov/2)*this.camera.aspect))/2)*1.14;
    const yaw=THREE.MathUtils.degToRad(this.cfg.yaw??42),el=THREE.MathUtils.degToRad(24);
    this.camera.position.copy(this.center).add(new THREE.Vector3(Math.sin(yaw)*Math.cos(el),Math.sin(el),Math.cos(yaw)*Math.cos(el)).multiplyScalar(distance));
    this.controls.target.copy(this.center);this.camera.near=.005;this.camera.far=100;this.camera.updateProjectionMatrix();this.controls.update();
  }
  applyExplode() {
    for(const o of this.parts)o.position.copy(o.userData.home).addScaledVector(o.userData.direction,this.explode*this.radius*.9);
    this.root.updateMatrixWorld(true);this.renderer.shadowMap.needsUpdate=true;
  }
  resize() {
    const w=this.canvas.clientWidth,h=this.canvas.clientHeight;if(!w||!h)return;
    this.renderer.setSize(w,h,false);this.camera.aspect=w/h;this.camera.updateProjectionMatrix();if(this.center)this.frame();
  }
}

for(const el of document.querySelectorAll('.ws-viewer')) {
  const observer=new IntersectionObserver(entries=>{
    if(!entries.some(e=>e.isIntersecting))return;observer.disconnect();
    try{el.partViewer=new PartViewer(el);}catch(e){const label=el.querySelector('.ws-loader-label');label.textContent='3D needs WebGL. Watch the showcase video below.';el.querySelector('.ws-loader').classList.add('show');console.error(e);}
  },{rootMargin:'300px'});observer.observe(el);
}

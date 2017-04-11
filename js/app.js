"use strict";var _createClass=function(){function a(b,d){for(var g,f=0;f<d.length;f++)g=d[f],g.enumerable=g.enumerable||!1,g.configurable=!0,"value"in g&&(g.writable=!0),Object.defineProperty(b,g.key,g)}return function(b,d,f){return d&&a(b.prototype,d),f&&a(b,f),b}}();function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(a,b){if(!a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return b&&("object"==typeof b||"function"==typeof b)?b:a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function, not "+typeof b);a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),b&&(Object.setPrototypeOf?Object.setPrototypeOf(a,b):a.__proto__=b)}var baseTime=1,globalTimeScalar=1,timeDelta=0,globalParticleCount,Beam=function(a){function b(d){var g=1<arguments.length&&void 0!==arguments[1]?arguments[1]:null;_classCallCheck(this,b);var f=_possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).call(this));return f.phase=0,f.timeRate=1,f.time=0,f.density=100,f.width=window.innerWidth,f.height=100,f.scatter=50,f.particleOpacity=.6,f.particleScale=0.1,f.trackingPoint=new Vector3,f.rotateSpeed=1,f.parallax=0.1,f.seed=3*Math.random(),Object.assign(f,d),f.points=[],f.zero=new Vector3,null!=g&&g instanceof createjs.Sprite&&(f.sprite=g.clone(),f.createPoints(g)),f}return _inherits(b,a),_createClass(b,null,[{key:"globalTimeScalar",get:function get(){return globalTimeScalar},set:function set(d){globalTimeScalar=d}},{key:"timeDelta",get:function get(){return globalParticleCount},set:function set(d){globalParticleCount=d}}]),_createClass(b,[{key:"setGraphic",value:function setGraphic(d){this.sprite=d.clone(),this.createPoints(d)}},{key:"createPoints",value:function createPoints(){for(var f=this.density,g=0;g<this.density;g++){var h=this.particleScale*Math.random(),j={};j.location=new Vector3,j.scatter=new Vector3(Math.random()*this.scatter,Math.random()*this.period(f)*this.scatter),j.scatter.rotate(360*Math.random()),j.rotateDirection=(1-Math.random())*this.rotateSpeed,j.scale=h,j.graphic=this.sprite.clone(),j.graphic.alpha=Math.random()*this.particleOpacity,j.graphic.scaleX=h,j.graphic.scaleY=h,this.addChild(j.graphic),this.points.push(j)}}},{key:"updatePoints",value:function updatePoints(){for(var d=this.width/this.points.length,f=0;f<this.points.length;f++){var g=this.points[f],h=this.trackingPoint.y,j=(this.trackingPoint.x+this.width+d*f+this.time+this.phase)%this.width-100;g.location.x=j,g.location.y=this.wave(this.time,d*f,this.width,h,this.height)+this.wave(this.time*this.seed,d*f,this.width/2,0,this.height/4),g.graphic.alpha=this.particleOpacity+this.wave(this.time*this.seed,d*f,this.width/2,0,this.particleOpacity),g.graphic.scaleX=g.graphic.scaleY=g.scale*(0.75+this.wave(this.time*this.seed,d*f,this.width/2,0,.25)),g.graphic.x=g.location.x+g.scatter.x,g.graphic.y=g.location.y+g.scatter.y}}},{key:"wave",value:function wave(d,f,g,h,j){return j*=0.5,h+Math.cos((f+d)*this.period(g)%360)*j}},{key:"period",value:function period(d){return 2*Math.PI/d}},{key:"update",value:function(){this.time+=this.timeRate*b.globalTimeScalar,this.updatePoints()}}]),b}(createjs.Container),Vector3=Vexr.Vector3,queue=new createjs.LoadQueue;queue.on("complete",init),queue.on("progress",progress),queue.loadManifest([{src:"./assets/gfx.png",id:"gfx"},{src:"./assets/bg.jpg",id:"bg"}]),document.getElementById("demoCanvas").setAttribute("width",window.innerWidth),document.getElementById("demoCanvas").setAttribute("height",window.innerHeight);var stage=new createjs.StageGL("demoCanvas",{antialias:!0});stage.setClearColor("#000000");var canvasWidth=window.innerWidth,canvasHeight=window.innerHeight;stage.canvas.width=canvasWidth,stage.canvas.height=canvasHeight;var ratio=canvasWidth/canvasHeight,center=new Vector3(canvasWidth/2,canvasHeight/2),mouse=new Vector3(window.innerWidth/2,window.innerHeight/2,0),addBeams=!1,beamWidth=1.2*canvasWidth,branding=!0,logo,tagline,createjslogo,intro,spriteSheet,bg=null;stage.update();function progress(a){LabTemplate.loadProgress(a)}var beamInstances=[];function init(){createBackground(queue.getResult("bg")),spriteSheet=new createjs.SpriteSheet({images:["./assets/gfx.png"],frames:[[0,0,230,275,0,115,137],[0,275,330,40,0,165,20],[0,322,145,42,0,145,41],[0,465,512,47,0,256,24],[384,0,128,128,0,64,64]],animations:{logo:0,intro:1,createjs:2,tagline:3,dot:4}}),window.addEventListener("mousemove",updateMouse),window.addEventListener("touchmove",updateTouch),window.addEventListener("mousedown",function(){return mouse.buttonState=!0}),window.addEventListener("mouseup",function(){return mouse.buttonState=!1}),addBeams,createjs.Ticker.timingMode=createjs.Ticker.RAF,createjs.Ticker.addEventListener("tick",update),document.getElementById("demoCanvas").style.display="block",createBeams(),createBranding(),stage.on("resize",resize),LabTemplate.setupStageResize(stage),LabTemplate.loadComplete(),resize()}function createBranding(){logo=new createjs.Sprite(spriteSheet,"logo"),createjslogo=new createjs.Sprite(spriteSheet,"createjs"),tagline=new createjs.Sprite(spriteSheet,"tagline"),intro=new createjs.Sprite(spriteSheet,"intro"),stage.addChildAt(logo,stage.numChildren-1),stage.addChildAt(createjslogo,stage.numChildren-1),stage.addChildAt(tagline,stage.numChildren-1),stage.addChildAt(intro,stage.numChildren-1)}function dynamicSize(a,b,d){var f=a.getBounds();return 1>ratio?canvasWidth/f.width*b:canvasHeight/f.height*d}var logoPos=new Vector3(0.5,0.35);function positionLogo(){logo.positionOffset=new Vector3(0,0),logo.x=logoPos.x*canvasWidth+logo.positionOffset.x,logo.y=logoPos.y*canvasHeight+logo.positionOffset.y;var a=dynamicSize(logo,0.4,0.5);logo.scaleX=a,logo.scaleY=a}var taglinePos=new Vector3(0.5,0.7);function positionTagline(){tagline.x=taglinePos.x*canvasWidth,tagline.y=taglinePos.y*canvasHeight;var a=dynamicSize(tagline,0.8,0.08);tagline.scaleX=a,tagline.scaleY=a}function positionCJSLogo(){createjslogo.x=canvasWidth,createjslogo.y=canvasHeight;var a=dynamicSize(createjslogo,0.2,0.1);createjslogo.scaleX=a,createjslogo.scaleY=a}var introPos=new Vector3(0.5,0.9);function positionIntro(){intro.x=introPos.x*canvasWidth,intro.y=introPos.y*canvasHeight;var a=dynamicSize(intro,0.5,0.07);intro.scaleX=a,intro.scaleY=a}var beamgroups=[],BeamGroup=function(){function a(b,d,f,g,h,j,k,l){_classCallCheck(this,a);var m=b/6;beamgroups.push(this),this.beamCollection=[],this.seed=3*Math.random(),this.speed=1+Math.random(),this.beams=[{density:Math.round(3*m),timeRate:this.speed,width:f,height:g,particleScale:d/10,particleOpacity:d,parallax:j,phase:h,seed:this.seed,rotateSpeed:this.seed},{density:Math.round(2*m),timeRate:this.speed,width:f,height:g,scatter:100,particleScale:d/5,particleOpacity:d/5,parallax:j,phase:h,seed:this.seed,rotateSpeed:this.seed},{time:30,density:Math.round(m),timeRate:this.speed,scatter:25,width:f,height:g,particleOpacity:d/10,particleScale:d-.2,parallax:j,phase:h,seed:this.seed,rotateSpeed:this.seed}];for(var o,n=0;n<this.beams.length;n++)o=new Beam(this.beams[n],k),this.beamCollection.push(o),l.push(o),stage.addChild(o)}return _createClass(a,null,[{key:"beams",get:function get(){return beamgroups}}]),a}();function createBeams(){var a=new createjs.Sprite(spriteSheet,"dot");new BeamGroup(2e3,0.7,beamWidth,canvasHeight/3,0,0.3,a,beamInstances),new BeamGroup(2e3,0.8,beamWidth,canvasHeight/2.5,canvasWidth/2,0.2,a,beamInstances),new BeamGroup(200,0.65,beamWidth,canvasHeight/4,canvasWidth,0.1,a,beamInstances);for(var f,b=[{density:250,scatter:600,width:beamWidth,height:canvasHeight/2,particleOpacity:.08,particleScale:1.5,timeRate:.4,rotateSpeed:0.3,parallax:0.1,phase:canvasWidth/2,y:-canvasHeight/5},{density:250,scatter:450,width:beamWidth,height:canvasHeight/1.5,particleOpacity:.05,particleScale:2.5,timeRate:0.5,rotateSpeed:0.2,parallax:.05,phase:canvasWidth/4,y:2*(canvasHeight/5)}],d=0;d<b.length;d++)f=new Beam(b[d],a),beamInstances.push(f),stage.addChild(f)}function resize(){canvasWidth=window.innerWidth,canvasHeight=window.innerHeight,stage.canvas.width=canvasWidth,stage.canvas.height=canvasHeight,stage.updateViewport(canvasWidth,canvasHeight),ratio=canvasWidth/canvasHeight,baseTime=ratio,center.set(canvasWidth/2,canvasHeight/2),positionLogo(),positionCJSLogo(),positionIntro(),positionTagline(),1200>canvasWidth&&(canvasWidth=1200),beamWidth=1.2*canvasWidth;for(var a=0;a<beamInstances.length;a++)beamInstances[a].width=beamWidth;bg.scaleX=canvasWidth/1024,bg.scaleY=canvasHeight/1024,Beam.globalTimeScalar=canvasWidth/canvasHeight,stage.update()}function createBackground(a){bg=new createjs.Bitmap(a),bg.scaleX=canvasWidth/1024,bg.scaleY=canvasHeight/1024,stage.addChildAt(bg,0)}function updateMouse(a){mouse.x=a.pageX-center.x,mouse.y=a.pageY-center.y}function updateTouch(a){mouse.x=a.touches[0].pageX-center.x,mouse.y=a.touches[0].pageY-center.y}function draw(){stage.update()}var t=0;function update(){var a=performance.now(),b=Vector3.multiply(mouse,0.5),d=Vector3.add(b,center,b);t+=1e-3,Beam.globalTimeScalar=baseTime+Math.cos(t);for(var g,f=0;f<beamInstances.length;f++)g=beamInstances[f],g.trackingPoint=Vector3.add(Vector3.multiply(mouse,g.parallax),center,d),g.update();draw(),Beam.timeDelta=performance.now()-a}function newBeam(){if(11>Beam.timeDelta){var a=new createjs.Sprite(spriteSheet,"dot");new BeamGroup(500,0.6+Math.random(),beamWidth,canvasHeight/2*Math.random(),Math.random()*canvasWidth,0.5*Math.random(),a,beamInstances)}}
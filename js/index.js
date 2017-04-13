"use strict";

/**
 * Globals and Imports
 */
const Vector3 = Vexr.Vector3;

var queue = new createjs.LoadQueue();
queue.on("complete", init);
queue.on("progress", progress);
queue.loadManifest([
	{src: "./assets/gfx.png", id: "gfx"},
	{src: "./assets/bg.jpg", id: "bg"}
]);

document.getElementById("demoCanvas").setAttribute("width", window.innerWidth);
document.getElementById("demoCanvas").setAttribute("height", window.innerHeight);

var stage = new createjs.StageGL("demoCanvas", {antialias: true});
stage.setClearColor("#1C9ECF");
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;
stage.canvas.width = canvasWidth;
stage.canvas.height = canvasHeight;

var ratio = canvasWidth / canvasHeight;
var center = new Vector3(canvasWidth / 2, canvasHeight / 2);
var mouse = new Vector3(window.innerWidth / 2, window.innerHeight / 2, 0);

var addBeams = false;

var beamWidth = canvasWidth * 1.2;

var branding = true;
var logo, tagline, createjslogo, intro;

var spriteSheet;
var bg = null;

stage.update();

/**
 * Beam Classes
 *
 */

var baseTime = 1;
var globalTimeScalar = 1.5;
var timeDelta = 0;
var globalParticleCount;
class Beam extends createjs.Container {

	static get globalTimeScalar() {
		return globalTimeScalar;
	}

	static set globalTimeScalar(value) {
		globalTimeScalar = value;
	}

	static get timeDelta() {
		return timeDelta;
	}

	static set timeDelta(value) {
		timeDelta = value;
	}

	static get timeDelta() {
		return globalParticleCount;
	}

	static set timeDelta(value) {
		globalParticleCount = value;
	}

	constructor(params, sprite = null) {
		super();
		this.phase = 0;
		this.timeRate = 1;
		this.time = 0;
		this.density = 100;
		this.width = window.innerWidth;
		this.height = 100;
		this.scatter = 50;
		this.particleOpacity = .6;
		this.particleScale = 0.1;
		this.trackingPoint = new Vector3();
		this.rotateSpeed = 1;
		this.parallax = 0.1;
		this.seed = Math.random() * 3;
		Object.assign(this, params);

		this.points = [];
		this.zero = new Vector3();
		if (sprite != null && sprite instanceof createjs.Sprite) {
			this.sprite = sprite.clone();
			this.createPoints();
		}
	}

	setGraphic(sprite) {
		this.sprite = sprite.clone();
		this.createPoints(sprite);
	}

	createPoints() {
		let amountOfDots = this.density;
		for (let i = 0; i < this.density; i++) {
			let scale = this.particleScale * Math.random();
			let c = {};
			c.location = new Vector3();
			c.scatter = new Vector3(Math.random() * this.scatter, Math.random() * this.period(amountOfDots) * this.scatter);
			c.scatter.rotate(Math.random() * 360);
			c.rotateDirection = ((Math.random() - 1) * 2) * this.rotateSpeed;
			c.scale = scale;
			c.graphic = this.sprite.clone();
			c.graphic.getBounds();
			c.graphic.regX = c.graphic.getBounds().width / 2 + (c.scatter.x * 1 / this.particleScale);
			c.graphic.regY = c.graphic.getBounds().height / 2 + (c.scatter.y * 1 / this.particleScale);
			c.graphic.alpha = Math.random() * this.particleOpacity;
			c.graphic.scaleX = scale;
			c.graphic.scaleY = scale;
			this.addChild(c.graphic);
			this.points.push(c);
		}
	}

	updatePoints() {
		let slice = this.width / this.points.length;
		for (let i = 0; i < this.points.length; i++) {

			let c = this.points[i];
			let locY = this.trackingPoint.y;
			let locX = (((this.trackingPoint.x + this.width) + (slice * i) + this.time + this.phase) % this.width) - 100;

			c.location.x = locX;
			c.location.y =
				this.wave(this.time, slice * i, this.width, locY, this.height) +
				this.wave(this.time * this.seed, slice * i, this.width / 2, 0, this.height / 4);
			c.graphic.alpha = this.particleOpacity + this.wave(this.time * this.seed, slice * i, this.width / 2, 0, this.particleOpacity);
			c.graphic.scaleX = c.graphic.scaleY = c.scale * (0.75 + this.wave(this.time * this.seed, slice * i, this.width / 2, 0, .25));
			c.graphic.rotation += c.rotateDirection;

			c.graphic.x = c.location.x;
			c.graphic.y = c.location.y;
		}
	}

	wave(time, phase, length, bias, amplitude) {
		amplitude *= 0.5;
		return bias + Math.cos((phase + time) * this.period(length) % 360) * amplitude;
	}

	period(length) {
		return 2 * Math.PI / length;
	}

	update() {
		this.time += (this.timeRate * Beam.globalTimeScalar);
		this.updatePoints();
	}
}

/**
 *
 * Creates a bunch of beams that all follow the same wave
 */

var beamgroups = [];
class BeamGroup {

	static get beams() {
		return beamgroups;
	}

	constructor(density, scale, width, height, phase, parallax, sprite, collection) {
		var dist = density / 6;
		beamgroups.push(this);
		this.beamCollection = [];
		this.seed = Math.random() * 1.5;
		this.speed = 1 + Math.random();
		this.beams = [
			{
				density: Math.round(dist * 3),
				timeRate: this.speed,
				width: width,
				height: height,
				particleScale: scale / 10,
				particleOpacity: scale,
				parallax: parallax,
				phase: phase,
				seed: this.seed,
				rotateSpeed: this.seed
			},
			{
				density: Math.round(dist * 2),
				timeRate: this.speed*.8,
				width: width,
				height: height,
				scatter: 100,
				particleScale: scale / 5,
				particleOpacity: scale / 5,
				parallax: parallax,
				phase: phase,
				seed: this.seed,
				rotateSpeed: this.seed
			},
			{
				time: 30,
				density: Math.round(dist),
				timeRate: this.speed*.5,
				scatter: 25,
				width: width,
				height: height,
				particleOpacity: scale / 10,
				particleScale: scale - .2,
				parallax: parallax,
				phase: phase,
				seed: this.seed,
				rotateSpeed: this.seed
			}
		];
		for (let i = 0; i < this.beams.length; i++) {
			let beam = new Beam(this.beams[i], sprite);
			this.beamCollection.push(beam);
			collection.push(beam);
			stage.addChild(beam);
		}
	}
}

/**
 * Functions
 */
function progress(e) {
	LabTemplate.loadProgress(e);
}

function init() {

	var data = {
		images: ["./assets/gfx.png"],
		frames: [
			// x, y, width, height, imageIndex*, regX*, regY*
			[0, 0, 230, 275, 0, 115, 137],
			[0, 275, 330, 40, 0, 165, 20],
			[0, 322, 145, 42, 0, 145, 41],
			[0, 465, 512, 47, 0, 256, 24],
			[384, 0, 128, 128, 0, 64, 64]
		],
		animations: {
			logo: 0,
			intro: 1,
			createjs: 2,
			tagline: 3,
			dot: 4
		}
	};

	createBackground(queue.getResult("bg"));

	spriteSheet = new createjs.SpriteSheet(data);

	window.addEventListener("mousemove", updateMouse);
	window.addEventListener("touchmove", updateTouch);
	window.addEventListener("mousedown", function () {
		return mouse.buttonState = true;
	});
	window.addEventListener("mouseup", function () {
		return mouse.buttonState = false;
	});

	if (addBeams) {
		addEventListener("click", newBeam);
	}

	createjs.Ticker.timingMode = createjs.Ticker.RAF;
	createjs.Ticker.addEventListener("tick", update);

	document.getElementById("demoCanvas").style.display = "block";

	createBeams();

	createBranding();


	stage.on("resize", resize);
	LabTemplate.setupStageResize(stage);
	LabTemplate.loadComplete();

	resize();


}

function createBranding() {
	if (branding) {
		logo = new createjs.Sprite(spriteSheet, "logo");
		createjslogo = new createjs.Sprite(spriteSheet, "createjs");
		tagline = new createjs.Sprite(spriteSheet, "tagline");
		intro = new createjs.Sprite(spriteSheet, "intro");

		stage.addChildAt(logo, stage.numChildren - 1);
		stage.addChildAt(createjslogo, stage.numChildren - 1);
		stage.addChildAt(tagline, stage.numChildren - 1);
		stage.addChildAt(intro, stage.numChildren - 1);

	}
}

function dynamicSize(sprite, widthScale, heightScale) {
	let bounds = sprite.getBounds();
	// console.log(ratio)
	if (ratio < 1) {
		return (canvasWidth / bounds.width) * widthScale;
	} else {
		return (canvasHeight / bounds.height) * heightScale;
	}
}


var logoPos = new Vector3(0.5, 0.35);

function positionLogo() {
	logo.positionOffset = new Vector3(0, 0);
	logo.x = (logoPos.x * canvasWidth) + logo.positionOffset.x;
	logo.y = (logoPos.y * canvasHeight) + logo.positionOffset.y;
	var scale = dynamicSize(logo, 0.4, 0.5);
	logo.scaleX = scale;
	logo.scaleY = scale;
}

var taglinePos = new Vector3(0.5, 0.70);

function positionTagline() {
	tagline.x = (taglinePos.x * canvasWidth);
	tagline.y = (taglinePos.y * canvasHeight);
	var scale = dynamicSize(tagline, 0.8, 0.08);
	tagline.scaleX = scale;
	tagline.scaleY = scale;
}

function positionCJSLogo() {
	createjslogo.x = canvasWidth;
	createjslogo.y = canvasHeight;
	var scale = dynamicSize(createjslogo, 0.2, 0.1);
	createjslogo.scaleX = scale;
	createjslogo.scaleY = scale;
}

var introPos = new Vector3(0.5, 0.9);

function positionIntro() {
	intro.x = (introPos.x * canvasWidth);
	intro.y = (introPos.y * canvasHeight);
	var scale = dynamicSize(intro, 0.5, 0.07);
	intro.scaleX = scale;
	intro.scaleY = scale;
}

var beamInstances = [];
function createBeams() {
	var particleSprite = new createjs.Sprite(spriteSheet, "dot");
	new BeamGroup(2000, 0.7, beamWidth, canvasHeight / 3, 0, 0.3, particleSprite, beamInstances);
	new BeamGroup(2000, 0.8, beamWidth, canvasHeight / 2.5, canvasWidth / 2, 0.2, particleSprite, beamInstances);
	new BeamGroup(250, 0.65, beamWidth, canvasHeight / 4, canvasWidth, 0.1, particleSprite, beamInstances);

	var beams = [
		{
			density: 300,
			scatter: 600,
			width: beamWidth,
			height: canvasHeight / 2,
			particleOpacity: .08,
			particleScale: 1.5,
			timeRate: .4,
			rotateSpeed: 0.3,
			parallax: 0.1,
			phase: canvasWidth / 2,
			y: -canvasHeight / 5
		}, {
			density: 300,
			scatter: 450,
			width: beamWidth,
			height: canvasHeight / 1.5,
			particleOpacity: .05,
			particleScale: 2.5,
			timeRate: 0.5,
			rotateSpeed: 0.2,
			parallax: .05,
			phase: canvasWidth / 4,
			y: (canvasHeight / 5) * 2
		}
	];

	for (let i = 0; i < beams.length; i++) {
		let beam = new Beam(beams[i], particleSprite);
		beamInstances.push(beam);
		stage.addChild(beam);
	}

}


function resize() {
	canvasWidth = window.innerWidth;
	canvasHeight = window.innerHeight;
	stage.canvas.width = canvasWidth;
	stage.canvas.height = canvasHeight;

	stage.updateViewport(canvasWidth, canvasHeight);

	ratio = canvasWidth / canvasHeight;
	//baseTime = ratio;
	center.set(canvasWidth / 2, canvasHeight / 2);

	if (branding) {
		positionLogo();
		positionCJSLogo();
		positionIntro();
		positionTagline();
	}

	if (canvasWidth < 1200) {
		canvasWidth = 1200;
	}

	beamWidth = canvasWidth * 1.2;

	for (let i = 0; i < beamInstances.length; i++) {
		beamInstances[i].width = beamWidth;
	}

	bg.scaleX = canvasWidth / 1024;
	bg.scaleY = canvasHeight / 1024;

	//Beam.globalTimeScalar = canvasWidth/canvasHeight;

	stage.update();
}


function createBackground(img) {
	bg = new createjs.Bitmap(img);
	bg.scaleX = canvasWidth / 1024;
	bg.scaleY = canvasHeight / 1024;
	stage.addChildAt(bg, 0);
}

function updateMouse(e) {
	mouse.x = e.pageX - center.x;
	mouse.y = e.pageY - center.y;
}

function updateTouch(e) {
	mouse.x = e.touches[0].pageX - center.x;
	mouse.y = e.touches[0].pageY - center.y;
}

function draw() {
	stage.update();
}

function update() {
	var start = performance.now();
	var p = Vector3.multiply(mouse, 0.5);
	var loc = Vector3.add(p, center, p);

	for (let i = 0; i < beamInstances.length; i++) {
		let beam = beamInstances[i];
		beam.trackingPoint = Vector3.add(Vector3.multiply(mouse, beam.parallax), center, loc);
		beam.update();
	}

	draw();
	Beam.timeDelta = performance.now() - start;
}

function newBeam() {
	if (Beam.timeDelta < 11) {
		var particleSprite = new createjs.Sprite(spriteSheet, "dot");
		new BeamGroup(500, 0.6 + Math.random(), beamWidth, canvasHeight / 2 * Math.random(), Math.random() * canvasWidth, Math.random() * 0.5, particleSprite, beamInstances);
	}
}
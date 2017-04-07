"use strict";


var globalTimeScalar = 0;
class Beam extends createjs.Container {

	static get globalTimeScalar () { return 1.0; }
	static set globalTimeScalar (value) { globalTimeScalar = value; }

	constructor(density = 100, width = window.innerWidth, height = window.innerHeight, particleScale = 0.1, beamScale = 1, beamScatter = 50, beamOpacity = 0.6, rotateSpeed = 1) {
		super();
		this.phase = 0;
		this.timeRate = 2;
		this.time = 0;
		this.density = density;
		this.width = width;
		this.height = height;
		this.beamScale = beamScale;
		this.beamScatter = beamScatter;
		this.beamOpacity = beamOpacity;
		this.particleScale = particleScale;
		this.trackingPoint = new Vector3();
		this.rotateSpeed = rotateSpeed;
		this.img = null;
		this.points = [];
		this.zero = new Vector3();
		//this.loadGraphic();
	}

	setGraphic (graphic) {
		this.createPoints(graphic);
	}

	loadGraphic() {
		this.img = document.createElement("img");
		this.img.src = "/assets/particle.png";
		this.img.addEventListener("load", () => {
			this.createPoints(this.img);
		});
	}

	createPoints(img) {
		var amountOfDots = this.density;
		for (var i = 0; i < this.density; i++) {
			var scale = this.particleScale * Math.random();
			var c = {};
			c.location = new Vector3();
			c.scatter = new Vector3(Math.random() * this.beamScatter, Math.random() * this.period(amountOfDots) * this.beamScatter);
			c.scatter.rotate(Math.random() * 360);
			c.rotateDirection = (1 - Math.random()) * this.rotateSpeed;

			if(img instanceof createjs.Sprite) {
				c.graphic = img.clone();
			} else {
				c.graphic = new createjs.Bitmap(img.src);
			}
			c.graphic.alpha = Math.random() * this.beamOpacity;
			c.graphic.scaleX = scale;
			c.graphic.scaleY = scale;
			this.addChild(c.graphic);
			this.points.push(c);
		}
	}

	updatePoints() {
		var slice = this.width / this.points.length;
		for (var i = 0; i < this.points.length; i++) {

			var c = this.points[i];
			var locY = this.trackingPoint.y;
			var locX = (((this.trackingPoint.x + this.width) + (slice * i) + this.time + this.phase) % this.width) - 100;

			c.location.x = locX;
			c.location.y =
				this.wave(this.time, slice * i, this.width, locY, this.height) +
				this.wave(this.time * 2, slice * i, this.width / 2, 0, this.height / 4);

			c.scatter.rotate(c.rotateDirection, this.zero, true);
			c.location.add(c.scatter);

			c.graphic.x = c.location.x;
			c.graphic.y = c.location.y;
		}
	}

	wave(time, index, scale, centerPoint, size) {
		size *= 0.5;
		return centerPoint + Math.cos((index + time) * (2 * Math.PI / scale) % 360) * size;
	}

	period(length) {
		return 2 * Math.PI / length;
	}

	update() {
		this.time += this.timeRate;
		this.time *= Beam.globalTimeScalar;
		this.updatePoints();
	}
}

var Vector3 = Vexr.Vector3;


var queue = new createjs.LoadQueue();
queue.on("complete", init);
queue.on("progress", progress);
queue.loadManifest([
	{ src: "./assets/gfx.png", id: "gfx" },
	{ src: "./assets/bg.jpg", id: "bg" }
]);

document.getElementById("demoCanvas").setAttribute("width", window.innerWidth);
document.getElementById("demoCanvas").setAttribute("height", window.innerHeight);


var stage = new createjs.StageGL("demoCanvas", { antialias: true });
stage.setClearColor("#1C9ECF");
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;
stage.canvas.width = canvasWidth;
stage.canvas.height = canvasHeight;

var ratio = canvasWidth/canvasHeight;

var center = new Vector3(canvasWidth / 2, canvasHeight / 2);
var mouse = new Vector3(window.innerWidth / 2, window.innerHeight / 2, 0);

var beamWidth = canvasWidth * 1.2;

var beam, beam2, beam3, beam4, beam5, beam6, beam7;

var logo, tagline, createjslogo, intro;

var spriteSheet;
var bg = null;

stage.update();

function progress (e) {
	LabTemplate.loadProgress(e);
}

function init() {

	var data = {
		images: ["./assets/gfx.png"],
		frames: [
			// x, y, width, height, imageIndex*, regX*, regY*
			[0,    0, 230, 275, 0, 115, 137],
			[0,  275, 330,  40, 0, 165, 20],
			[0,  322, 145,  42, 0, 145, 41],
			[0,  465, 512,  47, 0, 256, 24],
			[384,  0, 128, 128, 0, 64, 64]
		],
		animations: {
			logo:0,
			intro:1,
			createjs:2,
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

	createjs.Ticker.timingMode = createjs.Ticker.RAF;
	createjs.Ticker.addEventListener("tick", update);

	document.getElementById("demoCanvas").style.display = "block";




	var particleSprite = new createjs.Sprite(spriteSheet, "dot");

	beam = new Beam(800, beamWidth, 400);
	beam.setGraphic(particleSprite);

	beam2 = new Beam(750, beamWidth, 400, 0.1, 2, 50, 0.8);
	beam2.setGraphic(particleSprite);
	beam2.time = 30;

	beam3 = new Beam(300, beamWidth, 600, 2, 2, 300, 0.1);
	beam3.setGraphic(particleSprite);
	beam3.timeRate = 0.2;
	beam3.rotateSpeed = 0.3;

	beam4 = new Beam(300, beamWidth, 500, 1, 2, 250, 0.2);
	beam4.setGraphic(particleSprite);

	beam4.phase = canvasWidth / 2;
	beam4.rotateSpeed = 0.2;

	beam5 = new Beam(750, beamWidth, 300, 0.1, 2, 50, 0.7);
	beam5.setGraphic(particleSprite);
	beam5.phase = canvasWidth / 2;

	beam6 = new Beam(600, beamWidth, 200, 0.2);
	beam6.setGraphic(particleSprite);
	beam6.phase = canvasWidth/4;

	beam7 = new Beam(850, beamWidth, 30, 0.1, 1, 80, .2);
	beam7.setGraphic(particleSprite);
	beam7.timeRate = 4;
	beam7.phase = canvasWidth/3;

	stage.addChild(beam, beam2, beam3, beam4, beam5, beam6, beam7);

	logo = new createjs.Sprite(spriteSheet, "logo");
	createjslogo = new createjs.Sprite(spriteSheet, "createjs");
	tagline = new createjs.Sprite(spriteSheet, "tagline");
	intro = new createjs.Sprite(spriteSheet, "intro");

	stage.addChildAt(logo, stage.numChildren-1);
	stage.addChildAt(createjslogo, stage.numChildren-1);
	stage.addChildAt(tagline, stage.numChildren-1);
	stage.addChildAt(intro, stage.numChildren-1);

	resize();




	stage.on("resize", resize);
	LabTemplate.setupStageResize(stage);
	LabTemplate.loadComplete();

}

function positionLogo () {
	logo.positionOffset = new Vector3(0, -130);
	logo.x = center.x + logo.positionOffset.x;
	logo.y = center.y + logo.positionOffset.y;
	// if(canvasWidth < 1025 && ratio > 1) {
	// 	logo.scaleX = ratio;
	// 	logo.scaleY = ratio;
	// }
}

function positionCJSLogo () {
	createjslogo.x = canvasWidth;
	createjslogo.y = canvasHeight;
}

function positionIntro () {
	intro.x = canvasWidth/2;
	intro.y = canvasHeight - 60;
}

function positionTagline () {
	var bounds = logo.getBounds();
	tagline.x = logo.x;
	tagline.y = logo.y + bounds.height;
}

function resize() {
	canvasWidth = window.innerWidth;
	canvasHeight = window.innerHeight;
	stage.canvas.width = canvasWidth;
	stage.canvas.height = canvasHeight;

	ratio = canvasWidth/canvasHeight;
	center.set(canvasWidth / 2, canvasHeight / 2);

	positionLogo();
	positionCJSLogo();
	positionIntro();
	positionTagline();

	if(canvasWidth < 1200) {
		canvasWidth = 1200;
	} else {
		beamWidth = canvasWidth * 1.2;
	}

	beam.width = beamWidth;
	beam2.width = beamWidth;
	beam3.width = beamWidth;
	beam4.width = beamWidth;
	beam5.width = beamWidth;
	beam6.width = beamWidth;
	beam7.width = beamWidth;

	bg.scaleX = canvasWidth / 1024;
	bg.scaleY = canvasHeight / 1024;



	Beam.globalTimeScalar = canvasWidth/canvasHeight;

	stage.updateViewport(canvasWidth, canvasHeight);
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
	var p = Vector3.multiply(mouse, 0.5);
	var loc = Vector3.add(p, center);
	if(beam != undefined) {
		beam.trackingPoint = Vector3.add(Vector3.multiply(mouse, 0.5), center);
		beam.update();

		beam.trackingPoint = Vector3.add(Vector3.multiply(mouse, 0.4), center);
		beam.update();

		beam2.trackingPoint = Vector3.add(Vector3.multiply(mouse, 0.3), center);
		beam2.update();

		beam3.trackingPoint = Vector3.add(Vector3.multiply(mouse, 0.05), center);
		beam3.update();

		beam4.trackingPoint = Vector3.add(Vector3.multiply(mouse, 0.04), center);
		beam4.update();

		beam5.trackingPoint = Vector3.add(Vector3.multiply(mouse, 0.25), center);
		beam5.update();

		beam6.trackingPoint = Vector3.add(Vector3.multiply(mouse, 0.15), center);
		beam6.update();

		beam7.trackingPoint = Vector3.add(Vector3.multiply(mouse, 0.5), center);
		beam7.update();
	}

	draw();
}
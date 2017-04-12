# Coasting-on-Cos-Waves
An experiment to showcase the new StageGL functionality in EaselJS

Check the index.js file for the code that runs the demo. If you want to modify index.js, make sure that the index.html file is pointed to it. 

If you're interested in the Vector3 implementation, it's from our [Vexr](https://github.com/gskinnerTeam/Vexr) library. I ended up using less of it that I had initially planned because Vector math can get a bit CPU intensive. It really adds up with 5-10k particles flying around. But if you're on a desktop Core i7, you should be able to chew through quite a few. Enable to `rotate` function on the particle spreads on [Line 81](https://github.com/gskinnerTeam/Coasting-on-Cos-Waves/blob/master/js/index.js#L81) for some extra juice.

If you want to be able to add beams at the click of a button, set the `addBeams` var to `true` on [Line 129](https://github.com/gskinnerTeam/Coasting-on-Cos-Waves/blob/master/js/index.js#L129)

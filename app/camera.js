/**
 * @file
 * Camera for the NeuroTracker.
 */
define(['three', 'jquery'], function(THREE, $){

	var camera = new THREE.PerspectiveCamera( 90, $(tracker).width() / $(tracker).height(), 0.1, 10 );
	camera.position.z = 1;

	camera.look = new THREE.Vector3(0,0,0);
	camera.time = 0;
	camera.updateView = function(mode) {
		if (mode !== "play") {
			camera.time += 0.001;
			camera.position.x = Math.cos(camera.time);
			camera.position.z = Math.sin(camera.time);
			camera.lookAt(camera.look);
		}
	}

	return camera;
});

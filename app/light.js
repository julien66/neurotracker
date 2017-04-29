/**
 * @file
 * light for Ball tracker
 */
define(['three'], function(THREE) {
	
	var ambientLight = new THREE.AmbientLight( 0x555555);

	var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight.position.y = 1;

	return {
		ambient : ambientLight,
		directional : directionalLight
	}
});

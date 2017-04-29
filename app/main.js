/**
 * @file
 * Main entry point Requirejs
 */

require.config({
	'paths' : {
		'bootstrap' : '/bower_components/bootstrap/dist/js/bootstrap',
		'jquery' : '/bower_components/jquery/dist/jquery',
		'stats' : '/bower_components/stats.js/build/stats',
		'three' : '/bower_components/three.js/three',
		'threex' : '/bower_components/threex.oimo/threex.oimo',
	},
	'shim' : {
		'bootstrap' : {
			'deps' : ['jquery'],
		},
		'jquery' : {
			'exports' : '$'
		},
		'stats' : {
			'exports' : 'Stats'
		},
		'three' : {
			'exports' : 'THREE'
		},
		'threex' : {
			'exports' : 'THREEX'
		}
	}
});

require(['three', 'ball', 'jquery', 'stats', 'logic', 'camera', 'light', 'bootstrap'], function(THREE, Ball, $, Stats, Logic, Camera, Lights) {
	var mousePosition = false;
	var scene = new THREE.Scene();
	/*var stats = new Stats();
	stats.showPanel( 0 );
	document.body.appendChild( stats.dom );*/

	var tracker = document.getElementById("tracker");

	var renderer = new THREE.WebGLRenderer({alpha : true, antialias : true});
	renderer.setSize( $(tracker).width(), $(tracker).height() );
	tracker.appendChild(renderer.domElement);

	window.addEventListener( 'resize', onWindowResize, false );

	function onWindowResize(){
		Camera.aspect = $(tracker).width() / $(tracker).height();
		Camera.updateProjectionMatrix();
		renderer.setSize( $(tracker).width(), $(tracker).height() );
	}


  var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	var material = new THREE.MeshBasicMaterial({transparent : true, opacity : 0});
	//var material = new THREE.MeshBasicMaterial({wireframe : true});
	var cube = new THREE.Mesh( geometry, material );
	scene.add( cube );
	
	scene.add( Lights.ambient );
	scene.add( Lights.directional );

	var balls = [];
	var meshes = [];

	for (var i = 0; i < 8; i++) {
		var ball = new Ball();
		balls.push(ball);
		meshes.push(ball.mesh);
		cube.add(ball.mesh);
	}


	function render() {
		//stats.begin();
		Camera.updateView(Logic.mode);
		Logic.updateGame(balls, meshes, mousePosition, Camera, cube);
		renderer.render( scene, Camera );
		//stats.end();	
		requestAnimationFrame( render );
	}
	render();

	$('#start').on('click', function(e){
		if ( Logic.getMode() === "stop" ) {
			Ball.randomBall();
			Logic.setMode('start');
			$('#start').hide();
		}
	});

	$(document).on('mousemove', function(e) {
		mousePosition = e;
	});

	$(document).on('click', function(e) {
		for (var i = 0; i < balls.length; i++) {
			balls[i].onSelect();
		}
	});
});

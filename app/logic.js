/**
 * @file
 * Game Logic for the Neuro tracker.
 */
define(['three', 'ball', 'jquery'], function(THREE, Ball, $) {

	var Logic = {};
	Logic.mode = 'stop';
	Logic.clock = new THREE.Clock();
	Logic.elapsed = 0;
	Logic.gameSpeed = 0.005;
	Logic.speed = 1;
	Logic.level = 1;

	Logic.getMode = function() {
		return Logic.mode;
	}

	Logic.setMode = function(m) {
		Logic.mode = m;
		Logic.clock.start();
	}

	Logic.updateGame = function(balls, meshes, mousePosition, camera, cube) {
		Logic.elapsed = Logic.clock.getElapsedTime();
		switch (Logic.mode) {
			case 'start':
				for (var i = 0; i < Ball.toFind.length; i++) {
					balls[Ball.toFind[i] - 1].blink(Logic.elapsed);
					if (Logic.elapsed >= 5) {
						Logic.clock.stop();
						balls[Ball.toFind[i] - 1].reset();
						Logic.clock.start();
						Logic.mode = "play";
					}	
				}
				$("#time").html(Math.round(Logic.elapsed) + "/" + 5 );
				break;

			case 'play':
				for (var i = 0; i < balls.length; i++){
					balls[i].checkCollidingCube(cube);
					balls[i].checkCollidingBalls(meshes);
				}

				for (var i = 0; i < balls.length; i++){
					balls[i].move(Logic.gameSpeed);
				}
				if (Logic.elapsed >=8) {
					Logic.clock.stop();
					Logic.mode = "answer";
				}
				$("#time").html(Math.round(Logic.elapsed) + "/" + 8 );
				break;

			case 'answer':
				var mouse = new THREE.Vector3((mousePosition.offsetX / window.innerWidth ) * 2 - 1, -((mousePosition.offsetY) / window.innerHeight ) * 2 + 1, -0.5);
				var raycaster = new THREE.Raycaster();
				raycaster.setFromCamera(mouse, camera);
				var intersects = raycaster.intersectObjects(meshes);
				if(intersects.length > 0) {
					var num = intersects[0].object.number - 1;
					balls[num].onHover(num + 1);
					$("#tracker").css("cursor","pointer");
				} else {
					for (var i = 0; i < balls.length; i++) {
						balls[i].reset();
						$("#tracker").css("cursor","default");
					}
				}

				if (Logic.elapsed >= 10) {
					$("#tracker").css("cursor","default");
					Logic.clock.stop();
					var passed = Ball.validate(balls);
					if (passed === true) {
						Logic.gameSpeed += 0.001;
						Logic.speed += 1;
						$("#overall").append('<i class="fa fa-check text-success" aria-hidden="true"></i>');
					}
					else {
						if (Logic.gameSpeed > 0) {
							Logic.gameSpeed -= 0.001;
						}
						Logic.speed -= 1;
						$("#overall").append('<i class="fa fa-close text-danger" aria-hidden="true"></i>');
					}
					Logic.level += 1;
					$('#speed').html(Logic.speed);
					$('#level').html(Logic.level);
					Logic.mode = 'wait';
				}
				$("#time").html(Math.round(Logic.elapsed) + "/" + 10 );
				break;

			case 'wait' :
				$("#time").html(Math.round(Logic.elapsed) + "/" + 3 );
				if (Logic.elapsed >= 3) {
					Logic.clock.stop();
					for (var i = 0; i < balls.length; i++) {
						balls[i].reset(true);
						Ball.randomBall();
						Logic.mode = 'start';
					}
				}
				break;
			}
			
	};

	return Logic;
});

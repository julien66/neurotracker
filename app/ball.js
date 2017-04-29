/**
 * @file
 * Ball module for the neurotracker
 */
define(['three'], function(THREE) {

	function Ball() {
		// Checking 'NEW' Instance of Ball.
		if (!(this instanceof Ball)) {
			throw new TypeError("Ball constructor cannot be called as a function.");
		}

		Ball.number = (Ball.number || 0) + 1;
		Ball.numSelected = 0;
		Ball.numHover = false;
		Ball.toFind = [];

		this.size = 0.04;
		this.geometrie = new THREE.SphereGeometry( this.size, 32, 32);
		this.material = new THREE.MeshLambertMaterial( {color: 0xffff00} );
		
		this.mesh = new THREE.Mesh( this.geometrie, this.material );
		this.mesh.number = Ball.number;
		this.mesh.direction =  new THREE.Vector3( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 );
		this.mesh.position.x = Math.min(Math.random() - 0.5 + (this.size * 0.5), 0.5 - this.size * 0.5);
		this.mesh.position.y = Math.min(Math.random() - 0.5 + (this.size * 0.5), 0.5 - this.size * 0.5);
		this.mesh.position.z = Math.min(Math.random() - 0.5 + (this.size * 0.5), 0.5 - this.size * 0.5);

		this.selected = false;
		this.move = function(gameSpeed) {
			this.mesh.position.x += this.mesh.direction.x * gameSpeed;
			this.mesh.position.y += this.mesh.direction.y * gameSpeed;
			this.mesh.position.z += this.mesh.direction.z * gameSpeed;
		}
	
		this.spin = function() {
			this.mesh.rotation.x += this.mesh.direction.x;
			this.mesh.rotation.y += this.mesh.direction.y;
			this.mesh.rotation.z += this.mesh.direction.z;
		}

		this.checkCollidingCube = function() {
			// Exiting from right or left
			if (this.mesh.position.x < -0.5 + (this.size * 0.5)  || this.mesh.position.x > 0.5 - (this.size * 0.5)) {
				this.mesh.direction.x = -this.mesh.direction.x;
			}
			
			// Exiting form top or bottom
			if (this.mesh.position.y < -0.5 + (this.size * 0.5)|| this.mesh.position.y > 0.5 - (this.size * 0.5)) {
				this.mesh.direction.y = -this.mesh.direction.y;
			}

			// Exiting form front or rear
			if (this.mesh.position.z < -0.5 + (this.size * 0.5) || this.mesh.position.z > 0.5 - (this.size * 0.5)) {
				this.mesh.direction.z = -this.mesh.direction.z;
			}
		}

		this.checkCollidingBalls = function(othersBalls) {
			var raycaster = new THREE.Raycaster(this.mesh.position, this.mesh.direction.normalize(), 0, this.size * 1.5);
			var intersects = raycaster.intersectObjects(othersBalls, true);
			if (intersects.length > 0 && intersects[0].distance <= this.size) {
				var coBall = intersects[0].object;
				
				var nv1 = new THREE.Vector3(); 
				nv1 = this.mesh.direction;
				nv1.add(Ball.projectUonV(coBall.direction, coBall.position.clone().sub(this.mesh.position)));
				nv1.sub(Ball.projectUonV(this.mesh.direction, this.mesh.position.clone().sub(coBall.position)));
				
				var nv2 = new THREE.Vector3(); 
				nv2 = coBall.direction;
				nv2.add(Ball.projectUonV(this.mesh.direction, coBall.position.clone().sub(this.mesh.position)));
				nv2.sub(Ball.projectUonV(coBall.direction, this.mesh.position.clone().sub(coBall.position)));
			
				this.mesh.direction = nv1;
				coBall.direction = nv2;

			}
		}

		this.blink = function(elapsed) {
			//console.log(elapsed);
			if (Math.floor(elapsed) % 2 == 0) {
				this.mesh.material.color.setHex( 0xff1111 );
				this.mesh.scale.set(1.2,1.2,1.2);
			}else{
				this.mesh.material.color.setHex( 0xffff00 );
				this.mesh.scale.set(1,1,1);
			}
		}
	
		this.reset = function(forced) {
			if (this.selected === false || forced === true) {
				this.mesh.material.color.setHex( 0xffff00 );
				this.mesh.scale.set(1,1,1);
				this.selected = false;
			}
			Ball.numHover = false;
			if (forced) {
				Ball.numSelected = 0;
			}
		}

		this.onHover = function(index) {
			this.mesh.material.color.setHex( 0xff1111 );
			Ball.numHover = index;
		}

		this.goGreen = function() {
			this.mesh.material.color.setHex( 0x00FF00 );
		}

		this.goOrange = function() {
			this.mesh.material.color.setHex( 0xFFA500 );
		}

		Ball.projectUonV = function(u, v) {
			r = Ball.scale(v, u.clone().dot(v) / v.clone().dot(v));
			return r;
		}

		this.onSelect = function() {
			if (this.mesh.number == Ball.numHover && this.selected === true) {
				this.selected = false;
				Ball.numSelected -= 1;
				this.reset();
			}
			else if (this.mesh.number == Ball.numHover && Ball.numSelected < 4) {
				this.selected = true;
				Ball.numSelected += 1;
			}
			
		}

		Ball.scale = function(v, a) {
			var r = new THREE.Vector3();
			r.x = v.x * a;
			r.y = v.y * a;
			r.z = v.z * a;
			return r;
		}
	}

	Ball.randomBall = function() {
		Ball.toFind = [];
		while (Ball.toFind.length < 4) {
			var index = Math.ceil(Math.random() * 8);
			if(Ball.toFind.indexOf(index) > -1) continue;
			Ball.toFind.push(index);
		}
		return Ball.toFind;
	}

	Ball.validate = function(balls) {
		var passed = true;
		for (var i = 0; i < Ball.toFind.length; i++) {
			if (balls[Ball.toFind[i] - 1].selected === false) {
				balls[Ball.toFind[i] - 1].goOrange();
				passed = false;
			}
			else {
				balls[Ball.toFind[i] - 1].goGreen();
			}
		}

		return passed;
	}

	return Ball;
});


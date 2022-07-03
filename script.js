import platform from './img/platform.png'


const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

// Start listening to resize events and draw canvas.
initialize();

function initialize() {
    // Register an event listener to call the resizeCanvas() function 
    // each time the window is resized.
    window.addEventListener('resize', resizeCanvas, false);
    // Draw canvas border for the first time.
    resizeCanvas();
  }

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

const gravity = 0.3;

class Player {
	constructor(){
		this.position = {
			x:100,
			y:100
		}
		this.width = 100
		this.height = 100
		this.velocity = {
			x:0,
			y:1
		}
		this.bottomPosition = this.height + this.position.y
	}
		draw() {
			ctx.fillStyle = 'red';
			ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
		}

		update(){
			this.draw();
			this.position.x += this.velocity.x
			this.position.y += this.velocity.y

			if(this.position.y + this.height + this.velocity.y <= canvas.height)
				{ this.velocity.y += gravity }
			else
				{ this.velocity.y = 0 }
		}
}

class Platform {
	constructor({ x, y }){
		this.position = {
			x,
			y
		}

		this.width = 200
		this.height = 20
	}

	draw(){
		ctx.fillStyle = 'green'
		ctx.fillRect(this.position.x,this.position.y, this.width, this.height)
	}
}

const player = new Player()
const platforms = [new Platform({x:250, y: 800}),new Platform({x:650, y: 820})]

const keys = {
	right:{
		pressed: false
	},
	left:{
		pressed: false
	}
}
player.draw()

let scrollOffset = 0

function animate(){
	requestAnimationFrame(animate);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	player.update();
	platforms.forEach(platform => {platform.draw()})

	// if player's position x >=400 go to else aka stop moving player and start moving background
	if(keys.right.pressed && player.position.x < 400){
		player.velocity.x = 5
	}
	// if player's position x < 100 and it tries to go left stop moving 
	else if(keys.left.pressed && player.position.x > 100){
		player.velocity.x = -5
	}
	else
		{
			player.velocity.x *= 0.9
			
			// if player's trying to go right start moving platform to the left
			// platform velocity should be similar to player's velocity to look accordingly 
			if(keys.right.pressed){
				scrollOffset += 5
				platforms.forEach(platform => platform.position.x  -= 5)
				
			}
			if(keys.left.pressed){
				scrollOffset -= 5
				platforms.forEach(platform => platform.position.x  += 5)
			}
		}
	
		// platform collision detection
	platforms.forEach(platform => {
		if (player.position.x + player.width >= platform.position.x &&
			platform.position.x + platform.width >= player.position.x &&
			player.position.y + player.height <= platform.position.y && 
			player.position.y + player.height + player.velocity.y >= platform.position.y)
			{
				player.velocity.y = 0
			}
})

	if(scrollOffset > 1000){
		console.log('you won')
	}
}
animate()

addEventListener('keydown', ({ key })=>{
	switch(key){
		// move left
		case 'a':			
			keys.left.pressed = true
			break
		// move right
		case 'd':
			keys.right.pressed = true
			break
		// jump		
		case 'w':
			if(player.velocity.y == 0)
				{ player.velocity.y -= 10 }
			break
		case ' ':
			if(player.velocity.y == 0)
				{ player.velocity.y -= 10 }
			break
	}
})

addEventListener('keyup', ({key})=>{
	switch(key){
		// stop moving left
		case 'a':
			keys.left.pressed = false
			break
		// stop moving right
		case 'd':
			keys.right.pressed = false
			break
	}
})
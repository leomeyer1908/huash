//server setup
var express = require('express'),
    app = express(),
    http = require("http").createServer(app),
    socket = require("socket.io"),
    io = socket.listen(http),
    gameSocket = io.of('game'),
	loginSocket = io.of('login');
	
var port = 8080,
    ip   = '0.0.0.0';

app.use(express.static('public'));

http.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);
//io = socket(app.listen(port, ip));

//server code

var players = [],
mapX = 1840,
mapY = 1840,
energyOrbs = [];

function generateOrbs() {
	var x = Math.random() * mapX;
	var y = Math.random() * mapY;
	var skill = ["health","damage","speed"]
	this.x = parseInt(x);
    this.y = parseInt(y);
    this.speedX = 0;
	this.speedY = 0;
	this.skill = skill[Math.floor(Math.random()*(skill.length))]
	this.skill = Math.floor(Math.random()*Math.pow(skill.length, 2)) == 0 ? "all" : this.skill;
	this.color = 
		(this.skill == "health") ? "rgba(255,0,0,0.1)" :
		(this.skill == "damage") ? "rgba(0,255,0,0.1)" :
		(this.skill == "speed") ? "rgba(0,0,255,0.2)" : 
		"rgba(255,255,255,0.2)";

	return {"x":this.x, "y":this.y, "speedX":this.speedX, "speedY":this.speedY, "skill":this.skill, "color":this.color};
}
function newPlayer(playerName) {
    var x = Math.random() * mapX;
    var y = Math.random() * mapY;
    //id selection
    var id = [];
    for (var i = 0; i < players.length; i++) {
    	id.push(players[i].id);
    }
    id.sort();
    if (id[0] != 0) {
    	id = 0;
    }
    for (var i = 0; i < id.length; i++) {
    	if (id[i]+1 != id[i+1]) {
    		id = id[i]+1;
    	}
    }
    this.x = parseInt(x);
    this.y = parseInt(y);
    this.id = id;
	this.speedX = 0;
	this.speedY = 0;
	this.moveX = 0;
	this.moveY = 0;
    this.mass = 40;
    this.points = 0;
	this.health = 1;
	this.tHealth = 1;
	this.speed = 1;
	this.damage = 1;
	this.kills;
	this.name = playerName;
    return {"x":this.x, "y":this.y, "id":this.id, "speedX":this.speedX, "speedY":this.speedY, "up":this.up, "down":this.down, "left":this.left, "right":this.right, "mass":this.mass, "health":this.health, "tHealth":this.tHealth, "points":this.points, "speed":this.speed, "damage":this.damage, "name":this.name};
}
io.sockets.on('connection', function(socket) {
	socket.emit("load");
	socket.on("spawn", function(playerName){
	    var currentPlayer = new newPlayer(playerName);
	    players.push(currentPlayer);
	    console.log(players);
	    socket.emit('welcome', currentPlayer, players, players[players.indexOf(currentPlayer)].id);
	    socket.on('disconnect', function(){
	    	delete players[players.indexOf(currentPlayer)];
		    // players.splice([players.indexOf(currentPlayer)], 1);
		    console.log(players);
	    })
	})

    //movement
	socket.on("up", function(co){
		if (players[co] != undefined) {
			if (players[co].moveY != -1 && players[co].moveY != 2) {
	            players[co].moveY = 1;
			} else {
				players[co].moveY = 2;
			}
		}
	})
	socket.on("down", function(co){
		if (players[co] != undefined) {
			if (players[co].moveY != 1 && players[co].moveY != -2) {
			    players[co].moveY = -1;
			} else {
	            players[co].moveY = -2;
			}
		}
	}) 
	socket.on("left", function(co){
		if (players[co] != undefined) {
			if (players[co].moveX != 1 && players[co].moveX != -2) {
			    players[co].moveX = -1;
	        } else {
	            players[co].moveX = -2;
	        }
	    }
	}) 
	socket.on("right", function(co){
		if (players[co] != undefined) {
			if (players[co].moveX != -1 && players[co].moveX != 2) {
			    players[co].moveX = 1;
			} else {
	            players[co].moveX = 2;
			}
		}
	}) 

	socket.on("up2", function(co){
		if (players[co] != undefined) {
	        if (players[co].moveY == 1) {
			    players[co].moveY = 0;
	        } else if (players[co].moveY == 2 || players[co].moveY == -2) {
	        	players[co].moveY = -1
	        }
	    }
	})
	socket.on("down2", function(co){
		if (players[co] != undefined) {
			if (players[co].moveY == -1) {
			    players[co].moveY = 0;
			} else if (players[co].moveY == 2 || players[co].moveY == -2) {
	            players[co].moveY = 1;
			}
		}
	}) 
	socket.on("left2", function(co){
		if (players[co] != undefined) {
	        if (players[co].moveX == -1) {
		        players[co].moveX = 0;
	        } else if (players[co].moveX == 2 || players[co].moveX == -2) {
	            players[co].moveX = 1;
	        }
	    }
	}) 
    socket.on("right2", function(co){
    	if (players[co] != undefined) {
	        if (players[co].moveX == 1) {
		        players[co].moveX = 0;
	        } else if (players[co].moveX == 2 || players[co].moveX== -2) {
	        	players[co].moveX = -1;
	        }
	    }
	})
    
    //skills
    socket.on("health", function(co) {
    	if (players[co] != undefined) {
			if (players[co].points > 0) {
				players[co].tHealth += 1;
				players[co].health += 1;
				players[co].points -= 1;
				players[co].mass += 1;
			}
		}
	})
	socket.on("damage", function(co) {
		if (players[co] != undefined) {
			if (players[co].points > 0) {
				players[co].damage += 1;
				players[co].points -= 1;
				players[co].mass += 1;
			}
		}
	})
	socket.on("speed", function(co) {
		if (players[co] != undefined) {
			if (players[co].points > 0) {
				players[co].speed += 1;
				players[co].points -= 1;
				players[co].mass += 1;
			}
		}
	})

	socket.on('click', function(co, mousex, mousey) {
        for (var i = 0; i < players.length; i++) {
            if (players[i] != undefined && players[i] != null && i != co && players[co] != undefined && players[co] != null) {
            	//p1 = (mousex,mousey), p2 = (players[i].x,players[i].y)
            	//distance formula
				if (Math.sqrt(Math.pow((mousex - players[i].x),2) + Math.pow((mousey - players[i].y),2)) < players[i].mass) {
		            if (players[i].tHealth > players[co].damage) {
						players[i].health -= players[i].tHealth/(players[i].tHealth - players[co].damage);
					} else {
						players[i].health = 0;
					}
						console.log("thealth: " + players[i].tHealth)
						console.log("health: " + players[i].health)
						//death
					if (players[i].health <= 0) {
						players[co].points += Math.round((players[i].mass - 40)/2);
						delete players[i];
						//players.splice(i, 1);
						console.log(players);
					}
		        }
        	}
        }
	});

	socket.on('moveMouse', function(id, mousex, mousey) {
		var radius = 12.5;
		for (var i = 0; i < energyOrbs.length; i++) {
            if ((mousex > energyOrbs[i].x-radius && mousex < energyOrbs[i].x+radius) && (mousey > energyOrbs[i].y-radius && mousey < energyOrbs[i].y+radius)) {
            	if (energyOrbs[i].skill == "all") {
            		players[id].points += 1;
            	} else {
            		players[id][energyOrbs[i].skill] += 1;
            		if (energyOrbs[i].skill == "health") {
            			players[id].tHealth += 1;
            		}
            		players[id].mass += 1;
            	}
            	energyOrbs.splice(i, 1);
            }
		}
	});
	
	socket.on('updateGame', function() {
		socket.emit("update", players, energyOrbs, mapX, mapY);
	}) 
})
setInterval(serverLoop, 1000/60)
function serverLoop() {
	for (var i = 0; i < players.length; i++) {
		if (players[i] == undefined || players[i] == null) {
			players.splice(i, 1);
		}
	}
	if (players.length >= 50) {
		mapX = 10000;
		mapY = 10000;
	} else {
		mapX = 1840 + players.length*160;
		mapY = 1840 + players.length*160;
	}
	if (energyOrbs.length < mapX/400 + mapY/150) {
		for (var i = 0; i < mapX/400 + mapY/150 + -energyOrbs.length; i++) {
			if (Math.ceil(Math.random()*(mapX/400 + mapY/150)*30) == i) {
				energyOrbs.push(new generateOrbs());
			}
		}
	}
	for (var i = 0; i < energyOrbs.length; i++) {
        energyOrbs[i].speedX += (Math.floor(Math.random()*3) - 1)/30;
        energyOrbs[i].speedY += (Math.floor(Math.random()*3) - 1)/30;
        
		energyOrbs[i].x += energyOrbs[i].speedX;
		energyOrbs[i].y += energyOrbs[i].speedY;

		if (energyOrbs[i].x > mapX) {
	    	energyOrbs[i].x -= mapX;
	   	}
	    if (energyOrbs[i].x < 0) {
	    	energyOrbs[i].x += mapX;
	    }
	    if (energyOrbs[i].y > mapY) {
	    	energyOrbs[i].y -= mapY;
	    }
	    if (energyOrbs[i].y < 0) {
	    	energyOrbs[i].y += mapY;
	    }
	}


	for (var i = 0; i < players.length; i++) {
		if (players[i] == undefined) {
		} else if (players[i] == null) {
		} else {
		    //move activated
		    if (players[i].moveX == 1 || players[i].moveX == -2) {
		    	//speed limit
		    	if (players[i].speedX < players[i].speed) {
		    	    players[i].speedX += 1
	   		 	}
		    }
		    else if (players[i].moveX == -1 || players[i].moveX == 2) {
		    	if (players[i].speedX > -players[i].speed) {
		    	    players[i].speedX -= 1
		    	}
		    } else {
		    	players[i].speedX = 0;
		    }

	 	   if (players[i].moveY == 1 || players[i].moveY == -2) {
		    	if (players[i].speedY < players[i].speed) {
		    	    players[i].speedY += 1
		    	}
		    }
		    else if (players[i].moveY == -1 || players[i].moveY == 2) {
   	        	if (players[i].speedY > -players[i].speed) {
		    	    players[i].speedY -= 1
		    	}
	    	} else {
	    		players[i].speedY = 0;
	    	}
	    	players[i].x += players[i].speedX;
	    	players[i].y += players[i].speedY;
	    	if (players[i].x > mapX) {
	    		players[i].x -= mapX;
	   		}
	    	if (players[i].x < 0) {
	    		players[i].x += mapX;
	    	}
	    	if (players[i].y > mapY) {
	    		players[i].y -= mapY;
	    	}
	    	if (players[i].y < 0) {
	    		players[i].y += mapY;
	    	}
		}
	}
} 

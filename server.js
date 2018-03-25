//server setup
var express = require('express'),
    app = express(),
    http = require("http").createServer(app),
    socket = require("socket.io"),
    io = socket.listen(http),
    gameSocket = io.of('game'),
	loginSocket = io.of('login');
	
var port = 80,
    ip   = '0.0.0.0';

app.use(express.static('public'));

http.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);
//io = socket(app.listen(port, ip));
//server code

var players = [];

function newPlayer(playerName) {
    var x = Math.random() * 17280;
    var y = Math.random() * 18360;
    this.x = parseInt(x);
    this.y = parseInt(y);
	this.speedX = 0;
	this.speedY = 0;
	this.moveX = 0;
	this.moveY = 0;
    this.mass = 40;
    this.points = 100;
	this.health = 1;
	this.tHealth = 1;
	this.speed = 1;
	this.damage = 1;
	this.name = playerName;
    return {"x": this.x, "y": this.y, "speedX": this.speedX, "speedY": this.speedY, "up": this.up, "down": this.down, "left": this.left, "right": this.right, "mass": this.mass, "health": this.health, "tHealth": this.tHealth, "points": this.points, "speed": this.speed, "damage": this.damage, "name": this.name}
}

io.sockets.on('connection', function(socket) {
	socket.emit("load");
	socket.on("spawn", function(playerName){
	    var currentPlayer = new newPlayer(playerName);
	    players.push(currentPlayer);
	    console.log(players);
	    socket.emit('welcome', currentPlayer, players, players.indexOf(currentPlayer));
	    socket.on('disconnect', function(){
		    delete players[players.indexOf(currentPlayer)];
		    console.log(players);
	    })
	})

    //movement
	socket.on("up", function(co){
		if (players[co].moveY != -1 && players[co].moveY != 2) {
            players[co].moveY = 1;
		} else {
			players[co].moveY = 2;
		}
	})
	socket.on("down", function(co){
		if (players[co].moveY != 1 && players[co].moveY != -2) {
		    players[co].moveY = -1;
		} else {
            players[co].moveY = -2;
		}
	}) 
	socket.on("left", function(co){
		if (players[co].moveX != 1 && players[co].moveX != -2) {
		    players[co].moveX = -1;
        } else {
            players[co].moveX = -2;
        }
	}) 
	socket.on("right", function(co){
		if (players[co].moveX != -1 && players[co].moveX != 2) {
		    players[co].moveX = 1;
		} else {
            players[co].moveX = 2;
		}
	}) 

	socket.on("up2", function(co){
        if (players[co].moveY == 1) {
		    players[co].moveY = 0;
        } else if (players[co].moveY == 2 || players[co].moveY == -2) {
        	players[co].moveY = -1
        }
	})
	socket.on("down2", function(co){
		if (players[co].moveY == -1) {
		    players[co].moveY = 0;
		} else if (players[co].moveY == 2 || players[co].moveY == -2) {
            players[co].moveY = 1;
		}
	}) 
	socket.on("left2", function(co){
        if (players[co].moveX == -1) {
	        players[co].moveX = 0;
        } else if (players[co].moveX == 2 || players[co].moveX == -2) {
            players[co].moveX = 1;
        }
	}) 
    socket.on("right2", function(co){
        if (players[co].moveX == 1) {
	        players[co].moveX = 0;
        } else if (players[co].moveX == 2 || players[co].moveX== -2) {
        	players[co].moveX = -1;
        }
	})
    
    //skills
    socket.on("health", function(co) {
		if (players[co].points > 0) {
			players[co].tHealth += 1;
			players[co].health += 1;
			players[co].points -= 1;
			players[co].mass += 1;
		}
	})
	socket.on("damage", function(co) {
		if (players[co].points > 0) {
			players[co].damage += 1;
			players[co].points -= 1;
			players[co].mass += 1;
		}
	})
	socket.on("speed", function(co) {
		if (players[co].points > 0) {
			players[co].speed += 1;
			players[co].points -= 1;
			players[co].mass += 1;
		}
	})
	socket.on('click', function(co, mousex, mousey) {
        for (var a = 0; a < players.length; a++) {
            if (players[a] == undefined) {
	        } else if (players[a] == null) {
	        } else if (players[a].id == co) {
	        } else if (players[a].x + players[a].mass/2 > mousex && players[a].x - players[a].mass/2 < mousex && players[a].y - players[a].mass/40 * 6 <= mousey && players[a].y + players[a].mass/40 * 6 >= mousey) {
	            loseHealth(a, co)
	        } else if (players[a].x + players[a].mass/2 - players[a].mass/40 > mousex && players[a].x - players[a].mass/2 + players[a].mass/40 < mousex && players[a].y - players[a].mass/40 * 8 <= mousey && players[a].y + players[a].mass/40 * 8 >= mousey) {
	            loseHealth(a, co)
	        } else if (players[a].x + players[a].mass/2 - players[a].mass/40 * 2 > mousex && players[a].x - players[a].mass/2 + players[a].mass/40 * 2 < mousex && players[a].y - players[a].mass/40 * 10 <= mousey && players[a].y + players[a].mass/40 * 10 >= mousey) {
	            loseHealth(a, co)
	        } else if (players[a].x + players[a].mass/2 - players[a].mass/40 * 3 > mousex && players[a].x - players[a].mass/2 + players[a].mass/40 * 3< mousex && players[a].y - players[a].mass/40 * 12 <= mousey && players[a].y + players[a].mass/40 * 12 >= mousey) {
	            loseHealth(a, co)
	        } else if (players[a].x + players[a].mass/2 - players[a].mass/40 * 4 > mousex && players[a].x - players[a].mass/2 + players[a].mass/40 * 4 < mousex && players[a].y - players[a].mass/40 * 13 <= mousey && players[a].y + players[a].mass/40 * 13 >= mousey) {
	            loseHealth(a, co)
	        } else if (players[a].x + players[a].mass/2 - players[a].mass/40 * 5 > mousex && players[a].x - players[a].mass/2 + players[a].mass/40 * 5 < mousex && players[a].y - players[a].mass/40 * 14 <= mousey && players[a].y + players[a].mass/40 * 14 >= mousey) {
	            loseHealth(a, co)
	        } else if (players[a].x + players[a].mass/2 - players[a].mass/40 * 6 > mousex && players[a].x - players[a].mass/2 + players[a].mass/40 * 6 < mousex && players[a].y - players[a].mass/40 * 15 <= mousey && players[a].y + players[a].mass/40 * 15 >= mousey) {
	            loseHealth(a, co)
	        } else if (players[a].x + players[a].mass/2 - players[a].mass/40 * 7 > mousex && players[a].x - players[a].mass/2 + players[a].mass/40 * 7 < mousex && players[a].y - players[a].mass/40 * 16 <= mousey && players[a].y + players[a].mass/40 * 16 >= mousey) {
	            loseHealth(a, co)
	        } else if (players[a].x + players[a].mass/2 - players[a].mass/40 * 9 > mousex && players[a].x - players[a].mass/2 + players[a].mass/40 * 9 < mousex && players[a].y - players[a].mass/40 * 17 <= mousey && players[a].y + players[a].mass/40 * 17 >= mousey) {
	            loseHealth(a, co)
	        } else if (players[a].x + players[a].mass/2 - players[a].mass/40 * 11 > mousex && players[a].x - players[a].mass/2 + players[a].mass/40 * 11 < mousex && players[a].y - players[a].mass/40 * 18 <= mousey && players[a].y + players[a].mass/40 * 18 >= mousey) {
	            loseHealth(a, co)
	        } else if (players[a].x + players[a].mass/2 - players[a].mass/40 * 13 > mousex && players[a].x - players[a].mass/2 + players[a].mass/40 * 13 < mousex && players[a].y - players[a].mass/40 * 19 <= mousey && players[a].y + players[a].mass/40 * 19 >= mousey) {
	            loseHealth(a, co)
	        }
        }
	});
	function loseHealth(a, co){
		if (players[a].tHealth > players[co].damage) {
			players[a].health -= players[a].tHealth/(players[a].tHealth - players[co].damage);
		} else {
			players[a].health = 0;
		}
		console.log("thealth: " + players[a].tHealth)
		console.log("health: " + players[a].health)
		//death
		if (players[a].health <= 0) {
			players[co].points += Math.round((players[a].mass + players[a].points) - 40);
			delete players[a];
			console.log(players);
		}
	}

	/*
	10 - d1 = 10
	10 - d2 = 5
	10 - d3 = 3.3

	10 - d1 = 9
	10 - d2 = 8
	10 - d3 = 7
	    socket.on("updatePlayer", function(co){
		    if (players[co].up == true) {
		   	    if (players[co].speedY > -players[co].speed) {
				    players[co].speedY += Math.round((players[co].speed/15));
			    }
		    }
		    if (players[co].down == true) {
			    if (players[co].speedY < players[co].speed) {
			        players[co].speedY -= Math.round((players[co].speed/15));
			    } 
		    }
		    if (players[co].left == true) {
			    if (players[co].speedX > -players[co].speed) {
			        players[co].speedX += Math.round((players[co].speed/15));
			    }
		    }
		    if (players[co].right == true) {
			    if (players[co].speedX < players[co].speed) {
			        players[co].speedX -= Math.round((players[co].speed/15));
			    }  
		    }
		    players[co].x += players[co].speedX; 
		    players[co].y += players[co].speedY; 
		    socket.emit("update", players);
	    })
	    */
	
	/*
	socket.on('respawn', function(a) {
		var x = Math.random() * 17280;
        var y = Math.random() * 18360;
		players[a].x = parseInt(x);
        players[a].y = parseInt(y);
		players[a].health = 0;
		players[a].damage = 0;
		players[a].speed = 0;
		players[a].mass = 40;
		players[a].points = 0;
	})
	*/
	
})
serverInterval = setInterval(serverLoop, 20);
	function serverLoop() {
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
		    	if (players[i].x > 9*1920) {
		    		players[i].x -= 9*1920;
		   		}
		    	if (players[i].x < 0) {
		    		players[i].x += 9*1920;
		    	}
		    	if (players[i].y > 17*1080) {
		    		players[i].y -= 17*1080;
		    	}
		    	if (players[i].y < 0) {
		    		players[i].y += 17*1080;
		    	}
			}
    	}
    	gameSocket.emit("update", players);
	} 

'use strict';
//declare variables & functions
var socket = io.connect(),
gameSocket = socket,
loginSocket = socket;

var toggleSkill = false,
loop,
playerName = "",
co,
id,
userPosX,
userPosY,
mapX,
mapY,
gameScreen = 0,
moveSkill = 110,
healthPoint = 0,
damagePoint = 0,
speedPoint = 0,
healthDigits = 1,
damageDigits = 1,
speedDigits = 1,
canvas = document.getElementById("canvas"),
ctx = canvas.getContext("2d"),
cursorType = "default",
smouseX = 0,
smouseY = 0,
mouseX = 0,
mouseY = 0,
bPoints = [],
energy = {"player":[[]], "currency":[[]]},
energyOrbs = [],
zoomLevel = window.devicePixelRatio,
clientWidth = document.documentElement.clientWidth,
clientHeight = document.documentElement.clientHeight;

var enterSubmit = function(event) {
    if (event.keyCode == 13) {
        cancelAnimationFrame(loop);
        playerName = document.getElementById('userName').value;
        socket.emit("spawn", playerName);
    }
};

var loginClick = function(event){
    event.preventDefault();
    cancelAnimationFrame(loop);
    playerName = document.getElementById('userName').value;
    socket.emit("spawn", playerName);
};

var gameKeydown = function(e) {    
    if (e.keyCode == 38 || e.keyCode == 87) {
        socket.emit("up", co);
    } if (e.keyCode == 40 || e.keyCode == 83) { 
        socket.emit("down", co);
    } if (e.keyCode == 37 || e.keyCode == 65) {
        socket.emit("left", co);
    } if (e.keyCode == 39 || e.keyCode == 68) {
        socket.emit("right", co);
    } if (e.keyCode == 32) {
        toggleSkill = true;
    }
};

var gameKeyup = function(e) {  
    if (e.keyCode == 38 || e.keyCode == 87) {
        socket.emit("up2", co);
    } if (e.keyCode == 40 || e.keyCode == 83) { 
        socket.emit("down2", co);
    } if (e.keyCode == 37 || e.keyCode == 65) {
        socket.emit("left2", co);
    } if (e.keyCode == 39 || e.keyCode == 68) {
        socket.emit("right2", co);
    }
};

var gameMousedown = function(e) {
    socket.emit("click", co, mouseX, mouseY);
    if (moveSkill == 0) {
        if (smouseY > 30 && smouseY < 90) {
            if (smouseX > document.documentElement.clientWidth/2 - 160 && smouseX < document.documentElement.clientWidth/2 - 60) {
                socket.emit("health", co);
            }
            if (smouseX > document.documentElement.clientWidth/2 - 50 && smouseX < document.documentElement.clientWidth/2 + 50) {
                socket.emit("damage", co);
            }
            if (smouseX > document.documentElement.clientWidth/2 + 60 && smouseX < document.documentElement.clientWidth/2 + 160) {
                socket.emit("speed", co);
            }
        }
        for (var curveCount = 0; curveCount < 21; curveCount++) {
            if (smouseY == 10 + curveCount) {
                if (smouseX > document.documentElement.clientWidth/2 - 140 - curveCount && smouseX < document.documentElement.clientWidth/2 - 80 + curveCount) {
                    socket.emit("health", co);
                }
                if (smouseX > document.documentElement.clientWidth/2 - 30 - curveCount && smouseX < document.documentElement.clientWidth/2 + 30 + curveCount) {
                    socket.emit("damage", co);
                } 
                if (smouseX > document.documentElement.clientWidth/2 + 80 - curveCount && smouseX < document.documentElement.clientWidth/2 + 140 + curveCount) {
                    socket.emit("speed", co);
                }
            }
        }
        for (var curveCount = 0; curveCount < 21; curveCount++) {
            if (smouseY == 110 - curveCount) {
                if (smouseX > document.documentElement.clientWidth/2 - 140 - curveCount && smouseX < document.documentElement.clientWidth/2 - 80 + curveCount) {
                    socket.emit("health", co);
                }
                if (smouseX > document.documentElement.clientWidth/2 - 30 - curveCount && smouseX < document.documentElement.clientWidth/2 + 30 + curveCount) {
                    socket.emit("damage", co);
                }
                if (smouseX > document.documentElement.clientWidth/2 + 80 - curveCount && smouseX < document.documentElement.clientWidth/2 + 140 + curveCount) {
                    socket.emit("speed", co);
                }
            }
        }
    }
};

function mouseCoord(event) {
    smouseX = event.clientX;
    smouseY = event.clientY;
    mouseX = event.clientX - clientWidth/2 + userPosX;
    mouseY = -event.clientY + clientHeight/2 + userPosY;
}

setInterval(dynamicVar, 10);
function dynamicVar() {
    zoomLevel = window.devicePixelRatio;
    clientWidth = document.documentElement.clientWidth;
    clientHeight = document.documentElement.clientHeight;
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function rand(value) {
    return Math.random()*value;
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(rand(currentIndex));
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

window.getWidthOfText = function(txt, fontname, fontsize){
    var span = document.createElement('span');
    span.style.fontSize = fontsize;
    span.style.fontFamily = fontname;
    span.innerHTML = txt;
    document.body.appendChild(span);
    var w = span.offsetWidth;
    document.body.removeChild(span);
    return w;
}

function drawImageRot(img,x,y,width,height,deg){
    var rad = deg * Math.PI / 180;
    ctx.translate(x + width / 2, y + height / 2);
    ctx.rotate(rad);
    ctx.drawImage(img,width / 2 * (-1),height / 2 * (-1),width,height);
    ctx.rotate(rad * ( -1 ) );
    ctx.translate((x + width / 2) * (-1), (y + height / 2) * (-1));
}

function drawCurvedRect(rectWidth,rectHeight,rectX,rectY,cornerRadius,color) {
    ctx.beginPath();
    ctx.moveTo(rectX + cornerRadius, rectY);
    ctx.lineTo(rectX + rectWidth - cornerRadius, rectY);
    ctx.arcTo(rectX + rectWidth, rectY, rectX + rectWidth, rectY + cornerRadius, cornerRadius);
    ctx.lineTo(rectX + rectWidth, rectY + rectHeight - cornerRadius);
    ctx.arcTo(rectX + rectWidth, rectY + rectHeight, rectX + rectWidth - cornerRadius, rectY + rectHeight, cornerRadius);
	  ctx.lineTo(rectX + cornerRadius, rectY + rectHeight);
	  ctx.arcTo(rectX, rectY + rectHeight, rectX, rectY + rectHeight - cornerRadius, cornerRadius);
	  ctx.lineTo(rectX, rectY + cornerRadius);
	  ctx.arcTo(rectX, rectY, rectX + cornerRadius, rectY, cornerRadius);
    ctx.lineWidth = 5;
	ctx.strokeStyle = "rgba(0,0,0, 0.1)";
    ctx.stroke();
	  for (var rectCount = 2; rectCount < rectWidth/2; rectCount += 5) {
	      ctx.beginPath();
        ctx.moveTo(rectX + cornerRadius + rectCount, rectY + rectCount);
        ctx.lineTo(rectX + rectWidth - cornerRadius - rectCount, rectY + rectCount);
        ctx.arcTo(rectX + rectWidth - rectCount, rectY + rectCount, rectX + rectWidth - rectCount, rectY + cornerRadius + rectCount, cornerRadius);
        ctx.lineTo(rectX + rectWidth - rectCount, rectY + rectHeight - cornerRadius - rectCount);
	      ctx.arcTo(rectX + rectWidth - rectCount, rectY + rectHeight - rectCount, rectX + rectWidth - cornerRadius - rectCount, rectY + rectHeight - rectCount, cornerRadius);
	      ctx.lineTo(rectX + cornerRadius + rectCount, rectY + rectHeight - rectCount);
	      ctx.arcTo(rectX + rectCount, rectY + rectHeight - rectCount, rectX + rectCount, rectY + rectHeight - cornerRadius - rectCount, cornerRadius);
	      ctx.lineTo(rectX + rectCount, rectY + cornerRadius + rectCount);
	      ctx.arcTo(rectX + rectCount, rectY + rectCount, rectX + cornerRadius + rectCount, rectY + rectCount, cornerRadius);
        ctx.lineWidth = 5;
	      if (color == "red") {
	          ctx.strokeStyle = "rgba(255, 0, 0, 0.1)";
	      } else if (color == "green") {
	          ctx.strokeStyle = "rgba(0, 255, 0, 0.1)";
	      } else if (color == "blue") {
	          ctx.strokeStyle = "rgba(0, 0, 255, 0.1)";
	      }
        ctx.stroke();
	  }
}


function drawPlayer(x,y,mass,color) {
    //body
    var grd=ctx.createRadialGradient(x,y,0,x,y,mass);
    grd.addColorStop(0,color);
    grd.addColorStop(1,"black");
    ctx.beginPath();
    ctx.fillStyle=grd;
    ctx.arc(x, y, mass/zoomLevel, 0, 2*Math.PI);
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.stroke();
    //white ball
    ctx.beginPath();
    ctx.arc(x, y, (mass/3)/zoomLevel, 0, 2*Math.PI)
    ctx.lineWidth = 1;
    ctx.strokeStyle = "white";
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.stroke();
}

function backgroundPoints(width1, height1, width2, height2, numPoint) {
    if (bPoints.length == 0) {
        for (var i = 0; i < Math.ceil(rand(10))+numPoint; i++) {
            var j = Math.round(rand(width2))+width1;
            var k = Math.round(rand(height2))+height1;
            var l = Math.floor(rand(4)) + 1;
            ctx.beginPath();
            ctx.arc(j, k, l, 0, 2*Math.PI);
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.lineWidth = 0;
            ctx.stroke();
            //[x,y,radius,speedx,speedy]
            bPoints.push([j,k,l,0,0]);
        }
    } else {
        for (var i = 0; i < bPoints.length; i++) {
            bPoints[i][3] += (Math.floor(rand(3)) - 1)/15;
            bPoints[i][4] += (Math.floor(rand(3)) - 1)/15;
            if (bPoints[i][0] > width2) {
                bPoints[i][0] = width1 + bPoints[i][2];
            } else if (bPoints[i][0] < width1) {
                bPoints[i][0] = width2 - bPoints[i][2];
            }
            if (bPoints[i][1] > height2) {
                bPoints[i][1] = height1 + bPoints[i][2];
            } else if (bPoints[i][1] < height1) {
                bPoints[i][1] = height2 - bPoints[i][2];
            }
            if (bPoints[i][3] > 2) {
                bPoints[i][3] = 1;
            } else if (bPoints[i][3] < -2) {
                bPoints[i][3] = -1;
            }
            if (bPoints[i][4] > 2) {
                bPoints[i][4] = 1;
            } else if (bPoints[i][4] < -2) {
                bPoints[i][4] = -1;
            }
            bPoints[i][0] += bPoints[i][3];
            bPoints[i][1] += bPoints[i][4];
            ctx.beginPath();
            ctx.arc(bPoints[i][0], bPoints[i][1], bPoints[i][2], 0, 2*Math.PI);
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.lineWidth = 0;
            ctx.stroke();
        }
    }
}

//energy[type][id][point].property
function energyBall(x,y,radius,c,type,id,sp) {
    var r = rand(10)-5 + radius;
    var pointNum = r*(3/10);
    var randLvl = 5;
    if (energy[type][id] == undefined) {
        energy[type][id] = [];
    }
    for (var i=0;i < pointNum;i++) {
        var bCos = ((Math.PI*2)/pointNum);
        var bSin = ((Math.PI*2)/pointNum);
        energy[type][id].push({
            "ox": x,
            "oy": y,
            "x": x + r * Math.cos(bCos*i)-randLvl/2 + randLvl*(Math.floor(rand(2))),
            "y": y + r * Math.sin(bSin*i)-randLvl/2 + randLvl*(Math.floor(rand(2)))
        });
        if (energy[type][id].length >= pointNum*sp) {
            energy[type][id].shift();
        }
        for (var j = 0; j < energy[type][id].length; j++) {
            energy[type][id][j].x += x - energy[type][id][j].ox; 
            energy[type][id][j].ox = x;
            energy[type][id][j].y += y - energy[type][id][j].oy; 
            energy[type][id][j].oy = y;
        }
    }
    ctx.beginPath();

    ctx.moveTo(energy[type][id][0].x, energy[type][id][0].y);
    for (var i = 0; i < energy[type][id].length - 2; i ++) {
        var xc = (energy[type][id][i].x + energy[type][id][i + 1].x) / 2;
        var yc = (energy[type][id][i].y + energy[type][id][i + 1].y) / 2;
        ctx.quadraticCurveTo(energy[type][id][i].x, energy[type][id][i].y, xc, yc);
    }
    ctx.quadraticCurveTo(energy[type][id][i].x, energy[type][id][i].y, energy[type][id][0].x, energy[type][id][0].y);

    ctx.lineWidth = 1;
    ctx.strokeStyle = c;
    ctx.fillStyle = c;
    ctx.fill();
    ctx.stroke();
    if (type == "player") {
        r = radius+randLvl;
        ctx.beginPath();
        ctx.arc(x,y,r,0,2*Math.PI)
        ctx.lineWidth = 1;
        ctx.strokeStyle = c;
        ctx.fillStyle = c;
        ctx.fill();
        ctx.stroke();
    }
}

function edgeFix() {
    //left
    if (userPosX - clientWidth/2 < 0) {
        if (mouseX < 0) {
            mouseX += mapX;
        } 
        for (var i = 0; i < energyOrbs.length; i++) {
            if (energyOrbs[i].x > mapX - clientWidth/2) {
                energyOrbs[i].x -= mapX;
            }
        }
        for (var i = 0; i < users.length; i++) {
            if (users[i] != undefined) {
                if (users[i].x > mapX - clientWidth/2) {
                    users[i].x -= mapX;
                }
            }
        }
    }
    //right
    if (userPosX + clientWidth/2 > mapX) {
        if (mouseX > mapX) {
            mouseX -= mapX;
        } 
        for (var i = 0; i < energyOrbs.length; i++) {
            if (energyOrbs[i].x < 0 + clientWidth/2) {
                energyOrbs[i].x += mapX;
            }
        }
        for (var i = 0; i < users.length; i++) {
            if (users[i] != undefined) {
                if (users[i].x < 0 + clientWidth/2) {
                    users[i].x += mapX;
                }
            }
        }
    }
    //bottom
    if (userPosY - clientHeight/2 < 0) {
        if (mouseY < 0) {
            mouseY += mapY;
        } 
        for (var i = 0; i < energyOrbs.length; i++) {
            if (energyOrbs[i].y > mapY - clientHeight/2) {
                energyOrbs[i].y -= mapY;
            }
        }
        for (var i = 0; i < users.length; i++) {
            if (users[i] != undefined) {
                if (users[i].y > mapY - clientHeight/2) {
                    users[i].y -= mapY;
                }
            }
        }
    }
    //top
    if (userPosY + clientHeight/2 > mapY) {
        if (mouseY > mapY) {
            mouseY -= mapY;
        } 
        for (var i = 0; i < energyOrbs.length; i++) {
            if (energyOrbs[i].y < 0 + clientHeight/2) {
                energyOrbs[i].y += mapY;
            }
        }
        for (var i = 0; i < users.length; i++) {
            if (users[i] != undefined) {
                if (users[i].y < 0 + clientHeight/2) {
                    users[i].y += mapY;
                }
            }
        }
    }
}




















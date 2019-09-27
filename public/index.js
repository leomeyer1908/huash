//Loading Up the Game...
socket.on("load", function() {
    document.addEventListener("mousemove", function(event){
        mouseCoord(event);
        edgeFix();
    });
    setup();
});
function setup(){
    gameScreen = 0;
    bPoints = [];
    console.log(gameSocket)
    loginSocket = io('/login');
    gameSocket = socket;
    console.log(gameSocket)
    document.getElementById("userName").addEventListener("keydown", enterSubmit);
    document.getElementById("submit").addEventListener("click", loginClick);

    document.getElementById("userName").focus();

    loop = requestAnimationFrame(loginLoop);
    document.getElementById("userName").style.display = "inline";
    document.getElementById("submit").style.display = "inline";
    document.getElementById("canvas").style.display = "inline";
 }

//Login Screen
function loginLoop() {
    loop = requestAnimationFrame(loginLoop);
    clear();
    canvas.width = clientWidth;
    canvas.height = clientHeight;
    ctx.globalCompositeOperation = "source-over";
    //"userName"
    document.getElementById("userName").style.width = 280/zoomLevel + "px";
    document.getElementById("userName").style.height = 35/zoomLevel + "px";
    document.getElementById("userName").style.borderRadius = 10/zoomLevel + "px";
    document.getElementById("userName").style.fontSize = 24/zoomLevel + "px";
    document.getElementById("userName").style.marginLeft = clientWidth/2 - 145/zoomLevel + "px";
    document.getElementById("userName").style.marginTop = clientHeight/2 - 74.5/zoomLevel + "px";
    document.getElementById("userName").style.border = 5/zoomLevel + "px solid black";
    //"submit"
    document.getElementById("submit").style.width = 200/zoomLevel + "px";
    document.getElementById("submit").style.height = 40/zoomLevel + "px";
    document.getElementById("submit").style.borderRadius = 10/zoomLevel + "px";
    document.getElementById("submit").style.marginLeft = clientWidth/2 - 100/zoomLevel + "px";
    document.getElementById("submit").style.fontSize = 24/zoomLevel + "px";
    //makes userName bigger if player types more than 280px
    if (getWidthOfText(document.getElementById("userName").value, "arial", "24px") > 280) {
        document.getElementById("userName").style.width = getWidthOfText(document.getElementById("userName").value, "arial", "24px")/zoomLevel + "px";
        document.getElementById("userName").style.marginLeft = clientWidth/2 - (getWidthOfText(document.getElementById("userName").value, "arial", "24px")/2 + 5)/zoomLevel + "px";
    }
    backgroundPoints(0,0,clientWidth,clientHeight,30);
}

//spawn
socket.on('welcome', function(currentPlayers, players, playerNumber){
    users = [];
    for (o = 0; players.length > o; o++) {
        users.push(players[o]);
    }
    id = playerNumber;
    co = id;
    console.log(users);
    health = users[co].health;
    damage = users[co].damage;
    speed = users[co].speed;
    userPosX = users[co].x;
    userPosY = users[co].y;
    mass = users[co].mass;
    start();
})

function start() {
    gameSocket = io('/game');
    loginSocket = socket;

    document.getElementById("userName").removeEventListener("keydown", enterSubmit);
    document.getElementById("submit").removeEventListener("click", loginClick);
    document.getElementById("userName").style.display = "none";
    document.getElementById("submit").style.display = "none";

    bPoints = [];
    healthPoint = 0;
    damagePoint = 0;
    speedPoint = 0;
    healthDigits = 1;
    damageDigits = 1;
    speedDigits = 1;
    speedX = 0;
    speedY = 0;
    speedX2 = 0;
    speedY2 = 0;
    moveX = 0;
    moveY = 0;
    playerSX = document.documentElement.clientWidth/2 - 20;
    playerSY = document.documentElement.clientHeight/2 - 20;
    console.log(users[co].health);

    document.addEventListener('keydown', gameKeydown);
    document.addEventListener('keyup', gameKeyup);
    document.addEventListener('mousedown', gameMousedown);

    gameScreen = 1;
    loop = requestAnimationFrame(updateGame);
    function updateGame() {
        loop = requestAnimationFrame(updateGame);
        socket.emit("updateGame");
    }

}
socket.on("update", function(players, energyO, mX, mY){
    if (gameScreen == 1) {
        users = [];
        energyOrbs = [];
        mapX = mX;
        mapY = mY;
        for (var i = 0; i < energyO.length; i++) {
            energyOrbs.push(energyO[i]);
        }
        for (var o = 0; players.length > o; o++) {
            users.push(players[o]);
            if (users[o].id == id) {
                co = o;
                playerName = users[o].name;
                userPosX = users[o].x;
                userPosY = users[o].y;
                mass = users[o].mass;
                money = users[o].points;
                healthPoint = users[o].tHealth;
                healthDigits = Math.floor(Math.log(healthPoint) / Math.LN10 + 1);
                damagePoint = users[o].damage;
                damageDigits = Math.floor(Math.log(damagePoint) / Math.LN10 + 1);
                speedPoint = users[o].speed;
                speedDigits = Math.floor(Math.log(speedPoint) / Math.LN10 + 1);
                healthBar = users[o].health;
                speedX = users[o].speedX;
                speedY = -users[o].speedY;
                moveX = users[o].moveX;
                moveY = users[o].moveY;
            }
        }
        if (users[co] != undefined && users[co] != null && users[co].id == id) {
            console.log("coocoo")
            gameLoop();
        } else {
            console.log("medead");
            cancelAnimationFrame(loop);
            document.removeEventListener('keydown', gameKeydown);
            document.removeEventListener('keyup', gameKeyup);
            document.removeEventListener('mousedown', gameMousedown);
            //socket.removeAllListeners("update");
            setup();
        }
    }
})

function gameLoop() {
    clear();
    edgeFix();
    socket.emit("moveMouse", co, mouseX, mouseY, smouseX, smouseY);
    canvas.style.cursor = "default";
    if (speedX2 <= 50 && speedX2 >= -50) {
        if (speedX > speedX2) {
            speedX2++;
        } else if (speedX < speedX2) {
            speedX2--;
        }

    }
    if (speedY2 <= 50 && speedY2 >= -50) {
        if (speedY > speedY2) {
            speedY2++;
        } else if (speedY < speedY2) {
            speedY2--;
        }
    }


    backgroundPoints(-clientWidth, -clientHeight, clientWidth*2, clientHeight*2, 300);
    for (var i = 0; i < bPoints.length; i++) {
        bPoints[i][0] -= speedX;
        bPoints[i][1] -= speedY;
    }

    drawPlayer(clientWidth/2 + speedX2, clientHeight/2 + speedY2, mass/zoomLevel, "blue");

    for (var i = 0; i < energyOrbs.length; i++) {
        energyBall(clientWidth/2 + energyOrbs[i].x-userPosX, clientHeight/2 - energyOrbs[i].y+userPosY, 7.5, energyOrbs[i].color, "currency", i, 30);
    }
    ctx.font="16px arial";
    ctx.fillStyle="rgba(255,255,255,0.8)";
    ctx.fillText(playerName,
        clientWidth/2 - Math.round(getWidthOfText(playerName, "arial", "16px")/2) + speedX2,
        clientHeight/2 - users[co].mass/2 - 4 + speedY2
    );

    //enemies
    for (var i = 0; i < users.length; i++) {
        if (i != co && users[i] != undefined && users[i] != null){
            drawPlayer(
                clientWidth/2 + (users[i].x - userPosX)/zoomLevel,
                clientHeight/2 + (-users[i].y + userPosY)/zoomLevel,
                users[i].mass,
                "red"
            );
            ctx.font="16px arial";
            ctx.fillStyle="rgba(255,255,255,0.8)";
            ctx.fillText(users[i].name,
                clientWidth/2 - Math.round(getWidthOfText(users[i].name, "arial", "16px")/2 + userPosX - users[i].x),
                clientHeight/2 - users[i].mass/2 - users[i].mass/10 - users[i].y + userPosY
            );
        }
    }

    //skill bars
    if (toggleSkill == true) {
        if (moveSkill == 0) {
            for (var i = 0; i < 11; i++) {
                setTimeout(function(){
                    moveSkill += 10;
                },i*10);
            }
            toggleSkill = false;
        }
        if (moveSkill == 110) {
            for (var i = 0; i < 11; i++) {
                setTimeout(function(){
                    moveSkill -= 10;
                },i*10);
            }
            toggleSkill = false;
        }
    }
    drawSkillRect(100,100,document.documentElement.clientWidth/2 - 160,10 - moveSkill,20,"rgba(255, 0, 0, 0.1)");
    drawSkillRect(100,100,document.documentElement.clientWidth/2 - 50,10 - moveSkill,20,"rgba(0, 255, 0, 0.1)");
    drawSkillRect(100,100,document.documentElement.clientWidth/2 + 60,10 - moveSkill,20,"rgba(0, 0, 255, 0.1)");
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.font = "20px Arial";
    ctx.fillText("Health",document.documentElement.clientWidth/2 - 140,33 - moveSkill); //fr
    ctx.fillText("Damage",document.documentElement.clientWidth/2 - 38,33 - moveSkill); //fr
    ctx.fillText("Speed",document.documentElement.clientWidth/2 + 80,33 - moveSkill); //fr
    ctx.font = "40px Arial";
    ctx.fillText(healthPoint,document.documentElement.clientWidth/2 - 110 - (healthDigits*11),75 - moveSkill);
    ctx.fillText(damagePoint,document.documentElement.clientWidth/2 - (damageDigits*11),75 - moveSkill);
    ctx.fillText(speedPoint,document.documentElement.clientWidth/2 + 110 - (speedDigits*11),75 - moveSkill);

    ctx.font = "15px Arial";
    if (money > 0) {
      ctx.fillText('Press "space" to upgrade skills (' + money + ' points) ', document.documentElement.clientWidth/2 -135, 130 - moveSkill); //fr
    }
    if (moveSkill == 0) {
        if (smouseY > 30 && smouseY < 90) {
            if (smouseX > document.documentElement.clientWidth/2 - 160 && smouseX < document.documentElement.clientWidth/2 - 60) {
                canvas.style.cursor = "pointer";
            }
            if (smouseX > document.documentElement.clientWidth/2 - 50 && smouseX < document.documentElement.clientWidth/2 + 50) {
                canvas.style.cursor = "pointer";
            }
            if (smouseX > document.documentElement.clientWidth/2 + 60 && smouseX < document.documentElement.clientWidth/2 + 160) {
                canvas.style.cursor = "pointer";
            }
        }
        for (var curveCount = 0; curveCount < 21; curveCount++) {
            if (smouseY == 10 + curveCount) {
                if (smouseX > document.documentElement.clientWidth/2 - 140 - curveCount && smouseX < document.documentElement.clientWidth/2 - 80 + curveCount) {
                    canvas.style.cursor = "pointer";
                }
                if (smouseX > document.documentElement.clientWidth/2 - 30 - curveCount && smouseX < document.documentElement.clientWidth/2 + 30 + curveCount) {
                    canvas.style.cursor = "pointer";
                }
                if (smouseX > document.documentElement.clientWidth/2 + 80 - curveCount && smouseX < document.documentElement.clientWidth/2 + 140 + curveCount) {
                    canvas.style.cursor = "pointer";
                }
            }
        }
        for (var curveCount = 0; curveCount < 21; curveCount++) {
            if (smouseY == 110 - curveCount) {
                if (smouseX > document.documentElement.clientWidth/2 - 140 - curveCount && smouseX < document.documentElement.clientWidth/2 - 80 + curveCount) {
                    canvas.style.cursor = "pointer";
                }
                if (smouseX > document.documentElement.clientWidth/2 - 30 - curveCount && smouseX < document.documentElement.clientWidth/2 + 30 + curveCount) {
                    canvas.style.cursor = "pointer";
                }
                if (smouseX > document.documentElement.clientWidth/2 + 80 - curveCount && smouseX < document.documentElement.clientWidth/2 + 140 + curveCount) {
                    canvas.style.cursor = "pointer";
                }
            }
        }
    }
    //leaderboard
    ctx.roundRect(clientWidth*0.84,clientHeight*0.01,clientWidth*0.15,clientHeight*0.4,4,"rgba(100,100,100,0.6)").fill();
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Leaderboard",window.getWidthOfText("Leaderboard", "arial", "20px")*0.42 + clientWidth*0.84,clientHeight*0.05);
    sortLeaderboard(8);
    //show position
    ctx.font = "25px ComicSans";
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fillText("X: ".split("").join(String.fromCharCode(8202)) + userPosX, 10, 25);
    ctx.fillText("Y: ".split("").join(String.fromCharCode(8202)) + userPosY, 10, 50);
}

/* ******************************* Classes ******************************* */

class Player{
    constructor(x, y, radius, color){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

class Projectile{
    constructor(x, y, radius, color, dx = 0, dy = 0){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = dx;
        this.dy = dy;
        this.id = generateUniqueId();
        
    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
    update(){
        this.x += this.dx;
        this.y += this.dy;
        if(this.x - this.radius < 0 || this.x + this.radius > canvas.width || this.y - this.radius < 0 || this.y + this.radius > canvas.height){
            delete projectiles[this.id];
        }
        for (let i in bots){
            if(getDistance(this.x, this.y, bots[i].x, bots[i].y) < this.radius + bots[i].radius){
                bots[i].radius -= 20;
                score +=5;
                
                if(bots[i].radius < 20){
                    bots[i].radius = 20;
                    score += 5;
                }
                delete projectiles[this.id];
                explodeFunction(bots[i].color, this.x, this.y);
            }
        }
        
        this.draw();
    }
}

class Bot{
    constructor(x, y, radius, color, dx = 0, dy = 0){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = dx;
        this.dy = dy;
        this.id = generateUniqueId();

    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
    update(){
        this.x += this.dx;
        this.y += this.dy;
        if(this.radius <= 20){
            delete bots[this.id];
        }
        if(getDistance(this.x, this.y, player.x, player.y) < player.radius + this.radius){
            player.radius -= 10;
            score -= 5;

            explodeFunction(this.color, this.x, this.y);
            if(player.radius < 10){
                player.radius = 10;
                restart(`You Lost!<br><br>Your Score Is: ${score}`,'Restart')
            }
            delete bots[this.id];
        }
        
        this.draw();
    }
}

class Explode{
    constructor(x, y, radius, color, velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.friction = 0.99;
        this.gravity = 0.1;
        this.id = generateUniqueId();
        
    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();

    }
    update(){
        this.x += this.velocity.x;
        this.velocity.x *= this.friction;
        this.y += this.velocity.y;
        this.velocity.y += this.gravity;
        if(this.y + this.radius > canvas.height){
            delete explodes[this.id];
        }
        
        this.draw();
    }
}

/* ******************************* Functions ******************************* */

function animate(){
    if(work){
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // ctx.clearRect(0, 0, canvas.width, canvas.height); // Clears the canvas

        player.draw();

    for(let i in projectiles){
            projectiles[i].update();
        }

        for(let i in bots){
            bots[i].update();
        }

        for(let i in explodes){
            explodes[i].update();
        }

        if(Object.keys(bots).length == 0){
            maxBots += 5;
            createBots();
        }
        scoreElement.innerHTML = score;
    }
    requestAnimationFrame(animate)
    
}

function getDistance(x1, y1, x2, y2){
    let xDistance = x2 - x1;
    let yDistance = y2 - y1;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

function rgb(){
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r},${g},${b})`;
}

function createBots(){
    for(let i = 0; i < maxBots; i++){
        var radius = Math.round(Math.random() * 20 + 30);
        random = Math.round(Math.random() * 3)
        switch(random){
            case 0:
                var x = Math.random() * canvas.width;
                var y = canvas.height + radius + Math.random() * 500 + 500;
                break;
            case 1:
                var x = Math.random() * canvas.width;
                var y = -radius - Math.random() * 500 -  500;
                break;
            case 2:
                var x = canvas.width + radius + Math.random() * 500 + 500;
                var y = Math.random() * canvas.height;
                break;
            case 3:
                var x = -radius - Math.random() * 500 - 500; 
                var y = Math.random() * canvas.height;
                break;
        }
        var color = rgb();
        var angle = Math.atan2(canvas.height/2 - y, canvas.width/2 - x);
        var speed = Math.random() * 2 +1;
        var dx = Math.cos(angle) * speed;
        var dy = Math.sin(angle) * speed;

        var bot = new Bot(x, y, radius, color, dx, dy);
        bots[bot.id] = bot;
    }
}

function generateUniqueId() {
    return Math.random().toString(36);
}

function restart(text,restart){
    for(let i =0;i<50;i++){
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    document.querySelector('.text').innerHTML = text;
    document.querySelector('.restart').innerHTML = restart;
    document.querySelector('.popup').style.display = 'flex';
    setTimeout(function() {
        document.querySelector('.popup').style.opacity = '1';
        document.querySelector('.content').style.opacity = '1';
        document.querySelector('.content').style.transform = 'translateY(0)';
    }, 50);
    work = false;
    document.querySelector('.restart').addEventListener('click',event=>{
        setTimeout(function(){init()},700);
        document.querySelector('.popup').style.opacity = '0';
        document.querySelector('.content').style.opacity = '0';
        document.querySelector('.content').style.transform = 'translateY(-20px)';
        setTimeout(function() {
            document.querySelector('.popup').style.display = 'none';
        },500)
    })
}

function init(){

    score = 0;
    scoreElement = document.getElementById('score');

    player = new Player(canvas.width/2, canvas.height/2, 100, 'white');

    projectiles = {};

    bots = {};
    maxBots = 10;
    work = true
    explodes = {};
    createBots();    
}

function explodeFunction(color, x, y){
    const fireworksCount = 30;
    const angle = (Math.PI * 2) / fireworksCount;
    for(let i = 0; i < fireworksCount; i++){
        let radius = Math.random() * 3 + 1;

        var explode = new Explode(x, y, radius, color, {
            x: Math.cos(angle * i) * (Math.random() * 10),
            y: Math.sin(angle * i) * (Math.random() * 10)
        });
        explodes[explode.id] = explode;
    }
}

document.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
})

document.addEventListener('click', function(event){
    
    var x = canvas.width/2;
    var y = canvas.height/2;
    var radius = 10;
    var color = "red";
    var angle = Math.atan2(mouse.y - y, mouse.x - x);
    var dx = Math.cos(angle) * 10;
    var dy = Math.sin(angle) * 10;
    var projectile = new Projectile(x, y, radius, color, dx, dy);

    projectiles[projectile.id] = projectile;
});

/* ******************************* Implimentations ******************************* */

const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');

var mouse = {x: canvas.width/2, y: canvas.height/2};

var score ;
var scoreElement;
var player;
var projectiles;
var bots;
var maxBots;
var work;
var explodes = {};
init();
animate();
restart("Let's Play","Play");
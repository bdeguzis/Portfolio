var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var ballRadius = 10;
var ballColor = "#0095DD";
var ballSpeed = 1.5;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth) / 2;
var paddleY = canvas.height - paddleHeight*2;
var rightPressed = false;
var leftPressed = false;
var rPressed = false;
var firstPlay = true;

var bricksAlive = 0;
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];

var score = 0;

for (var c = 0; c < brickColumnCount; c++)
{
  bricks[c] = [];
  for (var r = 0; r < brickRowCount; r++)
  {
    bricks[c][r] = { x: 0, y: 0, color: randomColor(), alive: 1};
    bricksAlive++;
  }
}

function getRandomInt(max)
{
  return Math.floor(Math.random() * Math.floor(max));
}

function randomColor()
{
  return "rgba("+getRandomInt(255)+","+getRandomInt(255)+","+getRandomInt(255)+",1)";
}

function drawBorder()
{
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.stroke();
  ctx.closePath();
}

function drawBall()
{
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = ballColor;
  ctx.fill();
  ctx.closePath();
}

function drawPaddle()
{
  ctx.beginPath();
  ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBricks()
{
  for (var c = 0; c < brickColumnCount; c++)
  {
    for (var r = 0; r < brickRowCount; r++)
    {
      if (bricks[c][r].alive == 1)
      {
        var brickX = (c*(brickWidth+brickPadding)) + brickOffsetLeft;
        var brickY = (r*(brickHeight+brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = bricks[c][r].color;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawScore()
{
  ctx.font = "16px Arial";
  ctx.fillStyle = "#17aa82";
  ctx.fillText("Score: "+ score, 8, 20);
}

function gameOver()
{
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "50px Arial";
  ctx.fillStyle = "red";
  ctx.fillText("GAME OVER", canvas.width/5.5, canvas.height/2);
  ctx.fillStyle = "#17aa82";
  ctx.font = "20px Arial";
  ctx.fillText("Score: "+score, (canvas.width/2)-45, (canvas.height/2)+50);
  ctx.font = "23px Arial";
  ctx.fillText("Press r to retry", (canvas.width/2)-80, (canvas.height/2)+125);
  if (rPressed == true)
  {
    bricksAlive = 0;
    newGame();
  }
}

function winCondition()
{
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "50px Arial";
  ctx.fillStyle = "#17aa82";
  ctx.fillText("YOU WIN!", (canvas.width/5)+22, canvas.height/2);
  ctx.font = "20px Arial";
  ctx.fillText("Score: "+score, (canvas.width/2)-45, (canvas.height/2)+50);
  ctx.font = "23px Arial";
  ctx.fillText("Press r to retry", (canvas.width/2)-80, (canvas.height/2)+125);
  if (rPressed == true)
  {
    newGame();
  }
}

function newGame()
{
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  score = 0;
  ballSpeed = 1.5;
  x = canvas.width / 2;
  y = canvas.height - 30;
  dx = 2;
  dy = -2;
  for (var c = 0; c < brickColumnCount; c++)
  {
    for (var r = 0; r < brickRowCount; r++)
    {
       bricks[c][r].alive = 1;
       bricksAlive++;
     }
   }

}

function startScreen()
{
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "50px Arial";
  ctx.fillStyle = "#17aa82";
  ctx.fillText("Brickbreaker", (canvas.width/5), canvas.height/2);
  ctx.font = "20px Arial";
  ctx.fillText("Press r to play", (canvas.width/2)-80, (canvas.height/2)+125);
  if (rPressed == true)
    {
      firstPlay = false;
      newGame();
    }
}

function collisionDetection()
{
  if (((x + ballRadius) >= canvas.width) || ((x - ballRadius) <= 0))
  {
    dx = -dx;
  }
  if ((y - ballRadius) <= 0)
  {
    dy = -dy;
  }
  if (x > paddleX && x < paddleX + paddleWidth && y > paddleY && y < paddleY + paddleHeight)
  {
    dy = -dy;
  }
  else if ((y + ballRadius) >= canvas.height)
  {
    gameOver();
  }

  for (var c = 0; c < brickColumnCount; c++)
  {
    for (var r = 0; r < brickRowCount; r++)
    {
      var b = bricks[c][r];
      if (b.alive == 1)
      {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight)
        {
          dy = -dy;
          b.alive = 0;
          ballColor = b.color;
          score += 5;
          bricksAlive--;
          ballSpeed += .1;
        }
      }
    }
  }

}

function draw()
{
  if (firstPlay)
  {
    startScreen();
  }
  else
  {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBorder();
    drawBall();
    drawPaddle();
    drawBricks();
    drawScore();
    collisionDetection();

    x += (dx*ballSpeed);
    y += (dy*ballSpeed);

    if (rightPressed && paddleX < canvas.width-paddleWidth)
    {
      paddleX += 7;
    }
    else if (leftPressed && paddleX > 0)
    {
      paddleX -= 7;
    }

    if (bricksAlive == 0)
    {
      winCondition();
    }
  }
  requestAnimationFrame(draw);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e)
{
  if (e.keyCode == 39)
  {
    rightPressed = true;
  }
  else if (e.keyCode == 37)
  {
    leftPressed = true;
  }
  else if (e.keyCode == 82)
  {
    rPressed = true;
  }
}

function keyUpHandler(e)
{
  if (e.keyCode == 39)
  {
    rightPressed = false;
  }
  else if (e.keyCode == 37)
  {
    leftPressed = false;
  }
  else if (e.keyCode == 82)
  {
    rPressed = false;
  }
}

draw();

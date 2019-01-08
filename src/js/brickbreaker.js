var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var ballRadius = 10;
var ballColor = "#0095DD";
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth) / 2;
var paddleY = canvas.height - paddleHeight*2;
var rightPressed = false;
var leftPressed = false;

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];
for (var c = 0; c < brickColumnCount; c++)
{
  bricks[c] = [];
  for (var r = 0; r < brickRowCount; r++)
  {
    bricks[c][r] = { x: 0, y: 0, color: randomColor(), alive: 1};
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
    alert("GAME OVER");
    document.location.reload();
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
        }
      }
    }
  }

}

function draw()
{
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBorder();
  drawBall();
  drawPaddle();
  drawBricks();
  collisionDetection();
  x += dx;
  y += dy;
  if (rightPressed && paddleX < canvas.width-paddleWidth)
  {
    paddleX += 7;
  }
  else if (leftPressed && paddleX > 0)
  {
    paddleX -= 7;
  }
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
}

setInterval(draw, 10);

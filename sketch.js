const fps = 30;
var pigAnim, pigDeadAnim, pigSprite, pigHappyAnim, pig_w, pig_h;
var windmill, windmillSprite, windmill_img;
var bg;
var happy2019, h2019_w, h2019_h, h2019_x, h2019_y, h2019_hidden;
var clouds, cloud, s_cloud;
var deClouds;
var earchSprite, earthImg;
var bricks = [];
var brick_img;
const foodImages = [];
const foodNames = ["tile000.png", "tile003.png", "tile006.png", "tile009.png","tile001.png", "tile004.png", "tile007.png", "tile010.png","tile002.png", "tile005.png", "tile008.png", "tile011.png"];
const coinsNames = ["coin002.png", "coin005.png", "redpocket002.png", "coin004.png", "redpocket001.png"];
const coinsImages = [];
var smokeImg;
var foods = [];
var coins = [];
var smokes = [];
const foodFallTime = 3;
var credit_img, credit;
const laternImages = [];
const laternXpos = [];
var lanterns = [];

var fworksAnims=[], fPos=[], nightColor=99;

function preload()
{
    // bg = loadImage('img/frame_001_delay-0.04s.jpg')
    //src:http://www.51miz.com/muban/180979.html
    happy2019 = loadImage('img/title.png')
    // src:http://www.cadnav.com/3d-models/model-45981.html

    //https://www.mcftech.com/wp-content/uploads/2015/07/Paper-Clouds-App-Audit.png
    clouds = loadImage('img/clouds.png')
    cloud = loadImage('img/cloud.png');
    s_cloud = loadImage('img/s_cloud.png');

    for(let i=0; i<foodNames.length; i++)
    {
        const img = loadImage('img/foods/'+foodNames[i]);
        foodImages.push(img);
    }
    for(let i=0; i<coinsNames.length; i++)
    {
        const img = loadImage('img/coins/'+coinsNames[i]);
        coinsImages.push(img);
    }


    pigAnim = loadAnimation('./img/pig/nowing-red012.png', './img/pig/nowing-red013.png');
    pigHappyAnim = loadAnimation('./img/pig/smile012.png', './img/pig/smile013.png');
    pigDeadAnim = loadAnimation('./img/pig/nowing-red-dead.png');

    earthImg = loadImage('img/earth_nobg.png');

    windmill_img = loadImage('img/windmill.png');
    smokeImg = loadImage('img/smoke.png');

    //https://vignette2.wikia.nocookie.net/supermarioorigins/images/5/58/Brick.png
    brick_img = loadImage('img/brick.png');

    //src: https://www.richgreenart.com/blog-richgreenart/2018/7/16/earth-love-10-logo-design-process

    credit_img = loadImage('img/credit.png');

    laternImages.push( loadImage('img/yellow2-lantern.png') )
    laternImages.push( loadImage('img/red2-lantern.png') )
    laternImages.push( loadImage('img/yellow1-lantern.png') )
    laternImages.push( loadImage('img/red1-lantern.png') )

    fworksAnims = [
        loadAnimation('./img/firework/f_001.png', './img/firework/f_010.png'),
        loadAnimation('./img/firework/r_002.png', './img/firework/r_010.png'),
        loadAnimation('./img/firework/b_002.png', './img/firework/b_010.png')
    ];
}

function setup()
{
    createCanvas(min(windowWidth,600), windowHeight);
    frameRate(fps);
    // windmill = new Windmill();

    h2019_w = width*.51;
    h2019_h = h2019_w*happy2019.height/happy2019.width;

    // pig_w = width*.45;
    // pig_h = pig_w*pig_img.height/pig_img.width;


    deClouds = CloudsFunc();


    earchSprite = createSprite(0,0);
    earchSprite.addImage('idle', earthImg);

    earchSprite.position.x = width*.5;
    earchSprite.position.y = earchSprite.y0 = height+50;
    earchSprite.rotationSpeed = -.05510;
    earchSprite.scale = (width / 551.0);
    earchSprite.draw0 = earchSprite.draw;
    earchSprite.draw = function(){
        push();
            translate(0,-100);
            this.draw0();
        pop();
    }

    windmill = new WindmillwithSprite(
        createSprite(width*.9, height*.4),
        windmill_img
    )

    pigSprite = new PigWithSprite(
        createSprite(width*.5, height*.5, 100,100),
        pigAnim, pigDeadAnim, pigHappyAnim
    )


    h2019_x = 6;
    h2019_y = 20;

    credit = createSprite(-credit_img.width);
    credit.addImage('hot', credit_img);
    credit.dScale = (width/credit_img.width);
    credit.position.set(width*.5, height*.45);
    credit.scale = 0;


    laternXpos.push(width*.1);
    laternXpos.push(width*random(.13,.5));
    laternXpos.push(width*random(.63,.83));
    laternXpos.push(width);
    lanterns = laternImages.map( (img, i)=> {
        s = createSprite();
        s.addImage('hot', img);
        s.scale = (width/img.width*.25)
        s.position.set(laternXpos[i], img.height*.5*s.scale);
        s.dPosition = s.position.copy();
        s.position.set(laternXpos[i], -img.height*.5);
        return s
    });

    fworksAnims.map(a => {a.goToFrame(a.getLastFrame()); a.looping = false;});
    fPos = [
        createVector(0,0),
        createVector(0,0),
        createVector(0,0),
    ]

    noStroke();
}

function update()
{
    deClouds.update();


    // someSprite.position.y = 450 + sin(frameCount*0.05)*70;

    bricks = bricks.filter( b => !pigSprite.overlapBrick(b) );
    foods = foods.filter( f => !pigSprite.overlapFood(f) );
    coins = coins.filter( c => !pigSprite.overlapCoins(c) );
    smokes = smokes.filter( s => !pigSprite.overlapSmoke(s) );

    h2019_hidden
        && !foods.length
        && !bricks.length
        && !coins.length
        && !smokes.length
        && happy2019In();


}

function draw()
{
    update();
    clear();

    if(nightColor<99)
    {
        background(nightColor);
        fworksAnims.map( (a,i) => animation(a, fPos[i].x, fPos[i].y) );
        drawSprites();
        image(happy2019, h2019_x, h2019_y, h2019_w, h2019_h);
    }
    else{
        deClouds.draw();
        drawSprites();
        image(happy2019, h2019_x, h2019_y, h2019_w, h2019_h);
    }

    // pigSprite.drawDectionArea();
    // image(pig_img, 0, height - pig_h*2.3, pig_w, pig_h);
    // animation(pigAnim, mouseX, mouseY);
}


function touchStarted() {

    windmill.doRotate();
    pigSprite.doDash();

}

function keyPressed()
{
    windmill.doRotate(keyCode);
}
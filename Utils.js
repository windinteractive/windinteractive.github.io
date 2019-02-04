/**
 * Created by erik on 31/1/2019.
 */

function compseBlinking(deSprite, paused, props)
{
    deSprite.beforeBlinkUpdate = deSprite.update;
    deSprite.update = function() {

        this.visible = int(this.blinking%2),
        this.beforeBlinkUpdate();
    }
    deSprite.blinkTimeline = new TimelineLite();
    deSprite.blinking = 1;
    deSprite.blinkTimeline.to(deSprite, 1, {blinking: 9, ease: Power0.easeNone, ...props})

    paused && deSprite.blinkTimeline.stop();

    return deSprite;
}

function compseBlinkingAndFalling(deSprite, paused)
{
    deSprite = compseBlinking(deSprite, paused);
    deSprite.blinkTimeline.to(deSprite.position, 1, {y: height, ease: Power2.easeIn});
    // deSprite.beforeBlinkingAndFallingUpdate = deSprite.update;
    // deSprite.blinking = 0;
    // deSprite.update = function() {
    //
    //     this.visible = !int(this.blinking%2),
    //         this.beforeBlinkingAndFallingUpdate();
    // }
    // deSprite.blinkTimeline = new TimelineLite();
    // deSprite.blinkTimeline.set(deSprite, {blinking: 0})
    //     .to(deSprite, 1, {blinking: 10, ease: Power0.easeNone})
    //     .to(deSprite.position, 1, {y: height, ease: Power2.easeIn});
    //
    // paused && deSprite.blinkTimeline.stop();

    return deSprite;
}


function addFallingBrick()
{
    window.gtag('event', 'view_result', {label: 'Brick Attack'});

    const brickSprite = createSprite(pigSprite.sprite.position.x, height*.35);
    brickSprite.addImage('show', brick_img);
    compseBlinkingAndFalling(brickSprite);
    brickSprite.life = brickSprite.blinkTimeline.duration()*fps;
    bricks.push(brickSprite);

    h2019_hidden = true;
}

function addFoodRain()
{
    window.gtag('event', 'view_result', {label: 'Food Rain'});
    for(let i=0; i<20; i++)
    {
        const foodSprite = createSprite(random(width*.15, width*.85), -50);
        const delay = random(0,8);
        foodSprite.addImage('show', random(foodImages));
        foodSprite.rotationSpeed = random(1, 8);
        TweenLite.to(foodSprite.position, foodFallTime, {y:height*3, ease: Power2.easeIn, delay});
        foodSprite.life = (foodFallTime+delay)*fps;
        foods.push(foodSprite);
    }
    h2019_hidden = true;
}

function addCoinsRain()
{
    window.gtag('event', 'view_result', {label: 'Coins Rain'});

    for(let i=0; i<18; i++)
    {
        const coinsSprite = createSprite(random(width*.15, width*.85), -50);
        const delay = random(0,8);
        coinsSprite.addImage('show', random(coinsImages));
        coinsSprite.scale = random(0.7, 1);
        coinsSprite.rotationSpeed = random(1, 8);
        TweenLite.to(coinsSprite.position, foodFallTime, {y:height*3, ease: Power2.easeIn, delay});
        coinsSprite.life = (foodFallTime+delay)*fps;
        coins.push(coinsSprite);
    }
    h2019_hidden = true;
}

function happy2019In()
{
    h2019_hidden = false;
    windmill.doingRotate = false;

    nightColor = 99;
    TweenLite.to(window, 1, {h2019_x: 6, h2019_y: 20, ease: Back.easeOut.config(1.7)})
    TweenLite.to(pigSprite.sprite, 1, {scale: 1, delay: .5, ease: Back.easeOut.config(1.7)});
    TweenLite.to(pigSprite.sprite.position, 1, {y: pigSprite.y0, ease: Back.easeOut.config(1.7)});
    TweenLite.to(windmill.sprite.position, 1, {x: windmill.dPosition.x, ease: Back.easeOut.config(1.7)});
    TweenLite.to(earchSprite.position, 1, {y: earchSprite.y0, });
}
function happy2019Out() {
    TweenLite.to(window, 1, {h2019_x: -h2019_w * .58, h2019_y: 80})
}

function addSmoke()
{

    for(let i=0; i<87; i++)
    {
        setTimeout((ind)=> {
            const smokeSprite = createSprite(pigSprite.sprite.position.x + random(-50,50), pigSprite.sprite.position.y + random(-25,25));
            smokeSprite.addImage('show', smokeImg);
            smokeSprite.scale = 0;
            smokeSprite.rotation = random(0,360)
            smokeSprite.rotationSpeed = random(0,5)
            smokeSprite.life = (1.2)*fps;
            // TweenLite.to(smokeSprite, .1, {scale: random(0.1, 0.5), yoyo:true, repeat: 2});
            const tl = new TimelineLite();
            tl.to(smokeSprite, 0.1, {scale: random(0.3, 1)})
            ind <86
                ? tl.to({}, 1, {})
                : tl.to({}, 8.7, {})

            tl.to(smokeSprite, 0.1, {scale: 0})

            smokeSprite.rotateDraw = smokeSprite.draw;
            smokeSprite.index = ind;
            smokeSprite.draw = function(){
                smokeSprite.rotateDraw();
                text(this.index, -2.5, 0)
            }

            smokes.push(smokeSprite);

        }, 170*i, i+1)
    }
    h2019_hidden = true;
    window.gtag('event', 'view_result', {label: '87 Smokes'});
}


const credit_duration = 10;
var lnDelays = [];

function showCredit()
{
    // credit.position.set(width*.5, height*.5);

    // TweenLite.to(credit.position,3, {x:width*.5, y:height*.5})
    TweenLite.to(window, 3, {h2019_x: -happy2019.width});
    TweenLite.to(windmill.sprite.position, 3, {x: width+windmill.sprite.width});
    TweenLite.to(pigSprite.sprite.position, 1, {y: height+pigSprite.sprite.height});
    TweenLite.to(earchSprite.position, 1, {y: height+earchSprite.height});

    lDelays = lanterns.map( l => random(0, .33) );
    lanterns.map( (l,i) => TweenLite.to(l.position, .7, {y: l.dPosition.y*.7, ease: Back.easeOut.config(1.7), delay: lDelays[i]}) )
    lanterns.map( (l,i) => TweenLite.to(l.position, .7, {y: -l.height, delay: .7 + 2*lDelays[i] + credit_duration}) )

    TweenLite.to(credit, .7, {scale: credit.dScale, ease: Back.easeOut.config(1.7)});
    TweenLite.to(credit, .13, {scale: 0, delay: .7 + credit_duration,onComplete: happy2019In});
    window.gtag('event', 'view_result', {label: '87 Smokes'});
    h2019_hidden = true;
}


function shootFireworks()
{
    TweenLite.to(window, .37, {nightColor: 0});
    TweenLite.to(window, 3, {h2019_x: -happy2019.width});
    TweenLite.to(windmill.sprite.position, 3, {x: width+windmill.sprite.width});

    var delay = .37;
    for(var i=0; i<10; i++)
    {
        delay += random(100, 1300);
        setTimeout((ind)=>
        {
            fPos[ind].set( 50 + ind*width*.27 + random(-10, 30), random(80, 250) );
            fworksAnims[ind].rewind();
            fworksAnims[ind].play();

        }, delay, i % fPos.length)
    }
    setTimeout(happy2019In, delay + 1000);


}
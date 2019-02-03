/**
 * Created by erik on 17/1/2019.
 */

class PigWithSprite {

    constructor(_sprite, runAnim, sadAnim, happyAnim)
    {
        this.sprite = _sprite;

        runAnim.frameDelay = 6;
        this.sprite.addAnimation('run', runAnim);
        this.sprite.addAnimation('sad', sadAnim);
        this.sprite.addAnimation('happy', happyAnim);
        // this.sprite.debug = true;

        this.sprite.position.x = width*.35;
        this.sprite.position.y = height - this.sprite.height*.9;
        this.sprite.setCollider("circle", this.sprite.width*.08, 0, this.sprite.width*.2);

        this.y0 = this.sprite.position.y;

        this.sprite = compseBlinking(this.sprite, true);

        this.sprite.blinkTimeline.to({}, .37, {onComplete: this.onBlinked.bind(this)});
        this.toRunAnim = this.toRunAnim.bind(this);

        this.forceRuning = 0;
    }

    onBlinked()
    {
        this.pauseDash = false;
        this.sprite.changeAnimation('run');
    }

    overlapBrick(brickSprite)
    {
        // pigSprite.overlap(someSprite)
        // ? pigSprite.changeAnimation('dead')
        // : pigSprite.changeAnimation('run')
        if(this.sprite.overlap(brickSprite))
        {
            this.pauseDash = false;
            this.sprite.blinkTimeline.restart();
            this.sprite.changeAnimation('sad');
            window.gtag('event', 'hit_by_brick');

            brickSprite.remove();
            return true;
        }
        return false
    }

    overlapFood(foodSprite)
    {
        if(this.sprite.overlap(foodSprite))
        {
            this.sprite.changeAnimation('happy');
            foodSprite.life = 0;
            foodSprite.remove();
            window.gtag('event', 'eat_the_food');


            this.sprite.scale = min( this.sprite.scale+0.068,  2);

            if(this.happyTimeout)
            {
                clearTimeout(this.happyTimeout);
            }
            this.happyTimeout = setTimeout(this.toRunAnim, 1000);

            return true;
        }

        return foodSprite.life <= 0;
    }

    overlapCoins(coinsSprite)
    {
        if(this.sprite.overlap(coinsSprite))
        {
            this.sprite.changeAnimation('happy');
            coinsSprite.life = 0;
            coinsSprite.remove();
            window.gtag('event', 'collect_coins');


            if(this.happyTimeout)
            {
                clearTimeout(this.happyTimeout);
            }
            this.happyTimeout = setTimeout(this.toRunAnim, 1000);

            return true;
        }

        return coinsSprite.life <= 0;
    }

    overlapSmoke(smokeSprite)
    {
        if(this.sprite.overlap(smokeSprite))
        {
            this.forceRuning = max(0, this.forceRuning - 1);

            if(this.forceRuning <=0 )
            {
                this.sprite.changeAnimation('sad');
                window.gtag('event', 'hit_by_smoke');
            }

            if(this.sadTimeout)
            {
                clearTimeout(this.sadTimeout);
            }
            this.sadTimeout = setTimeout(this.toRunAnim, 1000);
        }

        return smokeSprite.life <= 0;
    }

    toRunAnim()
    {

        this.sprite.changeAnimation('run');
    }

    drawDectionArea()
    {
        stroke(10)
        line(0,this.sprite.position.y - this.sprite.width*.5, width, this.sprite.position.y - this.sprite.width*.5)
        line(0,this.sprite.position.y + this.sprite.width*.5, width, this.sprite.position.y + this.sprite.width*.5)
    }

    doDash()
    {
        if(this.pauseDash){return;}
        this.forceRuning = 40;
        this.sprite.changeAnimation('run');
        // const touched = this.sprite.overlapPoint(mouseX, mouseY);
        // if( mouseY < this.sprite.position.y - this.sprite.position.width)
        const touched = (
            mouseY >= this.sprite.position.y - this.sprite.width*.5
            && mouseY <= this.sprite.position.y + this.sprite.width*.5
        );
        if(touched)
        {
            window.gtag('event', 'click_pig_to_dash');

            TweenLite.to(
                this.sprite.position,
                0.3,
                {
                    x: width-80,
                    onComplete: ()=> TweenLite.to(this.sprite.position, 2, {x: width*.35})
                }
            )
        }
    }
}
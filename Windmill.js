/**
 * Created by erik on 17/1/2019.
 */

/*
class Windmill
{
    constructor()
    {
        console.log("Windmill")
        this.wingW= 10;
        this.wingH= 60;
        this.numWings = 6;
        this.rotation = 0;
        this.hitbox = [];
        this.xoff = 0.0;


        this.onRotated = this.onRotated.bind(this);
        // this.doIdelRotate();

        // blue, green, yellow, orange, red, pink
        this.colors=['#173f5f','#20639b', '#3caea3', '#f6d55c', '#ed553b', '#ff1050'];
        this.choices = [0, 60, 120, 180, 240, 360];
        this.drawResultActions = [
            addFallingBrick,
            addFoodRain,
            addCoinsRain,
            addSmoke,
            addSmoke,
            addSmoke,
        ];

        // const angle = radians(360/this.numWings);
        // for( let i=1; i<this.numWings; i++ )
        // {
        //     this.choices[i] = angle + this.choices[i-1];
        // }


    }

    onRotated()
    {

        // this.rotation = 0;
        // this.doIdelRotate();
    }

    doIdelRotate()
    {
        // const pct = Math.random() * 3 + 1.4;
        TweenLite.to(
            this,
            2,
            {
                rotation: "+=1.4",
                onComplete: this.onRotated,
                ease: Power0.easeNone,
            }
        )
    }

    getNextDraw()
    {

        return random(this.choices) + PI*19.5 - (this.rotation%(2*PI));
    }

    doRotate()
    {
        const targetRotate = this.getNextDraw();
        // console.log("targetRotate", targetRotate)
        if(!this.doingRotate)
        {
            TweenLite.to(
                this,
                9,
                {
	                rotation: `+=${targetRotate}`,
                    ease: Back.easeOut.config(.5),                    
                    onComplete: ()=> setTimeout( ()=> this.doingRotate = false, 1300 )
                }
            )
        }
        this.doingRotate = true;

    }

    drawWings()
    {
        const {choices} = this;
        // const angle = radians(360/numWings);


            // for( let i=0; i<numWings; i++ )
            // {
            //     rotate(angle);
            //     rect(0,0, 30, 100);
            // }
        noStroke();
        choices.map( (r,i) => {
            push();
                rotate(r);
                fill(this.colors[i]);
                rect(0,0, 30, 100);
                fill(255)
                text(i, 12,90);
            pop();
        })

    }

    update()
    {
        if(!this.doingRotate)
        {
            this.xoff += 0.01;
            // this.rotation += noise(this.xoff)*PI*0.008;
            this.rotation += .008;

        }
    }

    draw(x=100, y=100)
    {
        this.update();

        const {rotation} = this;
        push();
            translate(x,y);
            fill(255)
            rect(-15,0, 30, 200)
            push();
                rotate(rotation)
                this.drawWings();
            pop();
            // fill(255);
            // text(noise(this.xoff), 0,0);
        pop();
    }

}
*/

class WindmillwithSprite
{
    constructor(_sprite, img)
    {
        this.default_rotationSpeed = .2;
        this.sprite = _sprite;
        this.sprite.addImage('static', img);
        // this.sprite.debug = true;
        // this.sprite.scale = .5;
        this.sprite.scale = (width/img.width*.8);
        this.dPosition = this.sprite.position.copy();
        this.drawDuration = 9;
        this.doingRotate = false;
        this.sprite.setCollider(
            'circle',
            0,0,
            img.width * this.sprite.scale
        );
        this.sprite.rotationSpeed = this.default_rotationSpeed;

        // blue, green, yellow, orange, red, pink
        this.colors=['#173f5f','#20639b', '#3caea3', '#f6d55c', '#ed553b', '#ff1050'];
        this.choices = [0, 60, 120, 180, 240, 360];
        this.drawResultActions = [
            addSmoke,
            showCredit,
            shootFireworks,
            addFallingBrick,
            addCoinsRain,
            addFoodRain,
        ];

        this.onComplete = this.onComplete.bind(this);


        // this.onComplete();
    }

    getNextDraw(keyCode)
    {
        var _rand = random(this.choices);
        const _index = this.choices.indexOf(_rand);
        this.afterAction = this.drawResultActions[_index];

        const keyNumber = int(keyCode) - 48;

        if(keyNumber >= 0 && this.choices.length > keyNumber)
        {
            _rand = this.choices[keyNumber];
            this.afterAction = this.drawResultActions[keyNumber];
        }
        return _rand + (8*360+12) - (this.sprite.rotation%360);
    }


    onComplete()
    {
        setTimeout(()=>
        {
            this.sprite.rotationSpeed = this.default_rotationSpeed;
        }, 3000);


        // random([true, false]) ? addFallingBrick() : addFoodRain();
        // addFoodRain();
        // addCoinsRain();
        // addSmoke();
        if(typeof (this.afterAction) == 'function')
        {
            this.afterAction();
        }
        else{
            addCoinsRain();
        }
    }

    doRotate(keyCode)
    {
        const targetRotate = this.getNextDraw(keyCode);
        const now = Date.now();

        const touched = this.sprite.overlapPoint(mouseX, mouseY);

        if(!this.doingRotate && (touched || keyCode))
        {
            window.gtag('event', 'click_on_windmill');

            // console.log("totched", touched)
            this.sprite.rotationSpeed = 0;
            TweenLite.to(
                this.sprite,
                this.drawDuration,
                {
                    rotation: `+=${targetRotate}`,
                    ease: Back.easeOut.config(.35),
                    onComplete: this.onComplete,
                }
            )
            this.doingRotate = true;

            happy2019Out();
        }
    }
}
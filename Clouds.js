/**
 * Created by erik on 24/1/2019.
 */

var clouds_x, cloud_x, cloud_y;
var clouds_speed = -.12;
var cloud_speed = -.51;
var s_cloud_x = 100;
var s_cloud_y = 100;
var s_cloud_speed = -.71;

const CloudsFunc = ()=>
{
    clouds_x=random(windowWidth-300, windowWidth-100);
    cloud_x=0;
    cloud_y=random(80,120);

    return{
        update: ()=>{

            if(clouds_x < -clouds.width)
            {
                clouds_x = width + 10;
            }

            if(cloud_x < -cloud.width)
            {
                cloud_x = width + random(5,20);
                cloud_y = random([100,90,80]);
                cloud_speed = random(-.73,-.53);
            }

            if(s_cloud_x < -s_cloud.width)
            {
                s_cloud_x = width + random(5,20);
                s_cloud_speed = random(-.33,-.13);
                s_cloud_y = random([0, 20,30,40,50,70,80]);
            }

            clouds_x += clouds_speed;
            cloud_x += cloud_speed;
            s_cloud_x += s_cloud_speed;
        },
        draw: ()=> {

            image(clouds, clouds_x, 10);
            image(cloud, cloud_x, cloud_y);
            image(s_cloud, s_cloud_x, s_cloud_y);

        }
    }
}



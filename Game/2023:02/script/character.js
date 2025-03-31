class Position {
    static calcLength(x,y) {
        return Math.sqrt(x * x + y * y);
    }
    static calcNormal(x,y) {
        let len = Position.calcLength(x,y);
        return new Position(x / len, y / len);
    }
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
    set(x,y) {
        if(x != null){this.x = x;}
        if(y != null){this.y = y;}
    }
    distance(target) {
        let x = this.x - target.x;
        let y = this.y - target.y;
        return Math.sqrt(x * x + y * y);
    }
    cross(target) {
        return this.x * target.y - this.y * target.x;
    }
    normalize() {
        let l = Math.sqrt(this.x * this.x + this.y * this.y);
        if(l === 0){
            return new Position(0,0);
        }
        let x = this.x / l;
        let y = this.y / l;
        return new Position(x,y);
    }

    rotate(radian) {
        let s = Math.sin(radian);
        let c = Math.cos(radian);
        this.x = this.x * c + this.y * -s;
        this.y = this.x * s + this.y * c;
    }
}


class Character {
    constructor(ctx,x,y,w,h,life,imagePath) {
        this.count = 0;
        this.ctx = ctx;
        this.position = new Position(x,y);
        this.vector = new Position(0.0, -1.0);
        this.angle = 270 * Math.PI / 180;
        this.width = w;
        this.height = h;
        this.life = life;
        this.ready = false;
        this.image = new Image();
        this.image.addEventListener('load', () => {
            this.ready = true;
        },false);
        this.image.src = imagePath;
    }

    setVector(x,y) {
        this.vector.set(x,y);
    }
    setVectorFromAngle(angle) {
        this.angle = angle;
        let sin = Math.sin(angle);
        let cos = Math.cos(angle);
        this.vector.set(cos,sin);
    }

    draw() {
        let offsetX = this.width / 2;
        let offsetY = this.height / 2;
        this.ctx.drawImage(
            this.image,
            this.position.x - offsetX,
            this.position.y - offsetY,
            this.width,
            this.height
        );
    }

    rotationDraw() {
        this.count++;
        this.ctx.save();
        this.ctx.translate(this.position.x, this.position.y);
        this.ctx.rotate(this.angle - (Math.PI * this.count) / 4);

        let offsetX = this.width / 2;
        let offsetY = this.height / 2;
        this.ctx.drawImage(
            this.image,
            -offsetX,
            -offsetY,
            this.width,
            this.height
        );
        this.ctx.restore();
    }
}


class Viper extends Character {
    constructor(ctx,x,y,w,h,imagePath) {
        super(ctx,x,y,w,h,1,imagePath);
        //character インスタンスの画像src に関してだけは、viper クラスの変数として格納することができない。
        //そのため、draw()で直接　this.ch1.imageのように参照させる必要がある。
        //そこでうまく、変数に格納させない形でのアニメーションループの仕組みが必要である。

        //updateメソッドでframeCountを回し、frameCountに応じたインデックス番号を、CharacterAnimから巻き取る。
        //描画関数であるdrawメソッドで分岐処理する。
        this.ch1 = null;
        this.ch2 = null;
        this.ch3 = null;
        this.ch4 = null;
        this.ch5 = null;
        this.ch6 = null;
        this.ch7 = null;
        this.CharacterImageNum = 0;
        this.CharacterImage = null;
        // this.CharacterAnim = [0,1,2,3,4,3,2,1,0];
        this.CharacterAnim = [0,1,2,3,4,5,6,5,4,3,2,1,0];


        this.frameCount=0;
        this.speed = 3;
        this.shotCheckCounter = 0;
        this.shotInterval = 10;
        this.isComing = false;
        this.comingStart = null;
        this.comingStartPosition = null;
        this.comingEndPosition = null;
        this.shotArray = null;
        this.singleShotArray = null;
    }
    setComing(startX, startY, endX, endY) {
        this.life = 1;
        this.isComing = true;
        this.comingStart = Date.now();
        this.position.set(startX, startY);
        this.comingStartPosition = new Position(startX, startY);
        this.comingEndPosition = new Position(endX, endY);
    }
    setShotArray(shotArray, singleShotArray) {
        this.shotArray = shotArray;
        this.singleShotArray = singleShotArray;
    }
    setImageCharacter(ch1,ch2,ch3,ch4,ch5,ch6,) {
        this.ch1 = ch1;
        this.ch2 = ch2;
        this.ch3 = ch3;
        this.ch4 = ch4;
        this.ch5 = ch5;
        this.ch6 = ch6;
    }
    draw() {
        if(this.CharacterImageNum === 0) {
            this.CharacterImage = this.image;
        } else if(this.CharacterImageNum === 1) {
            this.CharacterImage = this.ch1.image;
        } else if(this.CharacterImageNum === 2) {
            this.CharacterImage = this.ch2.image;
        } else if(this.CharacterImageNum === 3) {
            this.CharacterImage = this.ch3.image;
        } else if(this.CharacterImageNum === 5) {
            this.CharacterImage = this.ch5.image;
        } else if(this.CharacterImageNum === 6) {
            this.CharacterImage = this.ch6.image;
        } 

         let offsetX = this.width / 2;
        let offsetY = this.height / 2;
        this.ctx.drawImage(
            this.CharacterImage,
            this.position.x - offsetX,
            this.position.y - offsetY,
            this.width,
            this.height
        );
    }
    update() {
        if(this.life <= 0){return;}
        this.frameCount++;
        this.CharacterImageNum = this.CharacterAnim[(this.frameCount>>2)%9];

        let justTime = Date.now();
        if(this.isComing === true) {
            let comingTime = (justTime - this.comingStart) / 1000;
            let y = this.comingStartPosition.y - comingTime * 50;
            if(y <= this.comingEndPosition.y) {
                this.isComing = false;
                y = this.comingEndPosition.y;
            }
            this.position.set(this.position.x, y);

            if(justTime % 100 < 50) {
                this.ctx.globalAlpha = 0.5;
            }
        } else {

            if(this.speed > 3) {
                this.speed = 3;
            }
            if(this.shotInterval < 10) {
                this.shotInterval = 10;
            }

            if(window.isKeyDown.key_a === true) {
                this.shotInterval = 4;
                this.speed *= 3;
                for(let i=0; i<this.shotArray.length; ++i) {
                    this.shotArray[i].setSpeed(15);
                }
                for(let i=0; i<this.singleShotArray.length; ++i) {
                    this.singleShotArray[i].setSpeed(15);
                }
            }


            if(window.isKeyDown.key_ArrowLeft === true) {
                this.position.x -= this.speed;
            }
            if(window.isKeyDown.key_ArrowRight === true) {
                this.position.x += this.speed;
            }
            if(window.isKeyDown.key_ArrowUp === true) {
                this.position.y -= this.speed;
            }
            if(window.isKeyDown.key_ArrowDown === true) {
                this.position.y += this.speed;
            }
            let canvasWidth = this.ctx.canvas.width;
            let canvasHeight = this.ctx.canvas.height;
            let tx = Math.min(Math.max(this.position.x, 0), canvasWidth);
            let ty = Math.min(Math.max(this.position.y, 0), canvasHeight);
            this.position.set(tx,ty);

            if(window.isKeyDown.key_z === true) {
                if(this.shotCheckCounter >= 0) {
                    let i;
                    for(i=0; i<this.shotArray.length; ++i) {
                        if(this.shotArray[i].life <= 0) {
                            this.shotArray[i].set(this.position.x, this.position.y);
                            this.shotArray[i].setPower(2);
                            this.shotCheckCounter = -this.shotInterval;
                            if(this.shotArray[i].speed > 7) {
                                this.shotArray[i].setSpeed(7);
                            };
                            break;
                        }
                    }

                    for(i=0; i<this.singleShotArray.length; i+=2) {
                        if(this.singleShotArray[i].life <= 0 && this.singleShotArray[i + 1].life <= 0) {
                            let radCW = 280 * Math.PI / 180;
                            let radCCW = 260 * Math.PI / 180;
                            
                            this.singleShotArray[i].set(this.position.x, this.position.y);
                            this.singleShotArray[i].setVectorFromAngle(radCW);
                            this.singleShotArray[i + 1].set(this.position.x, this.position.y);
                            this.singleShotArray[i + 1].setVectorFromAngle(radCCW);
                            this.shotCheckCounter = -this.shotInterval;
                            if(this.singleShotArray[i].speed > 12 && this.singleShotArray[i + 1].speed > 12) {
                                this.singleShotArray[i].setSpeed(7);
                                this.singleShotArray[i + 1].setSpeed(7);
                            }
                            break;
                        }
                    }
                }
            }

            ++this.shotCheckCounter;
        }

        this.draw();
        this.ctx.globalAlpha = 1.0;
    }
}


class Enemy extends Character {
    constructor(ctx,x,y,w,h,imagePath) {
        super(ctx,x,y,w,h,0,imagePath);
        this.type = 'default';
        this.frame = 0;
        this.speed = 3;
        this.shotArray = null;
        this.attackTarget = null;
    }
    set(x,y,life = 1, type = 'default') {
        this.position.set(x,y);
        this.life = life;
        this.type = type;
        this.frame = 0;
    }
    setShotArray(shotArray) {
        this.shotArray = shotArray;
    }
    setAttackTarget(target) {
        this.attackTarget = target;
    }
    update() {
        if(this.life <= 0){return;}
        switch(this.type) {
            case 'wave':
                if(this.frame % 60 === 0){
                    let tx = this.attackTarget.position.x - this.position.x;
                    let ty = this.attackTarget.position.y - this.position.y;
                    let tv = Position.calcNormal(tx,ty);
                    this.fire(tv.x, tv.y, 4.0);
                }
                this.position.x += Math.sin(this.frame / 10);
                this.position.y += 2.0;

                if(this.position.y - this.height > this.ctx.canvas.height) {
                    this.life = 0;
                }
                break;

                case 'BackGround':
                
                    break;
            
            case 'large':
                if(this.frame % 50 === 0) {
                    for(let i=0; i<360; i+=45) {
                        let r = i * Math.PI / 180;
                        let s = Math.sin(r);
                        let c = Math.cos(r);
                        this.fire(c, s, 3.0);
                    }
                }
                this.position.x += Math.sin((this.frame + 90)/50) * 3.0;
                this.position.y += 0.8;
                if(this.position.y - this.height > this.ctx.canvas.height) {
                    this.life = 0;
                }
                break;

            case 'default':
            default:
                if(this.frame === 100) {
                    this.fire();
                }
                this.position.x += this.vector.x * this.speed;
                this.position.y += this.vector.y * this.speed;
                if(this.position.y - this.height > this.ctx.canvas.height)  {
                    this.life = 0;
                }
                break;
        }

            this.draw();
        ++this.frame;
    }

    fire(x = 0.0, y = 1.0, speed = 5.0) {
        for(let i=0; i<this.shotArray.length; ++i) {
            if(this.shotArray[i].life <= 0) {
                this.shotArray[i].set(this.position.x, this.position.y);
                this.shotArray[i].setSpeed(speed);
                this.shotArray[i].setVector(x,y);
                break;
            }
        }
    }
}



 class Boss extends Character {
    constructor(ctx, x, y, w, h, imagePath){
        super(ctx, x, y, w, h, 0, imagePath);

        this.CharacterImageNum = 0;
        this.CharacterImage = null;
        this.CharacterAnim = [0,1,2,3,4,5,6,7,8,9,10,11,12];

        this.ch1 = null;
        this.ch2 = null;
        this.ch3 = null;
        this.ch4 = null;
        this.ch5 = null;
        this.ch6 = null;
        this.ch7 = null;
        this.ch8 = null;
        this.ch9 = null;
        this.ch10 = null;
        this.ch11 = null;
        this.ch12 = null;
        this.ch13 = null;

        this.mode = '';
        this.frame = 0;
        this.speed = 3;
        this.shotArray = null;
        this.homingArray = null;
        this.attackTarget = null;
    }

    set(x, y, life = 1){
        this.position.set(x, y);
        this.life = life;
        this.frame = 0;
    }
    setImageCharacter(ch1,ch2,ch3,ch4,ch5,ch6,ch7,ch8,ch9,ch10,ch11,ch12,ch13) {
        this.ch1 = ch1;
        this.ch2 = ch2;
        this.ch3 = ch3;
        this.ch4 = ch4;
        this.ch5 = ch5;
        this.ch6 = ch6;
        this.ch7 = ch7;
        this.ch8 = ch8;
        this.ch9 = ch9;
        this.ch10 = ch10;
        this.ch11 = ch11; 
        this.ch12 = ch12;
        this.ch13 = ch13;
    }
    setShotArray(shotArray){
        this.shotArray = shotArray;
    }

    setHomingArray(homingArray){
        this.homingArray = homingArray;
    }

    setAttackTarget(target){
        this.attackTarget = target;
    }

    setMode(mode){
        this.mode = mode;
    }
    draw2() {
        if(this.CharacterImageNum === 0) {
            this.CharacterImage = this.image;
        } else if(this.CharacterImageNum === 1) {
            this.CharacterImage = this.ch1.image;
        } else if(this.CharacterImageNum === 2) {
            this.CharacterImage = this.ch2.image;
        } else if(this.CharacterImageNum === 3) {
            this.CharacterImage = this.ch3.image;
        } else if(this.CharacterImageNum === 4) {
            this.CharacterImage = this.ch4.image;
        } else if(this.CharacterImageNum === 5) {
            this.CharacterImage = this.ch5.image;
        } else if(this.CharacterImageNum === 6) {
            this.CharacterImage = this.ch6.image;
        } else if(this.CharacterImageNum === 7) {
            this.CharacterImage = this.ch7.image;
        } else if(this.CharacterImageNum === 8) {
            this.CharacterImage = this.ch8.image;
        } else if(this.CharacterImageNum === 9) {
            this.CharacterImage = this.ch9.image;
        } else if(this.CharacterImageNum === 10) {
            this.CharacterImage = this.ch10.image;
        } else if(this.CharacterImageNum === 11) {
            this.CharacterImage = this.ch11.image;
        } else if(this.CharacterImageNum === 12) {
            this.CharacterImage = this.ch12.image;
        } else if(this.CharacterImageNum === 13) {
            this.CharacterImage = this.ch13.image;
        }

        let offsetX = this.width / 2;
        let offsetY = this.height / 2;
        this.ctx.drawImage(
            this.CharacterImage,
            this.position.x - offsetX,
            this.position.y - offsetY,
            this.width,
            this.height
        );
    }
    update(){
        if(this.life <= 0){return;}

        this.CharacterImageNum = this.CharacterAnim[(this.frame>>1)%14];

        switch(this.mode){
            case 'invade':
                this.position.y += this.speed;
                if(this.position.y > 100){
                    this.position.y = 100;
                    this.mode = 'floating';
                    this.frame = 0;
                }
                break;
            case 'escape':
                this.position.y -= this.speed;
                if(this.position.y < -this.height){
                    this.life = 0;
                }
                break;
            case 'floating':
                if(this.frame % 1000 < 500){
                    if(this.frame % 200 > 100 && this.frame % 10 === 0){
                        let tx = this.attackTarget.position.x - this.position.x;
                        let ty = this.attackTarget.position.y - this.position.y;
                        let tv = Position.calcNormal(tx, ty);
                        this.fire(tv.x, tv.y, 4.0);
                    }
                }else{
                    if(this.frame % 50 === 0){
                        this.homingFire(0, 1, 3.5);
                    }
                }
                this.position.x += Math.cos(this.frame / 100) * 2.0;
                break;
            default:
                break;
        }

        this.draw2();
        ++this.frame;
    }
    fire(x = 0.0, y = 1.0, speed = 5.0){
        for(let i = 0; i < this.shotArray.length; ++i){
            if(this.shotArray[i].life <= 0){
                this.shotArray[i].set(this.position.x, this.position.y);
                this.shotArray[i].setSpeed(speed);
                this.shotArray[i].setVector(x, y);
                break;
            }
        }
    }
    homingFire(x = 0.0, y = 1.0, speed = 3.5){
        for(let i = 0; i < this.homingArray.length; ++i){
            if(this.homingArray[i].life <= 0){
                this.homingArray[i].set(this.position.x, this.position.y);
                this.homingArray[i].setSpeed(speed);
                this.homingArray[i].setVector(x, y);
                break;
            }
        }
    }
}




class Shot extends Character {
    constructor(ctx,x,y,w,h,imagePath) {
        super(ctx,x,y,w,h,0,imagePath);
        this.speed = 7;
        this.power = 1;
        this.targetArray = [];
        this.explosionArray1 = [];
        this.explosionArray2 = [];
        this.explosionArray3 = [];
        this.sparkArray = [];
    }
    set(x,y,speed, power) {
        this.position.set(x,y);
        this.life = 1;
        this.setSpeed(speed);
        this.setPower(power);
    }
    setSpeed(speed) {
        if(speed != null && speed > 0) {
            this.speed = speed;
        }
    }
    

    setPower(power) {
        if(power != null && power > 0) {
            this.power = power;
        }
    }

    setTargets(targets) {
        if(targets != null && Array.isArray(targets) === true && targets.length > 0) {
            this.targetArray = targets;
        }
    }
    setExplosions(targets1, targets2, targets3) {
        if(targets1 != null && Array.isArray(targets1) === true && targets1.length > 0) {
            this.explosionArray1 = targets1;
        }
        if(targets2 != null && Array.isArray(targets2) === true && targets2.length > 0)  {
            this.explosionArray2 = targets2;
        }
        if(targets3 != null && Array.isArray(targets3) === true && targets3.length > 0)  {
            this.explosionArray3 = targets3;
        }
    }
    setSparks(targets) {
        if(targets != null && Array.isArray(targets) === true && targets.length > 0) {
            this.sparkArray = targets;
        }
    }



    update() {
        if(this.life <= 0){return;}
        if(
            this.position.x + this.width < 0 ||
            this.position.x - this.width > this.ctx.canvas.width ||
            this.position.y + this.height < 0 ||
            this.position.y - this.height > this.ctx.canvas.height
        ) {
            this.life = 0;
        }
        this.position.x += this.vector.x * this.speed;
        this.position.y += this.vector.y * this.speed;

        this.targetArray.map((v) => {
            if(this.life <= 0 || v.life <= 0){return;}
            let dist = this.position.distance(v.position);
            if(dist <= (this.width + v.width) / 4){
                if(v instanceof Viper === true) {
                    if(v.isComing === true){return;}
                }
                if(this.sparkArray.length > 0) {
                    for(let i=0; i<this.sparkArray.length; ++i) {
                        if(this.sparkArray[i].life !== true) {
                            this.sparkArray[i].set(v.position.x, v.position.y);
                            break;
                        }
                    }
                }
                v.life -= this.power;
                if(v.life <= 0){
                    for(let i=0; i<this.explosionArray1.length; ++i) {
                        if(this.explosionArray1[i].life !== true) {
                            this.explosionArray1[i].set(v.position.x, v.position.y);
                            break;
                        }
                    }

                    for(let i=0,l=this.explosionArray2.length; i<l; ++i) {
                        if(this.explosionArray2[i].life !== true) {
                            this.explosionArray2[i].set(v.position.x, v.position.y);
                            break
                        }
                    } 
                    for(let i=0,l=this.explosionArray3.length; i<l; ++i) {
                        if(this.explosionArray3[i].life !== true) {
                            this.explosionArray3[i].set(v.position.x, v.position.y);
                            break
                        }
                    } 

                    if(v instanceof Enemy === true) {
                        let score = 100;
                        if(v.type === 'large') {
                            score = 1000;
                        }
                        gameScore = Math.min(gameScore + score, 99999);
                    } else if(v instanceof Boss === true) {
                        gameScore = Math.min(gameScore + 15000, 99999);
                    }
                }
                this.life = 0;
            }
        });

        this.rotationDraw();
    }
}



class Homing extends Shot {
    constructor(ctx,x,y,w,h,imagePath) {
        super(ctx,x,y,w,h,imagePath);
        this.frame = 0;
    }
    set(x,y,speed, power) {
        this.position.set(x,y);
        this.life = 1;
        this.setSpeed(speed);
        this.setPower(power);
        this.frame = 0;
    }
    update() {
        if(this.life <= 0){return;}
        if(
            this.position.x + this.width < 0 ||
            this.position.x - this.width > this.ctx.canvas.width ||
            this.position.y + this.height < 0 ||
            this.position.y - this.height > this.ctx.canvas.height
        ){
            this.life = 0;
        }
        let target = this.targetArray[0];
        if(this.frame < 100) {
            let vector = new Position(
                target.position.x - this.position.x,
                target.position.y - this.position.y
            );

            let normalizedVector = vector.normalize();
            this.vector = this.vector.normalize();
            let cross = this.vector.cross(normalizedVector);
            let rad = Math.PI / 180.0;
            if(cross > 0.0) {
                this.vector.rotate(rad);
            } else if(cross < 0.0) {
                this.vector.rotate(-rad);
            }
        }

        this.position.x += this.vector.x * this.speed;
        this.position.y += this.vector.y * this.speed;
        this.angle = Math.atan2(this.vector.y, this.vector.x);

        this.targetArray.map((v) => {
            if(this.life <= 0 || v.life <= 0){return;}
            let dist = this.position.distance(v.position);
            if(dist <= (this.width + v.width)/4) {
                if(v instanceof Viper === true) {
                    if(v.isComing === true){return;}
                }
                v.life -= this.power;
                if(v.life <= 0){
                    for(let i=0; i<this.explosionArray1.length; ++i) {
                        if(this.explosionArray1[i].life !== true) {
                            this.explosionArray1[i].set(v.position.x, v.position.y);
                            break;
                        }
                    }

                    if(v instanceof Enemy === true) {
                        let score = 100;
                        if(v.type === 'large') {
                            score = 1000;
                        }
                        gameScore = Math.min(gameScore + score, 99999);
                    }
                }
                this.life = 0;
            }
        });
        this.rotationDraw();
        ++this.frame;
    }
}


class Explosion {

    constructor(ctx, radius, count, size, timeRange, type){
        this.ctx = ctx;
        this.life = false;
        this.position = null;
        this.radius = radius;
        this.count = count;
        this.startTime = 0;
        this.timeRange = timeRange;
        this.fireBaseSize = size;
        this.type = type;
        this.fireSize = [];
        this.firePosition = [];
        this.fireVector = [];
        this.color = [];
        this.sound = null;

    }

    setRGB(min1,max1,min2,max2,min3,max3) {
        let R = Math.floor(min1 + Math.random() * (max1 - min1));
        let G = Math.floor(min2 + Math.random() * (max2 + min2));
        let B = Math.floor(min3 + Math.random() * (max3 - min3));
        return 'rgb('+R+', '+G+', '+B+')';
    }

    set(x, y){
        for(let i = 0; i < this.count; ++i){
            this.firePosition[i] = new Position(x, y);
            let vr = Math.random() * Math.PI * 2.0;
            let s = Math.sin(vr);
            let c = Math.cos(vr);
            let mr = Math.random();

            if(this.type === 1) {
                this.color[i] = this.setRGB(0,10,0,10,27,80);
            }else if(this.type === 2) {
                this.color[i] = this.setRGB(17,83,103,183,159,255);
            }else if(this.type === 3) {
                this.color[i] = this.setRGB(219,255,162,238,51,79);
            }

            this.fireVector[i] = new Position(c * mr, s * mr);
            this.fireSize[i] = (Math.random() * 0.5 + 0.5) * this.fireBaseSize;
        }
        this.life = true;
        this.startTime = Date.now();

        if(this.sound != null){
            this.sound.play();
        }
    }


    setSound(sound){
        this.sound = sound;
    }

    update(){
        if(this.life !== true){return;}
        this.ctx.fillStyle = this.color;
        this.ctx.globalAlpha = 0.5;
        let time = (Date.now() - this.startTime) / 1000;
        let ease = simpleEaseIn(1.0 - Math.min(time / this.timeRange, 1.0));
        let progress = 1.0 - ease;

        for(let i = 0; i < this.firePosition.length; ++i){
            let d = this.radius * progress;
            let x = this.firePosition[i].x + this.fireVector[i].x * d;
            let y = this.firePosition[i].y + this.fireVector[i].y * d;
            let s = 1.0 - progress;

            //四角形を描画する前に、爆破のかけらの色を変える。　
            this.ctx.fillStyle = this.color[i];
            this.ctx.fillRect(
                x - (this.fireSize[i] * s) / 2,
                y - (this.fireSize[i] * s) / 2,
                this.fireSize[i] * s,
                this.fireSize[i] * s
            );
        }

        if(progress >= 1.0){
            this.life = false;
        }
    }
}


class BackgroundStar {
    constructor(ctx, size, speed, color = '#ffffff') {
        this.ctx = ctx;
        this.size = size;
        this.speed = speed;
        let colorLeng = [
            '#00ffff',
            '#f0f8ff',
            '#ffa500',
            '#ff00ff',
            '#ffffff'
        ];
        this.color = colorLeng[Math.floor(Math.random() * (colorLeng.length))];
        this.position = null;
    }
    set(x,y) {
        this.position = new Position(x,y);
    }
    update() {
        this.ctx.fillStyle = this.color;
        this.position.y += this.speed;
        this.ctx.fillRect(
            this.position.x - this.size / 2,
            this.position.y - this.size / 2,
            this.size,
            this.size
        );
        if(this.position.y + this.size > this.ctx.canvas.height) {
            this.position.y = - this.size;
        }
    }
}



class Meteorite extends Character {
    constructor(ctx,size,speed,imagePath) {
        super(ctx,x,y,w,h,0,imagePath);

        this.ctx = ctx;
        this.size = size;
        this.speed = speed;
        this.color = color;
        this.position = null;
    }
    set(x,y) {
        this.position = new Position(x,y);
    }
    rotationDraw2() {

    }
    update() {
        this.position.y += this.speed;
        this.rotationDraw2();
        if(this.position.y + this.size > this.ctx.canvas.height) {
            this.position.y = -this.size;
        }
    }

}


function simpleEaseIn(t) {
    return t * t * t * t;
}
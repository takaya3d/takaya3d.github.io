(() => {
    window.isKeyDown = {};
    window.gameScore = 0;
    const CANVAS_WIDTH = 640;
    const CANVAS_HEIGHT = 480;
    const ENEMY_SMALL_MAX_COUNT = 20;
    const ENEMY_LARGE_MAX_COUNT = 5;
    const SHOT_MAX_COUNT = 10;
    const ENEMY_SHOT_MAX_COUNT = 50;
    const HOMING_MAX_COUNT = 10;
    const EXPLOSION_MAX_COUNT = 10;
    const SPARK_MAX_COUNT = 20;
    const BACKGROUND_STAR_MAX_COUNT = 800;
    const BACKGROUND_STAR_MAX_SIZE = 2.3;
    const BACKGROUND_STAR_MAX_SPEED = 13;
    let util = null;
    let canvas = null;
    let ctx = null;
    let scene = null;
    let startTime = null;

    let viper = null;
    let viperIm2 = null;
    let viperIm3 = null;
    let viperIm4 = null;
    let viperIm5 = null;
    let viperIm6 = null;
    let viperIm7 = null;

    let boss = null;
    let bossIm2 = null;
    let bossIm3 = null;
    let bossIm4 = null;
    let bossIm5 = null;
    let bossIm6 = null;
    let bossIm7 = null;
    let bossIm8 = null;
    let bossIm9 = null;
    let bossIm10 = null;
    let bossIm11 = null;
    let bossIm12 = null;
    let bossIm13 = null;
    let enemyArray = [];
    let shotArray = [];
    let singleShotArray = [];
    let enemyShotArray = [];
    let homingArray = [];
    let explosionArray1 = [];
    let explosionArray2 = [];
    let explosionArray3 = [];
    let sparkArray = [];
    let backgroundStarArray = [];
    let restart = false;
    let Exsound1 = null;
    let Exsound2 = null;
    let Exsound3 = null;
    let Exsound4 = null;
    let BackGroundImage = null; 




    window.addEventListener('load', ()=> {
        util = new Canvas2DUtility(document.body.querySelector('#main_canvas'));
        canvas = util.canvas;
        ctx = util.context;
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        let button = document.body.querySelector('#start_button');
        button.addEventListener('click', () => {
            button.disabled = true;
            Exsound1 = new Sound();
            Exsound2 = new Sound();
            Exsound3 = new Sound();
            Exsound4 = new Sound();
            Exsound1.load('./sound/explosion1.mp3', (error) => {
                Exsound2.load('./sound/explosion2.mp3', (error) =>  {
                    Exsound3.load('./sound/explosion3.mp3', (error) =>  {
                        Exsound4.load('./sound/explosion4.mp3', (error) =>  {
                            if(error != null) {
                                alert('ファイルの読み込みエラーです');
                                return;
                            }
                            initialize();
                            loadCheck();
                        });
                    });
                });
            });  
        },false);
    },false);





    function initialize() {
        let i;
        scene = new SceneManager();
        for(i = 0; i < EXPLOSION_MAX_COUNT; ++i) {
            explosionArray1[i] = new Explosion(ctx, 180.0, 55, 40.0, 1.0, 1);
            let NumEx = i%4+1;
            if(NumEx === 1){
                explosionArray1[i].setSound(Exsound1);
            }else if(NumEx === 2) {
                explosionArray1[i].setSound(Exsound2);
            }else if(NumEx === 3) {
                explosionArray1[i].setSound(Exsound3);
            }else if(NumEx === 4) {
                explosionArray1[i].setSound(Exsound4);
            }
            explosionArray2[i] = new Explosion(ctx, 180.0, 75, 40.0, 1.0, 2);
            explosionArray3[i] = new Explosion(ctx, 100.0, 45, 50.0, 1.6, 3);


            
        }
        for(i = 0; i < SPARK_MAX_COUNT; ++i) {
            sparkArray[i] = new Explosion(ctx, 40.0, 15, 10.0, 0.7,1);
        }

        for(i = 0; i < SHOT_MAX_COUNT; ++i) {
            shotArray[i] = new Shot(ctx, 0,0,32,32,'./image/Energy13.png');
            singleShotArray[i * 2] = new Shot(ctx, 0, 0, 32, 32, './image/Energy4.png');
            singleShotArray[i * 2 + 1] = new Shot(ctx, 0, 0, 32, 32, './image/Energy8.png');
        }

        viper = new Viper(ctx,0,0,96,96, './image/1.png');
        viperIm2 = new Character(ctx,0,0,56,120, 0,'./image/2.png');
        viperIm3 = new Character(ctx,0,0,56,120, 0,'./image/3.png');
        viperIm4 = new Character(ctx,0,0,56,120, 0,'./image/4.png');
        viperIm5 = new Character(ctx,0,0,56,120, 0,'./image/5.png');
        viperIm6 = new Character(ctx,0,0,56,120, 0,'./image/6.png');
        viperIm7 = new Character(ctx,0,0,56,120, 0,'./image/7.png');
        viper.setImageCharacter(viperIm2,viperIm3,viperIm4,viperIm5,viperIm6,viperIm7,);

        viper.setComing(
            CANVAS_WIDTH / 2,
            CANVAS_HEIGHT + 50,
            CANVAS_WIDTH / 2,
            CANVAS_HEIGHT - 100
        );
        viper.setShotArray(shotArray, singleShotArray);

        for(i=0; i<ENEMY_SHOT_MAX_COUNT; ++i) {
            enemyShotArray[i] = new Shot(ctx, 0,0,32,32, './image/Enelgy1.png');
            enemyShotArray[i].setTargets([viper]);
            enemyShotArray[i].setExplosions(explosionArray1);
        }

        for(i = 0; i < HOMING_MAX_COUNT; ++i){
            homingArray[i] = new Homing(ctx, 0, 0, 32, 32, './image/Enelgy2.png');
            homingArray[i].setTargets([viper]); 
            homingArray[i].setExplosions(explosionArray1);
        }
        boss = new Boss(ctx, 0, 0, 288, 162, './image/Boss1.png');
        bossIm2 = new Character(ctx,0,0,288,162,0, './image/Boss2.png');
        bossIm3 = new Character(ctx,0,0,288,162,0, './image/Boss3.png');
        bossIm4 = new Character(ctx,0,0,288,162,0, './image/Boss4.png');
        bossIm5 = new Character(ctx,0,0,288,162,0, './image/Boss5.png');
        bossIm6 = new Character(ctx,0,0,288,162,0, './image/Boss6.png');
        bossIm7 = new Character(ctx,0,0,288,162,0, './image/Boss7.png');
        bossIm8 = new Character(ctx,0,0,288,162,0, './image/Boss8.png');
        bossIm9 = new Character(ctx,0,0,288,162,0, './image/Boss9.png');
        bossIm10 = new Character(ctx,0,0,288,162,0, './image/Boss10.png');
        bossIm11 = new Character(ctx,0,0,288,162,0, './image/Boss11.png');
        bossIm12 = new Character(ctx,0,0,288,162,0, './image/Boss12.png');
        bossIm13 = new Character(ctx,0,0,288,162,0, './image/Boss13.png');
        boss.setImageCharacter(bossIm2,bossIm3,bossIm4,bossIm5,bossIm6,bossIm7,bossIm8,bossIm9,bossIm10,bossIm11,bossIm12, bossIm13);
        boss.setShotArray(enemyShotArray);
        boss.setHomingArray(homingArray);
        boss.setAttackTarget(viper);

        for(i = 0; i < ENEMY_SMALL_MAX_COUNT; ++i){
            enemyArray[i] = new Enemy(ctx, 0, 0, 60, 60, './image/Zako1.png');
            enemyArray[i].setShotArray(enemyShotArray);
            enemyArray[i].setAttackTarget(viper);
        }

        for(i = 0; i < ENEMY_LARGE_MAX_COUNT; ++i){
            enemyArray[ENEMY_SMALL_MAX_COUNT + i] = new Enemy(ctx, 0, 0, 120, 120, './image/MiddleBoss.png');
            enemyArray[ENEMY_SMALL_MAX_COUNT + i].setShotArray(enemyShotArray);
            enemyArray[ENEMY_SMALL_MAX_COUNT + i].setAttackTarget(viper);
        }

        let concatEnemyArray = enemyArray.concat([boss]);


        for(i = 0; i < SHOT_MAX_COUNT; ++i){
            shotArray[i].setTargets(concatEnemyArray);
            singleShotArray[i * 2].setTargets(concatEnemyArray);
            singleShotArray[i * 2 + 1].setTargets(concatEnemyArray);
            shotArray[i].setExplosions(explosionArray1,explosionArray2,explosionArray3);
            singleShotArray[i * 2].setExplosions(explosionArray1,explosionArray2,explosionArray3);
            singleShotArray[i * 2 + 1].setExplosions(explosionArray1,explosionArray2,explosionArray3);
            shotArray[i].setSparks(sparkArray);
            singleShotArray[i * 2].setSparks(sparkArray);
            singleShotArray[i * 2 + 1].setSparks(sparkArray);
        }



        for(i = 0; i < BACKGROUND_STAR_MAX_COUNT; ++i){
            let size  = .6 + Math.random() * (BACKGROUND_STAR_MAX_SIZE - 1);
            let speed = 1 + Math.random() * (BACKGROUND_STAR_MAX_SPEED - 1);
            backgroundStarArray[i] = new BackgroundStar(ctx, size, speed);
            let x = Math.random() * CANVAS_WIDTH;
            let y = Math.random() * CANVAS_HEIGHT;
            backgroundStarArray[i].set(x, y);
        }

    }


    function loadCheck() {
        let ready = true;
        ready = ready && viper.ready;

        enemyArray.map((v) => {
            ready = ready && v.ready;
        });
        shotArray.map((v) => {
            ready = ready && v.ready;
        });
        homingArray.map((v) => {
            ready = ready && v.ready;
        });
        singleShotArray.map((v) => {
            ready = ready && v.ready;
        });
        enemyShotArray.map((v) => {
            ready = ready && v.ready;
        });

        if(ready === true) {
            eventSetting();
            sceneSetting();
            startTime = Date.now();
            render();
        } else {
            setTimeout(loadCheck, 100);
        }
    }


    function eventSetting() {
        window.addEventListener('keydown', (event) => {
            isKeyDown[`key_${event.key}`] = true;
            if(event.key === 'Enter') {
                if(viper.life <= 0) {
                    restart = true;
                }
            }
        },false);
        window.addEventListener('keyup', (event) => {
            isKeyDown[`key_${event.key}`] = false;
        },false);
    }

    function sceneSetting() {
        scene.add('intro', (time) => {
            if(time > 3.0) {
                scene.use('invade_default_type') 
            }
        });
        
        scene.add('invade_default_type', (time) => {
            if(scene.frame % 30 === 0) {
                for(let i=0; i<ENEMY_SMALL_MAX_COUNT; ++i) {
                    if(enemyArray[i].life <= 0) {
                        let e = enemyArray[i];
                        if(scene.frame % 60 === 0) {
                            e.set(-e.width, 30, 2, 'default');
                            e.setVectorFromAngle(degreesToRadians(30));
                        } else {
                            e.set(CANVAS_WIDTH + e.width, 30, 7, 'default');
                            e.setVectorFromAngle(degreesToRadians(150));
                        }
                        break;
                    }
                }
            }
            
            if(scene.frame === 270) {
                scene.use('blank');
            }
            if(viper.life <= 0) {
                scene.use('gameover');
            }
        });

        scene.add('blank', (time) => {
            if(scene.frame === 150) {
                scene.use('invade_wave_move_type');
            }
            if(viper.life <= 0) {
                scene.use('gameover');
            }
        });

        scene.add('invade_wave_move_type', (time) => {
            if(scene.frame % 50 === 0) {
                for(let i=0; i< ENEMY_SMALL_MAX_COUNT; ++i) {
                    if(enemyArray[i].life <= 0) {
                        let e = enemyArray[i];
                        if(scene.frame <= 200) {
                            e.set(CANVAS_WIDTH * 0.2, -e.height, 5, 'wave');
                        } else {
                            e.set(CANVAS_WIDTH * 0.8, -e.height, 5, 'wave');
                        }
                        break;
                    }
                }
            }

            if(scene.frame === 450) {
                scene.use('invade_large_type');
            }
            if(viper.life <= 0) {
                scene.use('gameover');
            }
        });

        scene.add('invade_large_type', (time) => {
            if(scene.frame === 100) {
                let i = ENEMY_SMALL_MAX_COUNT + ENEMY_LARGE_MAX_COUNT;
                for(let j = ENEMY_SMALL_MAX_COUNT; j < i; ++j) {
                    if(enemyArray[j].life <= 0) {
                        let e = enemyArray[j];
                        e.set(CANVAS_WIDTH / 2, -e.height, 50, 'large');
                        break;
                    }
                }
            }

            if(scene.frame === 700) {
                scene.use('invade_boss');
            }
            if(viper.life <= 0) {
                scene.use('gameover');
            }
        });

        scene.add('invade_boss', (time) => {
            if(scene.frame === 0) {
                boss.set(CANVAS_WIDTH / 2, -boss.height, 450);
                boss.setMode('invade'); 
            }
            if(viper.life <= 0) {
                scene.use('gameover');
                boss.setMode('escape');
            }
            if(boss.life <= 0) {
                scene.use('intro');
            }
        });

        scene.add('gameover', (time) => {
            let textWidth = CANVAS_WIDTH / 2;
            let loopWidth = CANVAS_WIDTH + textWidth;
            let x = CANVAS_WIDTH - (scene.frame * 2) % loopWidth;
            ctx.font = 'bold 72px sans_serif';
            util.drawText('RANK "D+"', x, CANVAS_HEIGHT / 2, '#ff0000', textWidth);
            if(restart === true) {
                restart = false;
                gameScore = 0;
                viper.setComing(
                    CANVAS_WIDTH / 2,
                    CANVAS_HEIGHT + 50,
                    CANVAS_WIDTH / 2,
                    CANVAS_HEIGHT - 100
                );
                scene.use('intro');
            }
        });
        scene.use('intro');
    }



    function render() {
        ctx.globalAlpha = 1.0;
        // util.drawRect(0,0,canvas.width, canvas.height, '#111122');


        let nowTime = (Date.now() - startTime) / 1000;
        let nowCol = Math.abs(Math.cos(nowTime) * 30);
        
        // util.drawRect(0,0,canvas.width, canvas.height, '#111122');
        util.drawRect(0,0,canvas.width, canvas.height, "rgb(20,"+nowCol+","+nowCol*1.5+")");
        
        
        scene.update();

        ctx.globalAlpha = 0.4;
        ctx.globalAlpha = 1.0;





        ctx.font = 'bold 24px monospace';
        util.drawText(zeroPadding(gameScore, 5), 30, 50, '#ffffff');

        backgroundStarArray.map((v) => {
            v.update();
        });
        viper.update();

        boss.update();
        enemyArray.map((v) => {
            v.update();
        });
        shotArray.map((v) => {
            v.update();
        });
        singleShotArray.map((v) => {
            v.update();
        });
        enemyShotArray.map((v) => {
            v.update();
        });
        homingArray.map((v) => {
            v.update();
        });
        explosionArray1.map((v) => {
            v.update();
        });
        explosionArray2.map((v) => {
            v.update();
        });
        explosionArray3.map((v) => {
            v.update();
        })
        sparkArray.map((v) => {
            v.update();
        });

        requestAnimationFrame(render);
    }


    function degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    function zeroPadding(number, count) {
        let zeroArray = new Array(count);
        let zeroString = zeroArray.join('0') + number;
        return zeroString.slice(-count);
    }



})();
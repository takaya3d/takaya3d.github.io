$('#page-top').click(function() {
	$('body,html').animate({
		scrollTop: 0
	},500);
	return false;
});

$(".openbtn").click(function() {
	$(this).toggleClass('active');
	$("#g-nav").toggleClass('panelactive');
	$("#g-nav li").toggleClass('smooth');
});

$("#g-nav a").click(function() {
	$(".openbtn").removeClass('active');
	$("#g-nav").removeClass('panelactive');
	$("g-nav li").removeClass('smooth');
});







//ランダムに現れるテキスト
var Obj = {
	loop: false,
	minDisplayTime: 2000,
	initialDelay: 100,
	autoStart: true,
	in: {
		effect: 'fadeInUp',
		delayScale: 1,
		delay: 100,
		sync: false,
		shuffle: true,
	},
	out: {
	}
}


//まれにelementにアクセスできないことがあるが、しっかり機能する。

var element
function RandomInit() {
	element = $(".randomAnime");
	$(element[0]).textillate(Obj);
}

function RandomAnimeControl() {
	var elemPos = $(element[1]).offset().top - 50;
	var scroll = $(window).scrollTop();
	var windowHeight = $(window).height();

	if(scroll >= elemPos - windowHeight) {
		$(element[1]).textillate(Obj);
	}
}



// 幾何学背景

particlesJS("particles-js",{
	"particles":{
		"number":{
			"value":38,/*この数値を変更すると幾何学模様の数が増減できる*/
			"density":{
				"enable":true,
				"value_area":500
			}
		},
		"color":{
			"value":"#e597b2"/*色 薄紅梅*/
		},
		"shape":{
			"type":"polygon",/*形状はpolygonを指定*/
			"stroke":{
				"width":0,
			},
	"polygon":{
		"nb_sides":5//多角形の角の数
	},
	"image":{
		"width":190,
		"height":100
	}
	},
		"opacity":{
		"value":0.564994832269074,
		"random":true,
		"anim":{
			"enable":true,
			"speed":2.2722661797524872,
			"opacity_min":0.08115236356258881,
			"sync":false
		}
		},
		"size":{
			"value":3,
			"random":true,
			"anim":{
				"enable":false,
				"speed":40,
				"size_min":0.1,
				"sync":false
			}
		},
		"line_linked":{
			"enable":true,
			"distance":170,
			"color":"#eebbcb",
			"opacity":0.6,
			"width":1
		},
		"move":{
			"enable":true,
			"speed":6,/*この数値を小さくするとゆっくりな動きになる*/
			"direction":"none",/*方向指定なし*/
			"random":false,/*動きはランダムにしない*/
			"straight":false,/*動きをとどめない*/
			"out_mode":"out",/*画面の外に出るように描写*/
			"bounce":false,/*跳ね返りなし*/
			"attract":{
				"enable":false,
				"rotateX":600,
				"rotateY":961.4383117143238
			}
		}
	},
	"interactivity":{
		"detect_on":"canvas",
		"events":{
			"onhover":{
				"enable":false,
				"mode":"repulse"
			},
	"onclick":{
		"enable":false
	},
	"resize":true
		}
	},
	"retina_detect":true,
	

});





function fadeAnime() {
	$('.fadeDownTrigger').each(function() {
		var elemPos = $(this).offset().top-50;
		var scroll = $(window).scrollTop();
		var windowHeight = $(window).height();
		if(scroll >= elemPos - windowHeight) {
			$(this).addClass('fadeDown');
		} else {
			$(this).removeClass('fadeDown');
		}
	});

	$('.smoothTrigger').each(function() {
		var elemPos = $(this).offset().top - 50;
		var scroll = $(window).scrollTop();
		var windowHeight = $(window).height();
		if(scroll >= elemPos - windowHeight) {
			$(this).addClass('smooth');
		} else {
			$(this).removeClass('smooth');
		}
	});
}


var unit = 100,
	canvasList,
	info = {},
	colorList;

	function init() {
		info.seconds = 0;
		info.t = 0;
			canvasList = [];
		colorList = [];
		// canvas1個めの色指定
		canvasList.push(document.getElementById("waveCanvas"));
		colorList.push(['#fdeff2', '#f6bfbc']);//重ねる波の色設定
		// 各キャンバスの初期化
	for(var canvasIndex in canvasList) {
			var canvas = canvasList[canvasIndex];
			canvas.width = document.documentElement.clientWidth; //Canvasのwidthをウィンドウの幅に合わせる
			canvas.height = 200;//波の高さ
			canvas.contextCache = canvas.getContext("2d");
		}
		// 共通の更新処理呼び出し
			update();
	}
	function update() {
		for(var canvasIndex in canvasList) {
        var canvas = canvasList[canvasIndex];
        // 各キャンバスの描画
        draw(canvas, colorList[canvasIndex]);
    }
    // 共通の描画情報の更新
    info.seconds = info.seconds + .014;
    info.t = info.seconds*Math.PI;
    // 自身の再起呼び出し
    setTimeout(update, 35);
}



//波の描画

function draw(canvas, color) {
		// 対象のcanvasのコンテキストを取得
    var context = canvas.contextCache;
    // キャンバスの描画をクリア
    context.clearRect(0, 0, canvas.width, canvas.height);

    //波の重なりを描画 drawWave(canvas, color[数字], 透過, 波の幅のzoom,波の開始位置の遅れ )
    drawWave(canvas, color[0], 0.5, 3, 0);//0.5⇒透過具合50%、3⇒数字が大きいほど波がなだらか
    drawWave(canvas, color[1], 0.4, 2, 250);
//    drawWave(canvas, color[2], 0.2, 1.6, 100);
}


function drawWave(canvas, color, alpha, zoom, delay) {
		var context = canvas.contextCache;
    context.fillStyle = color;//塗りの色
    context.globalAlpha = alpha;
    context.beginPath(); //パスの開始
    drawSine(canvas, info.t / 0.5, zoom, delay);
    context.lineTo(canvas.width + 10, canvas.height); //パスをCanvasの右下へ
    context.lineTo(0, canvas.height); //パスをCanvasの左下へ
    context.closePath() //パスを閉じる
    context.fill(); //波を塗りつぶす
}


function drawSine(canvas, t, zoom, delay) {
    var xAxis = Math.floor(canvas.height/2);
    var yAxis = 0;
    var context = canvas.contextCache;
    // Set the initial x and y, starting at 0,0 and translating to the origin on
    // the canvas.
    var x = t; //時間を横の位置とする
    var y = Math.sin(x)/zoom;
    context.moveTo(yAxis, unit*y+xAxis); //スタート位置にパスを置く

    // Loop to draw segments (横幅の分、波を描画)
    for (i = yAxis; i <= canvas.width + 10; i += 10) {
        x = t+(-yAxis+i)/unit/zoom;
        y = Math.sin(x - delay)/3;
        context.lineTo(i, unit*y+xAxis);
    }
}

init();


$(window).scroll(function() {
	fadeAnime();
	RandomAnimeControl();
});

//ページ読み込み時の記述
$(window).on('load', function() {
	var bar = new ProgressBar.Line(splash_text, {//id名を指定
		easing: 'easeInOut',//アニメーション効果linear、easeIn、easeOut、easeInOutが指定可能
		duration: 1000,//時間指定(1000＝1秒)
		strokeWidth: 0.2,//進捗ゲージの太さ
		color: '#cc847a',//進捗ゲージのカラー
		trailWidth: 0.9,//ゲージベースの線の太さ
		trailColor: '#ccc',//ゲージベースの線のカラー
		text: {//テキストの形状を直接指定				
			style: {//天地中央に配置
				position: 'absolute',
				left: '50%',
				top: '60%',
				padding: '0',
				margin: '-30px 0 0 0',//バーより上に配置
				transform:'translate(-50%,-50%)',
				'font-size':'1rem',
				color: '#cc847a',
			},
			autoStyleContainer: false //自動付与のスタイルを切る
		},
		step: function(state, bar) {
			bar.setText(Math.round(bar.value() * 100) + ' %'); //テキストの数値
		}
	});

bar.animate(1,0, function() {
	$("#splash").delay(100).fadeOut(200, function() {
		$('body').addClass('appear');

		fadeAnime();
		RandomInit();
		RandomAnimeControl();
	});
});


});



$('#menu-btn').click(function() {
    $('nav .navigation ul').addClass('active')
});
$('#menu-close').click(function() {
    $('nav .navigation ul').removeClass('active')
});


//テキストのカウントアップの設定
var bar = new ProgressBar.Line(splash_text, {//id名を指定
	strokeWidth: 0,//進捗ゲージの太さ
	duration: 100,//時間指定(1000＝1秒)
	trailWidth: 0,//線の太さ
	text: {//テキストの形状を直接指定	
		style: {//天地中央に配置
			position:'absolute',
			left:'50%',
			top:'50%',
			padding:'0',
			margin:'0',
			transform:'translate(-50%,-50%)',
			'font-size':'2rem',
			color:'#fff',
		},
		autoStyleContainer: false //自動付与のスタイルを切る
	},
	step: function(state, bar) {
		bar.setText(Math.round(bar.value() * 100) + ' <span>%</span>'); //テキストの数値
	}
});

//アニメーションスタート
bar.animate(1.0, function () {//バーを描画する割合を指定します 1.0 なら100%まで描画します
    
//=====ここからローディングエリア（splashエリア）を0.8秒でフェードアウトした後に動かしたいJSをまとめる    
	$("#splash").delay(100).fadeOut(200);
//=====ここまでローディングエリア（splashエリア）を0.8秒でフェードアウトした後に動かしたいJSをまとめる

}); 
       





particlesJS("particles-js",{
	"particles":{
		"number":{
			"value":10,//この数値を変更するとホタルの数が増減できる
			"density":{
				"enable":true,
				"value_area":1602.3971861905397
			}
		},
		"color":{
			"value":"#fff000"//色
		},
		"shape":{
			"type":"circle",//形状はcircleを指定
			"stroke":{
				"width":0,
			}
		},
		"opacity":{
			"value":.8,
			"random":true,//透過をランダムに
			"anim":{
				"enable":false,
				"speed":1.10115236356258881,
				"opacity_min":0,
				"sync":false
			}
		},
		"size":{
			"value":4.005992965476349,
			"random":true,//サイズをランダムに
			"anim":{
				"enable":true,
				"speed":24.345709068776642,
				"size_min":0.1,
				"sync":false
			}
		},
		"line_linked":{
			"enable":false,
		},
		"move":{
			"enable":true,
			"speed":5,//この数値を小さくするとゆっくりな動きになる
			"direction":"none",//方向指定なし
			"random":true,//動きはランダムに
			"straight":false,//動きをとどめない
			"out_mode":"out",//画面の外に出るように描写
			"bounce":false,//跳ね返りなし
			"attract":{
				"enable":false,
				"rotateX":600,
				"rotateY":600
			}
		}
	},
	"interactivity":{
		"detect_on":"canvas",
		"events":{
			"onhover":{
				"enable":false
			},
			"onclick":{
				"enable":false
			},
			"resize":true
		}
	},
	"retina_detect":true
});
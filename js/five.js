
$(function(){
//	var canvas = $("canvas").get(0);
	var canvas = $("#canvas").get(0);
    var ctx = canvas.getContext("2d");
// 	var canvas1 = $("#biao1").get(0);
//  var ctxa = canvas1.getContext("2d");
//  var canvas2 = $("#biao2").get(0);
//  var ctx2 = canvas2.getContext("2d");
    var audio=$("#audio").get(0);
    var aud=$("#aud").get(0);
	var sep=40;
	var SR=4;
	var BR=20;
	var qizi={};
	var center=$("#center");
	var AI=false;
  	var flag=true;
	var kongbai={};
	var gameStatus='pause';

	


	function minu(x,y){
		return x+"_"+y;
	}
	function lab(x){
		return  (x+0.5)*sep+0.5;
	}
	
	//画棋盘
		function drawqipan(){
			ctx.clearRect(0,0,600,600);
			ctx.save();
			ctx.beginPath();
			for(i=0;i<15;i++){
				ctx.moveTo(lab(0),lab(i));
				ctx.lineTo(lab(14),lab(i));
				ctx.moveTo(lab(i),lab(0));
				ctx.lineTo(lab(i),lab(14));
			}
			for(var i=0;i<15;i++){
		      for(var j=0;j<15;j++){
		        kongbai[minu(i,j)]=true;
		      }
    		}
			ctx.closePath();
			ctx.stroke();
			ctx.restore();
    	}
	 	drawqipan();
	//五个小原点
	function circle(x,y){
		ctx.save();
		ctx.beginPath();
		ctx.arc(sep*x+20.5,sep*y+20.5,SR,0,Math.PI*2);
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	}
	function cir(){
		circle(3,3);
		circle(11,3);
		circle(7,7);
		circle(11,11);
		circle(3,11);
	}
	cir();
	
	//落棋子
	function luoqizi(x,y,color){
		ctx.save();
		ctx.beginPath();
		ctx.translate(sep*x+20.5,sep*y+20.5);		
		ctx.arc(0,0,BR,0,Math.PI*2);
			var g=ctx.createRadialGradient(-10,-10,0,0,0,50);
			if(color==="black"){
				
				g.addColorStop(0.03,'#eee');
				g.addColorStop(0.1,'#000');
				g.addColorStop(1,'#000');
				
			}else{
				g.addColorStop(0.03,'#ddd');
				g.addColorStop(0.1,'#fff');
				g.addColorStop(1,'#fff');
			}
			ctx.shadowOffsetX=2;
        	ctx.shadowOffsetY=3;
        	ctx.shadowBlur=4;
        	ctx.shadowColor="rgba(0,0,0,0.5)"

//		qizi[x+"_"+y]=color;
		
		ctx.fillStyle=g;
		ctx.fill();
		ctx.closePath();
		ctx.restore();
		qizi[minu(x,y)]=color;
		delete kongbai[minu(x,y)];
		gameStatus="play";
		
	}


	//人机截堵
	var pos={};
    function intel(x,y){
      //棋盘上所有的空白位置
      var max=-Infinity;     
      for(var k in kongbai){
        var x=parseInt(k.split('_')[0]);
        var y=parseInt(k.split('_')[1]);    
        var m=panduan(x,y,'black');
        if(m>max){
          max=m;
         pos.x=x;
         pos.y=y;
//        audio.play()
        }
      }

	var max2=-Infinity;
	
      var pos2={};
      for(var k in kongbai){
        var x=parseInt(k.split('_')[0]);
        var y=parseInt(k.split('_')[1]);
        var m=panduan(x,y,'white');
        if(m>max2){
          max2=m;
          pos2.x=x;
          pos2.y=y;
//        aud.play()
        }
      }

      if(max>max2){
        return pos;
      }else{
        return pos2;
      }
      
    }
  
   
//点击落子原版
	
	
	function minu(x,y){
			return x+"_"+y;
	}


//点击落子
	var kai=true;
	function handleClick(e){
		var x=Math.floor(e.offsetX/sep);
		var y=Math.floor(e.offsetY/sep);
		if(qizi[minu(x,y)]){
			return;
		}
		if(AI){
			luoqizi(x,y,"black");
		    if(panduan(x,y,"black")>=5){
				$(canvas).off("click");
				$("#center").css({"top":"0","opacity":"1"});
				$("#center #text h1").html("黑棋!")
		    };
			var p=intel();
			luoqizi(p.x,p.y,"white");
			if(panduan(p.x,p.y,"white")>=5){
				$(canvas).off("click");
				$("#center").css({"top":"0","opacity":"1"});
				$("#center #text h1").html("白棋!")
			}
			return;
			
		}
		if(kai){
			luoqizi(x,y,"black");
			audio.play();
			c=setInterval(zhuan1,1000);
     		clearInterval(t);
			s=0;
			b(ctx1,s);
			if(panduan(x,y,"black")>=5){
				console.log(panduan(x,y,"black"))
//				console.log("黑棋赢");
				$("#center").css({"top":"0","opacity":"1"});
				$("#center #text h1").html("黑棋!")
				$(canvas).off("click");
				chess();
			}
			
		}else{
			luoqizi(x,y,"white");
			aud.play();
			t=setInterval(zhuan,1000);
     		clearInterval(c);
			m=0;
      		b(ctx2,m);	
			if(panduan(x,y,"white")>=5){
			$("#center").css({"top":"0","opacity":"1"});
			$("#center #text h1").html("白棋!")
			
				$(canvas).off("click");
				chess();
			}
			
		}
	
		kai=!kai;
		}
		$(canvas).on("click",handleClick);


//判断
function panduan(x,y,color){
		//行
		var i=1;var row=1;
		while(qizi[minu(x+i,y)]===color){
			row++;
			i++;
		}
		i=1;
		while(qizi[minu(x-i,y)]===color){
			row++;
			i++;
		}
		//列
		var i=1;var lie=1;
		while(qizi[minu(x,y+i)]===color){
			lie++;
			i++;
		}
		i=1;
		while(qizi[minu(x,y-i)]===color){
			lie++;
			i++;
		}
//		//左斜
		var i=1;var zX=1;
		while(qizi[minu(x+i,y+i)]===color){
			zX++;
			i++;
		}
		i=1;
		while(qizi[minu(x-i,y-i)]===color){
			yX++;
			i++;
		}
//		//右斜
		var i=1;var yX=1;
		while(qizi[minu(x-i,y+i)]===color){
			yX++;
			i++;
		}
		i=1;
		while(qizi[minu(x+i,y-i)]===color){
			yX++;
			i++;
		}

		return Math.max(row,lie,zX,yX);
	}

	
	//棋盘上的数字和下载图片
	chess=function(){
	
	ctx.save();
	ctx.font="20px/1 微软雅黑";
	ctx.textBaseline="middle";
	ctx.textAlign="center";
//	ctx.fillStyle="red";
	var i=1;
	for(var k in qizi){			
		var arr = k.split("_");
		if(qizi[k]==="black"){
			ctx.fillStyle="white";
		}else{
			ctx.fillStyle="black";
		}
		ctx.fillText(i++,lab(parseInt(arr[0])),lab(parseInt(arr[1])));
	}
		ctx.restore();
 			if($(".box").find("img").length){
            	$(".box").find("img").attr("src",canvas.toDataURL())
            }else{
            	$("<img>").attr("src",canvas.toDataURL()).appendTo(".box")
            }            
            if($(".box").find("a").length){
            	$(".box").find("a").attr("href",canvas.toDataURL())
            }else{
            	$("<img>").attr("href",canvas.toDataURL())
            	$("<a>").attr("href",canvas.toDataURL()).attr("download","qipu.png").appendTo(".box")
            }
	}
	
	
//人机对战 人人对战	
	$(".second").eq(3).on("click",function(){
			if(gameStatus==="play"){
				return;
			}
			$(".info").children().removeClass("color");
			$(this).addClass("color");
			AI=false;
		})
	$(".second").eq(4).on("click",function(){
			if(gameStatus==="play"){
				return;
			}
			$(".info").children().removeClass("color");
			$(this).addClass("color");
			console.log($(this));
			AI=true;
//			console.log(AI)
//			flag=true;
		})
	//查看棋谱
	function manual(){
		chess();
		
	}	
	$(".info .second").eq(0).on("click",function(){
		manual();
		
		$('.box').addClass("active");
	})
//	消除棋谱
	$("#close").on("click",function(){
		$('.box').removeClass("active");
		drawqipan();
		cir();
		 for(var k in qizi){
	        var x=parseInt(k.split('_')[0]);
	        var y=parseInt(k.split('_')[1]);
	        luoqizi(x,y,qizi[k]);
	      }
	})
	//再来一次
	function restart(){
//			ctx.clearReact(0,0width,width);
        	drawqipan();
        	cir();
        	$("#center").removeClass("activea");
        	$(canvas).on("click",handleClick);
        	$(".info .second").eq(1).on("click",handleClick);
        	qizi={};
        	flag=true;
        	$("#center").css({"opacity":"0","top":"-1500px"})
        	s=0;
        	b(ctx1,s);
        	clearInterval(c);
        	m=0;
        	b(ctx2,m);
		}
        $("#agin").on("click",restart);
        $(".info .second").eq(1).on("click",restart);
//     	qizi={};
//      flag=false;
		
	
	
	
	
	
	
	
	
	
	//秒针  转盘
	
	var canvas1=document.getElementById('biao1');
	var ctx1=canvas1.getContext('2d');
	var canvas2=document.getElementById('biao2');
	var ctx2=canvas2.getContext('2d');
	function b(ctx1,a){
		ctx1.clearRect(0,0,200,200);
		ctx1.save();
		ctx1.translate(100,100);
		ctx1.rotate(2*Math.PI*a/6);
		ctx1.beginPath();
		ctx1.moveTo(2,0);
		ctx1.arc(0,0,5,0,Math.PI*2);
		ctx1.fillStyle="indianred";
		ctx1.fill();
		ctx1.closePath();
		ctx1.beginPath();
		ctx1.moveTo(0,8);
		ctx1.lineTo(0,5);
		ctx1.moveTo(0,-5);
		ctx1.lineTo(0,-70);
		ctx1.strokeStyle="indianred";
		ctx1.stroke();
		ctx1.closePath();
		ctx1.restore();
		}
      b(ctx1,s);
      b(ctx2,m);
	//针
	var s=0;
	function zhuan(){
		ctx1.clearRect(0,0,200,200);
		s++;
		b(ctx1,s);
		if (s>=6) {
			clearInterval(t);
			s=0;
			b(ctx1,s);
			tishi.addClass('tishishow');
    		tsinfo.text('太慢了 认输吧');
		};
	}
//
    var m=0;
    var t,c;
	function zhuan1(){
		ctx2.clearRect(0,0,200,200);
		m++;
		b(ctx2,m);
		if (m>=6) {
			clearInterval(c);
			m=0;
			b(ctx2,m);
			tishi.addClass('tishishow');
    		tsinfo.text('太慢了 认输吧');
		};
	}

})
	

	
	

	
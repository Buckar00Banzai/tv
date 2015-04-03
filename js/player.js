var scenes;
var currentScenePos = 0;
var playing = true;
var playerBG;

tvStatic = new Audio('./media/static.ogg'); 
tvStatic.volume = 0.2;

if (typeof tvStatic.loop == 'boolean')
{
    tvStatic.loop = true;
}
else
{
    tvStatic.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
}
tvStatic.play();

$(document).ready(function(){
	getScenes();
})

function getScenes(){
	$.get('http://165.225.129.212:8080/vids/', function(data){
		scenes = data;
	}).done(function(){
		shuffle(scenes);
	});
}

/*----controls------*/
function playBtn(){
	if (playing == false) {
		playerBG.playVideo();
		$('.play').addClass('pause');
		playing = true;
	} else if (playing == true){
		playerBG.pauseVideo();
		$('.play').removeClass('pause');
		playing = false;
	}
}

/*----------------*/


/*----------------- YOUTUBE ------------*/
function onYouTubeIframeAPIReady() {
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		playerBG = new YT.Player('videoHero', {
			height: '125%',
			width: '125%',
			playerVars: {
				'autoplay': 1,
				'controls': 1,
				'autohide':1,
				// 'enablejsapi': 1,
				'wmode':'opaque',
				'origin': 'https://galoremag.com'
				// 'loop': 1
			},
			videoId: '',
			events: {
				'onReady': onPlayerReady,
				'onStateChange': onPlayerStateChange
			}
		});
	} else {
		playerMobile = new YT.Player('videoMobile', {
			width: 100 + '%',
			height: 100 + '%',
			playerVars: {
				'autoplay': 1,
				'controls': 0,
				'disablekb': 1,
				'enablejsapi': 1,
				'fs': 0,
				'iv_load_policy': 3,
				'loop': 1,
				'end': 57,
				'modestbranding': 1,
				'origin': 'https://galoremag.com',
				'showinfo': 0,
				'listType': 'playlist',
				'list': 'PLPp3tIzLUEwZYvOFg9pa-I2K7sQ54egCw'
			},
			events: {
			'onReady': onPlayerMobileReady
			// 'onStateChange': onPlayerStateChange
			}
		});
	}
}

function onPlayerReady(event) {
	loadYt(scenes[0].url)
	if (playerBG.getDuration() < 1){
        skipScene();
   	} else {
    	event.target.playVideo();

    }

    // SOUNDCHECK
	if (playerBG.isMuted(true)) {
		$('#mute').removeClass('lit') && playerBG.unMute();
	}
}

function onPlayerMobileReady() {
    // SOUNDCHECK
	if (playerMobile.isMuted(true)) {
		playerMobile.unMute();
	}

	playerMobile.setVolume(100);
    playerMobile.playVideo();
}

// function onPlayerMobileStateChange(event) {
// 	playerMobile.nextVideo();
// }

function loadYt(sceneId){
	playerBG.loadVideoById(sceneId);
}

function skipScene(){
	tvStatic.play();
	$('#videoHero').css({'opacity' : '0'});
	if (currentScenePos < (scenes.length - 1)){
		currentScenePos ++
		loadYt (scenes[currentScenePos].url)
	} else {
		currentScenePos = 0;
		loadYt (scenes[currentScenePos].url)
	}
}

function muteToggle() {
	if (playerBG.isMuted(true)) {
		$('#mute').removeClass('lit') && playerBG.unMute();
	} else {
		$('#mute').addClass('lit') && playerBG.mute();
	}
}

function loader(){
	$('.title').hide();
	$('.loader').show();
    $('.loaderBg').animate({'top':'1px'}, 2000);
	setTimeout(function(){
	    $('.loader').hide();
	    $('.title').show();
	    $('.loaderBg').animate({'top':'100px'}, 100);
    },1500);
}

function shuffle(array) {
  var currentIndex = array.length
    , temporaryValue
    , randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function fullScreen(){
    if(document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if(document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if(document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen();
    } else if(document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    }
}

// HEAT BTNS

function heatUp() {
	$('#heatFader').animate({opacity: '+=0.2'});
}

function heatDown() {
	$('#heatFader').animate({opacity: '-=0.2'});
}

// VOLUME KNOB

$(function(){

    var rad2deg = 180/Math.PI;
    var deg = 0;
    var bars = $('#dots');

    for(var i=0;i<29;i++){

        deg = i*12;

        // Create the colorbars

        $('<div class="colorBar">').css({
            transform:'rotate('+deg+'deg)',
            top: -Math.sin(deg/rad2deg)*80+100,
            left: Math.cos((180 - deg)/rad2deg)*80+100,
        }).appendTo(bars);
    }

    var colorBars = bars.find('.colorBar');
    var numBars = 0, lastNum = -1;

    $('#control').knobKnob({
        snap : 10,
        value: 40,
        turn : function(ratio){
            numBars = Math.round(colorBars.length*ratio);

            // Update the dom only when the number of active bars
            // changes, instead of on every move

            if(numBars == lastNum){
            	// $('#curVol').html("<p>Volume: " + playerBG.getVolume() + "</p>");
              	playerBG.setVolume(Math.round(numBars/30*100));
                return false;
            }
            lastNum = numBars;

            colorBars.removeClass('active').slice(0, numBars).addClass('active');
        }
    });
});
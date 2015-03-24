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
	playerBG = new YT.Player('videoHero', {
		height: '125%',
		width: '125%',
		playerVars: {
			'autoplay': 1,
			'controls': 1,
			'autohide':1,
			// 'enablejsapi': 1,
			'wmode':'opaque',
			'volume':50,
			'origin': 'http://dev.galoremag.com'
			// 'loop': 1
		},
		videoId: '',
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
}

function onPlayerReady(event) {
    event.target.playVideo();
}

function onPlayerStateChange(event) {
	if (event.data == 0){
		skipScene();
	}
	if (event.data == YT.PlayerState.PLAYING) {
		tvStatic.pause();
		$('#videoHero').css({'opacity' : '1'});
	}
}

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
		$('#mute').removeClass('yellowBack') && playerBG.unMute();
	} else {
		$('#mute').addClass('yellowBack') && playerBG.mute();
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
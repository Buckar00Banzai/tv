var scenes;
var currentScenePos = 0;
var playing = true;
var playerBG;


$(document).ready(function(){
	getScenes();
})

function getScenes(){
	$.get('http://165.225.129.212:8080/vids', function(data){
		scenes = data;
	}).done(function(){
		shuffle(scenes);
	});
}

/*----controls------*/
function playBtn(){
	if (playing == false && trackLoaded == false){
		playTrack(currentTrackPos);
		$('.play').addClass('pause');
		playing = true;
	} else if (playing == false && trackLoaded == true) {
		soundManager.play(currentTrackManagerId);
		playerBG.playVideo();
		$('.play').addClass('pause');
		playing = true;
	} else if (playing == true){
		pauseTrack();
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
			'enablejsapi': 1,
			'wmode':'opaque',
			'volume':0,
			'origin': 'http://galoremag.com',
			'loop': 1
		},
		videoId: '',
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
}

function onPlayerReady(event) {
	loadYt(scenes[0].url)
	if (playerBG.getDuration() < 1){
        skipScene();
   	} else {
    	event.target.playVideo();
    }
}

function onPlayerStateChange(event) {
	if (event.data == 0){
		skipScene();
	}

	if (event.data == YT.PlayerState.PLAYING) {
		$('#videoHero').css({'opacity' : '1'});
	}
}

function loadYt(sceneId){
   playerBG.loadVideoById(sceneId);
}

function skipScene(){
	playerBG.stopVideo();
	$('#videoHero').css({'opacity' : '0'});
	playerBG.nextVideo();
}

function muteToggle() {
	if (playerBG.isMuted(true)) {
		$('#mute').removeClass('yellowBack') && playerBG.unMute();
	} else {
		$('#mute').addClass('yellowBack') && playerBG.mute();
	}
}

/*--------------------------------*/

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
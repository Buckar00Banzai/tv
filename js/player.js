
var currentScenePos = 0;
var playing = true;
var playerBG;


$(document).ready(function(){
	initSC();
})

// function getScenes(){
// 	$.get('http://poolsideapi2.herokuapp.com/scenes?p=2', function(data){
// 		scenes = data;
// 	}).done(function(){
// 		shuffle(scenes);
// 	});
// }

function initSC(){
	SC.initialize({
	    client_id: "79cdb380ce78f8151a711462d92a2f11"
	});
}

/*----controls------*/
// function playBtn(){
// 	if (playing == false && trackLoaded == false){
// 		playTrack(currentTrackPos);
// 		$('.play').addClass('pause');
// 		playing = true;
// 	} else if (playing == false && trackLoaded == true) {
// 		soundManager.play(currentTrackManagerId);
// 		playerBG.playVideo();
// 		$('.play').addClass('pause');
// 		playing = true;
// 	} else if (playing == true){
// 		pauseTrack();
// 		playerBG.pauseVideo();
// 		$('.play').removeClass('pause');
// 		playing = false;
// 	}
// }

/*----------------*/


/*----------------- YOUTUBE ------------*/
function onYouTubeIframeAPIReady() {
	playerBG = new YT.Player('videoHero', {
	  height: '135%',
      width: '135%',
      playerVars: {
      	'autoplay': 1,
      	'controls': 1,
      	'autohide':1,
      	'wmode':'opaque',
      	'origin': 'http://galoremag.com',
      	'loop': 1,
      	'listType': 'playlist',
		'list': 'PLUfG5WpANuJpIm62ldjjpunTRb3hABEA4'
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
		$('#videoHero').css({'opacity' : '1'});
	}
}

function getRandomId() {
    var random_id = 0
    while(played_idx.indexOf(random_id) != -1) {
      random_id = Math.floor(Math.random * playlist.length)
    }
    return random_id
}

function skipScene(){
	event.data = 0;
	$('#videoHero').css({'opacity' : '0'});
	playerBG.playVideoAt(random_id);
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
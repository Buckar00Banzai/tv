var scenes;
var tracks;
var currentTrackPos = 0;
var currentScenePos = 0;
var playing = true;
var trackLoaded = false;
var currentTrackManagerId;
var playerBG;


$(document).ready(function(){
	getTracks();
	getScenes();
	initSC();
})

function getTracks(){
	$.get('http://poolsideapi2.herokuapp.com/tracks?p=2', function(data){
		tracks = data;
	}).done(function(){
		shuffle(tracks);
		playTrack(0);
	});
}


function getScenes(){
	$.get('http://poolsideapi2.herokuapp.com/scenes?p=2', function(data){
		scenes = data;
	}).done(function(){
		shuffle(scenes);
	});
}

function initSC(){
	SC.initialize({
	    client_id: "79cdb380ce78f8151a711462d92a2f11"
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





function loadTrackMeta(pos){
    $('p.song').html("<a href='"+ tracks[currentTrackPos].scUrl+"' target='_blank'>" + tracks[pos].title + " <br/> <i class='fa fa-soundcloud'></i> <br/> <span>" + tracks[pos].artist) + "</span></a>";
}

function playTrack(pos){
	loader();
	var trackId = tracks[pos].scId;
	SC.stream("/tracks/" + trackId,{
		onfinish: function() {
    		skipTrack();
  		},
  		onsuspend: function() {
    		skipTrack();
  		},
  		ondataerror : function(){
  			alert('error');
  		}
	}, function(sound){
  		sound.play({
	    onload: function() {
	      if (this.readyState == 2) {
	        skipTrack();
	      }
	    }
		});
  		$('.play').addClass('pause');
  		if( playerBG){
  			playerBG.playVideo();
  		}
  		currentTrackManagerId = sound.sID;
	});
	loadTrackMeta(pos);
	trackLoaded = true;
	playing = true;
}

function pauseTrack(){
	soundManager.pause(currentTrackManagerId);
}



/*----------------*/


/*----------------- YOUTUBE ------------*/
function onYouTubeIframeAPIReady() {
	playerBG = new YT.Player('videoHero', {
	  height: '135%',
      width: '135%',
      playerVars: { 'autoplay': 1, 'controls': 1,'autohide':1,'wmode':'opaque', 'volume' : 0 },
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
	$('#videoHero').css({'opacity' : '0'});
	if (currentScenePos < (scenes.length - 1)){
		currentScenePos ++
		loadYt (scenes[currentScenePos].url)
	} else {
		currentScenePos = 0;
		loadYt (scenes[currentScenePos].url)
	}
}




/*--------------------------------*/

function skipTrack(){

	if (playing == true){
		pauseTrack();
	}


	if (currentTrackPos < (tracks.length -1)){
		currentTrackPos++;
		playTrack(currentTrackPos);
	} else {
		currentTrackPos = 0;
		playTrack(currentTrackPos);
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
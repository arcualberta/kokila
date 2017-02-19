function kkInit(wrapperId)
{
	var wrapper = "#" + wrapperId;
	$(wrapper).append(
		'<span class="kk-player">\
			<span id="kk-playtoggle"></span>\
			<span id="kk-gutter" class="ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all">\
				<span id="kk-handle" class="ui-slider-handle"></span>\
			</span>\
			<span class="kk-loading"></span>\
			<audio preload="metadata" id="kk-audio">\
				<source src="https://archive.org/download/MBVCASkypeDiscussionRathupamaSuttaFeb102017/MBVCA_Skype%20Discussion_Rathu%CC%84pama_Sutta_Feb%2010_2017.ogg" type="audio/ogg">\
				<source src="https://archive.org/download/MBVCASkypeDiscussionRathupamaSuttaFeb102017/MBVCA_Skype%20Discussion_Rathu%CC%84pama_Sutta_Feb%2010_2017.mp3" type="audio/mpeg">\
			</audio>\
			<span class="kk-timeleft"></span>\
		</span>'
		);

	var audio = $(wrapper + " audio").get(0);
	var timeleft = $(wrapper + " .kk-timeleft").get(0);
	var loadingIndicator = $('.kk-player .kk-loading').get(0);
	var manualSeek = false;
	var loaded = false;
	var positionIndicator = $('.kk-player #kk-handle');

	var duration = "";
	var durationHrs = 0;

	$(timeleft).text(progressTime(0, 0));

	if ((audio.buffered != undefined) && (audio.buffered.length != 0)) {
	  $(audio).bind('progress', function() {
	     loaded = parseInt(((audio.buffered.end(0) / audio.duration) * 100), 10);
	    loadingIndicator.css({width: loaded + '%'});
	  });
	}
	else {
	  loadingIndicator.remove();
	}

	$(audio).bind('loadedmetadata', function() {
		$(timeleft).text(progressTime(0, audio.duration));
		$('.kk-player #kk-gutter').width($(wrapper).width - $(timeleft).width() - 50);
	});
	

	$(audio).bind('play',function() {
	  $("#kk-playtoggle").addClass('playing');
	}).bind('pause ended', function() {
	  $("#kk-playtoggle").removeClass('playing');
	});

	$("#kk-playtoggle").click(function() {
	  if (audio.paused) { audio.play(); }
	  else { audio.pause(); }
	});

	$(audio).bind('timeupdate', function() {
		$(timeleft).text(progressTime(audio.currentTime, audio.duration));


	  var rem = parseInt(audio.duration - audio.currentTime, 10),
	  pos = (audio.currentTime / audio.duration) * 100,
	  mins = Math.floor(rem/60,10),
	  secs = rem - mins*60;
	  //timeleft.text('-' + mins + ':' + (secs > 9 ? secs : '0' + secs));

	  if (!manualSeek) { positionIndicator.css({left: pos + '%'}); }
	  if (!loaded) {
	    loaded = true;

	    $('.kk-player #kk-gutter').slider({
	      value: 0,
	      step: 0.01,
	      orientation: "horizontal",
	      range: "min",
	      max: audio.duration,
	      animate: true,
	      slide: function() {
	        manualSeek = true;
	      },
	      stop:function(e,ui) {
	        manualSeek = false;
	        audio.currentTime = ui.value;
	      }
	    });
	  }

	});
}

function sec2HMS(seconds, forceHours){
	var hrs = Math.floor(seconds / 3600);
	var min = Math.floor((seconds - hrs * 3600)/ 60);
	var sec = Math.ceil(seconds - hrs * 3600 - min * 60);
	return (forceHours || hrs > 0 ? hrs + ":" : "") + Math.round(min) + ":" + Math.round(sec);
}

function progressTime(current, total){

	var showHours = total > 3600;
	var denominator = sec2HMS(total, showHours);
	var numerator = sec2HMS(current, showHours);
	return numerator + " / " + denominator;

}

function addSource(wrapperId, url, type){
	var audio = $("#" + wrapper + " audio").get(0);
}

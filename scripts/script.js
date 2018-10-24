var glitchAvatar = "http://www.samlegros.com/uploads/2/2/3/2/2232231/glitch-white-rgb_orig.png";
var urlStart = "https://wind-bow.gomix.me/twitch-api/";
var urlEnd = "?callback=?";
var tempUrl = [];
var finalUrl = [];

var options = [
    "users/",
    "streams/",
    "channels/"
];

var streamers = [
    "comster404",
    "gamesdonequick",
    "freecodecamp",
    "blizzheroes",
];

// example: urlStart + options[0] + streamers[0] + urlEnd
// finalUrls: (0-3: users) (4-7: streams) (8-11: channels)

$(document).ready(function() {
    buildUrls();
    populateStreamer(0);
    populateStreamer(1);
    populateStreamer(2);
    populateStreamer(3);
}); // end of document.ready function

$.fn.multiLine = function(text) {
    this.text(text);
    this.html(this.html().replace(/\n/g,'<br/>'));
    return this;
} // end of multiline function

function buildUrls() {
    for (var i = 0; i < options.length; i++) {
        for (var j = 0; j < streamers.length; j++) {
            tempUrl = urlStart + options[i] + streamers[j] + urlEnd;
            finalUrl.push(tempUrl);
        } // end of j for loop
    } // end of i for loop
} // end of buildUrls function

function getStreamer(number) {
    return $.getJSON(finalUrl[number]).then(function(data) {
        return {
            streamerStatus: data.status,
            streamerName: data.display_name,
            streamerAvatar: data.logo,
            streamerIsLive: data.stream,
            streamerUrl: data.url
        }; // end of return
    }); // end of getJSON function
} // end of getStreamer function

function populateStreamer(number) {
    getStreamer(number).then(function(data) {
        if (data.streamerStatus == 404) {
            $("#streamer" + number + "Avatar").attr("src", glitchAvatar);
            $("#streamer" + number + "Name").text(streamers[number]);
            $("#streamer" + number + "Info").text("not found");
            $("#streamer" + number + "Fa").html("<i class='fa fa-user-secret' aria-hidden='true'></i>");
        } else {
            $("#streamer" + number + "Name").text(data.streamerName);
            $("#streamer" + number + "Avatar").attr("src", data.streamerAvatar);

            getStreamer(number+4).then(function(data) {
                if (data.streamerIsLive == null) {
                    $("#streamer" + number + "Avatar").addClass("greyScaleImg");
                    $("#streamer" + number + "Div").addClass("isNotStreaming");
                    $("#streamer" + number + "Info").text("is not streaming");
                    $("#streamer" + number + "Fa").html("<i class='fa fa-moon-o' aria-hidden='true'></i>");
                } else {
                    $("#streamer" + number + "Div").addClass("isStreaming");
                    $("#streamer" + number + "Info").multiLine("is streaming\n" + data.streamerIsLive.game);
                    $("#streamer" + number + "Fa").html("<i class='fa fa-twitch' aria-hidden='true'></i>");
                    $("#streamer" + number + "Fa").addClass("animated shake");
                } // end of else

                getStreamer(number+8).then(function(data) {
                    $("#streamer" + number + "Link").attr("href", data.streamerUrl);
                }); // end of getStreamer function
            }); // end of getStreamer function
        } // end of else
    }); // end of getStreamer function
} // end of populateStreamer function

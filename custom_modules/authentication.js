/**
 * Created by Alex on 24/06/2016.
 */
var async = require("async");
var request = require("request");
var config = require("../config.js");

var auth = function(){
    var self = this;
    var storj = {};
    var who;
    this.spotifyKeys = {};



    this.me = function(){
        request("https://api.spotify.com/v1/me",{headers:{
            Authorization:"Bearer " + self.spotifyKeys.access_token
        }},function(err,resp,bod){
            who = JSON.parse(bod);
        });
    };

    this.request = function(){
        var requestURI;
        async.series([
            function(callback){
                var uri = "https://accounts.spotify.com/authorize";
                uri+="?client_id="+config.client_id;
                uri+="&response_type=code";
                uri+="&redirect_uri="+config.redirect_uri;
                callback(null,uri);
            }
        ],function(err,res){
            requestURI = res[0];
        });
        return requestURI;
    };

    this.keepFresh = function(){
        setInterval(function(){
            request.post("https://accounts.spotify.com/api/token",{form:{
                grant_type:"refresh_token",
                refresh_token:self.spotifyKeys.refresh_token,
                client_id:config.client_id,
                client_secret:config.client_secret
            }},function(err,resp,bod){
                bod = JSON.parse(bod);
                self.spotifyKeys.access_token = bod.access_token;
            });
        },3600000);
    };

    this.refresh = function(){
        request.post("https://accounts.spotify.com/api/token",{form:{
            grant_type:"refresh_token",
            refresh_token:self.spotifyKeys.refresh_token,
            client_id:config.client_id,
            client_secret:config.client_secret
        }},function(err,resp,bod){
            console.log(JSON.parse(bod));
        });
    };
};


module.exports = auth;



















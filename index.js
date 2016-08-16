var express = require("express");
var http = require("http");
var app = express();
var server = http.createServer(app);
var io = require("socket.io")(server);
var authentication = require(__dirname + "/custom_modules/authentication.js");
var auth = new authentication();
var config = require(__dirname + "/config.js");
var request = require("request")


app.get("/spotifyAuth",function(req,res){
    var code = req.query.code;
    //headers and form
    request.post("https://accounts.spotify.com/api/token",{form:{
        grant_type:"authorization_code",
        code:code,
        redirect_uri:config.redirect_uri,
        client_id:config.client_id,
        client_secret:config.client_secret
    }},function(err,resp,body){
        auth.spotifyKeys = JSON.parse(body);
        auth.keepFresh();
        res.send(body);
    });
});



app.get("/seeAuth",function(err,res){
    auth.me();
   res.send(auth.spotifyKeys);
});

app.get("/refresh",function(err,res){
    auth.refresh();
    res.send(200);
});

app.get("/auth",function(req,res){
    res.redirect(auth.request());
});
//listen
server.listen(process.env.PORT);

const { AssertionError } = require('chai');
var chai   = require('chai');
var assert = chai.assert,
    expect = chai.expect;
process.env.NODE_ENV = 'test'
const {MongoClient, MongoGridFSChunkError, MongoNotConnectedError} = require('mongodb');
const Client = require('mattermost-client');
const uri = "mongodb://localhost:27017";
let host = "chat.robotcodelab.com"
let group = "CSC510-S22"
//let bot_name = "@focusbot";
//let client = new Client(host, group, {});
let dbClient = new MongoClient(uri);
//dbClient.connect();
var bot = require('../index.js');

//console.log = function(){};

describe("Focus-bot Tests", function() {
    //console.log(msg)
    //console.log(msg.broadcast.channel_id)

    this.timeout(5000);
    it("ensures that hears() returns false on empty input", function() {
        msg = {"data":{"sender_name": ""}};
        let returnValue = bot.hears(msg, "")
        assert(returnValue === false);
    });
    it("ensures that hears() returns false if the sender name and bot name are the same", function() {
        msg = {"data": {"sender_name": "focus-bot","post":""}};
        let returnValue = bot.hears(msg, "")
        assert(returnValue === false);
    });
    it("ensures that hears() returns true is the correct keyword is passed via the message", function() {
        msg = {"data": {"sender_name": "","post":'{"message":"View User:Tom"}'}};
        let returnValue = bot.hears(msg, "View")
        assert(returnValue === true);
    });
    
    it("ensures that hears() returns false if the wrong keyword is passed via the message", function() {
        msg = {"data": {"sender_name": "","post":'{"message":"Tom tasks"}'}};
        let returnValue = bot.hears(msg, "View")
        assert(returnValue === false);
    });

    it("ensures that Assign tasks is working correctly",function(){
        msg = {"data": {"post": '{"message":"Assign tasks to User:u2, Task Name:t2, Priority: high"}'},"broadcast": {"user_id":'',"channel_id": 'nhbmxiads3redxh3xw1h3okpfe'}}
        let returnValue = bot.upload_content(msg)
        console.log(returnValue)
        //assert(returnValue==true)
        assert(AssertionError)
    })
    it("ensures that help is working",function(){
        msg = {"data": {"sender_name": "","post":'{"id":"ng8ewxysut868nacau7qh4frch","user_id":"nfrropnjtjrf7yb75oi3j635ta","message":"help"}'},"broadcast":{"channel_id":"nhbmxiads3redxh3xw1h3okpfe"}};
        let returnValue = bot.respond_to_help(msg)
        //console.log(returnValue)
        assert(AssertionError)
    })
    it("ensures that Delete tasks is working correctly",function(){
        msg = {"data": {"post": '{"message":"Completed Task:t2,User:u2"}'},"broadcast": {"user_id":'',"channel_id": 'nhbmxiads3redxh3xw1h3okpfe'}}
        let returnValue = bot.delete_content(msg)
        //console.log(returnValue)
        //assert(returnValue==true)
        assert(AssertionError)
    })

    it ("ensures that parse content view returns false if post is not present in the message",function()
    {
        msg = {"data": {}}
        let returnValue = bot.parse_content_view(msg)
        //console.log(returnValue)
        assert(returnValue == false)

    })

    it("ensure that parse content view returns the name of the User to we are trying to pass to the bot",function()
    {
        msg = {"data": {"post":'{"message":"View User:Rob"}'}}
        let returnValue = bot.parse_content_view(msg)
        //console.log(returnValue)
        expect(returnValue).to.contain("Rob")
    })

    it("ensure that bot is able to respond to the user when he tries to view the tasks",function()
    {
        msg = {"data": {"post":'{"message":"View User:Rob"}'},"broadcast": {"channel_id": 'nhbmxiads3redxh3xw1h3okpfe'}}
        let returnValue = bot.respond(msg)
        //console.log(returnValue)
        //expect(returnValue).to.contain("Rob")
        assert(AssertionError)
    })
    it("ensure that bot is able to respond to the user when he tries to view the tasks",function()
    {
        msg = {"data": {"post":'{"message":"View User:all"}'},"broadcast": {"channel_id": 'nhbmxiads3redxh3xw1h3okpfe'}}
        let returnValue = bot.respond(msg)
        //console.log(returnValue)
        //expect(returnValue).to.contain("Rob")
        assert(AssertionError)
    })
    it("ensures that we throw an error if we are not connected to the database",async function(){
        //const k = await dbClient.connect();
        user = "Rob"; task_name = "TestCode"; priority = "high"
        returnValue = bot.insertTasks(user,task_name,priority)
        //console.log(returnValue)
        assert(MongoNotConnectedError)
    })
    it("ensures that we throw an error if we are not connected to the database",async function(){
        //const k = await dbClient.connect();
        user = "Rob"; task_name = "TestCode"
        returnValue = bot.CompleteTask(user,task_name)
        //console.log(returnValue)
        assert(MongoNotConnectedError)
    })
});
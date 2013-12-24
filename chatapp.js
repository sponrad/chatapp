Messages = new Meteor.Collection("messages");
Rooms = new Meteor.Collection("rooms");
Notes = new Meteor.Collection("notes");
Subdomain = new Meteor.Collection("subdomain"); //or call this account?

var __urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
var __imgRegex = /\.(?:jpe?g|gif|png)$/i;

function parseURL($string){

    var exp = __urlRegex;
    return $string.replace(exp,function(match){
        __imgRegex.lastIndex=0;
        if(__imgRegex.test(match)){
            return '<a href="'+match+'" target="_blank"><img src="'+match+'" class="thumbnail" /></a>';
        }
        else{
            return '<a href="'+match+'" target="_blank">'+match+'</a>';
        }
    }
			  );
}

//LoggedIn = new Meteor.Collection("loggedIn");

if (Meteor.isClient) {

    Accounts.ui.config({
	passwordSignupFields: 'USERNAME_AND_EMAIL'
    });

    Template.main.roomSelected = function(){
	return Session.equals("room_id", undefined) ? false : true;
    }

    Template.users.users = function() {
	users = Meteor.users.find({
	    "profile.online": true
	}).fetch();
	    
	return users;
    }

    Template.users.avatar = function(){	
	//var hash = CryptoJS.MD5(this.emails[0].address);
	var hash = CryptoJS.MD5(this.username);
	return img_add = "http://www.gravatar.com/avatar/" + hash + "?s=40&d=identicon";
    }

    Template.roomSelect.rooms = function(){
	rooms = Rooms.find({}).fetch();
	return rooms;
    }

    Template.roomSelect.selected = function(){
	return Session.equals("room_id", this._id) ? 'selected' : '';
    }

    Template.roomSelect.events({
	'click #newRoom' : function(e) {
	    //turn this into a text box
	},
	'keypress #newRoom' : function(e) {
	    if (e.which == "13"){    //create a new room
		Rooms.insert({
		    user: Meteor.userId(),
		    username: Meteor.user().username,
		    name: $("#newRoom").val(),
		    createdAt: new Date(),
		});

		$("#newRoom").val("").focus();
		
	    }
	},
	'click .room' : function(e) {
	    Session.set("room_id", this._id);
	    Deps.flush();
	    $("#newMessage").focus();
	    $("#messages").scrollTop( $(document).height() + 99999999999999999 );
	}
    });

    Template.messages.rendered = function(){
	$("#messages").height($(window).height() - 160); //160 is the MAGIC
	$("#messages").scrollTop( $(document).height() + 99999999999999999 );

	$(document).ready( function(){
	    $(window).resize( function(){
		$("#messages").height( $(window).height() - 160);	
	    });
	});
    }

    Template.messages.messages = function(){
	messages = Messages.find({room_id: Session.get("room_id")}).fetch();
	return messages;
    }

    Template.messages.processedMessage = function(){
	return parseURL(this.message);
    }

    Template.messages.currentUser = function(){
	return (Meteor.user()._id == this.user) ? "currentUser" : "";
    }
    
    Template.newMessage.rendered = function(){
	$("#newMessage").focus();
    }

    Template.newMessage.events({
	'keypress #newMessage' : function(e) {
	    if (e.which == "13"){    //create a new message
		Messages.insert({
		    user: Meteor.userId(),
		    username: Meteor.user().username,
		    message: $("#newMessage").val(),
		    createdAt: new Date(),
		    room_id: Session.get("room_id"),
		});

		$("#messages").scrollTop( $(document).height() + 99999999999999999 );
		$("#newMessage").val("").focus();
		
	    }
	}
    });

}

if (Meteor.isServer) {
    Meteor.startup(function () {

    });
}
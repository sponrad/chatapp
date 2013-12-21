Messages = new Meteor.Collection("messages");
Rooms = new Meteor.Collection("rooms");
Notes = new Meteor.Collection("notes");
Subdomain = new Meteor.Collection("subdomain"); //or call this account?

//LoggedIn = new Meteor.Collection("loggedIn");

if (Meteor.isClient) {

    Accounts.ui.config({
	passwordSignupFields: 'USERNAME_AND_EMAIL'
    });

    Template.users.users = function() {
	users = Meteor.users.find({
	    "profile.online": true
	}).fetch();
	    
	return users;
    }

    Template.roomSelect.rooms = function(){
	rooms = Rooms.find({}).fetch();
	return rooms;
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
	}	
    });

    Template.messages.rendered = function(){
	$("#messages").height($(window).height() - 160); //160 is the MAGIC
	$("#messages").scrollTop( $(document).height() + Infinity);

	$(document).ready( function(){
	    $(window).resize( function(){
		$("#messages").height( $(window).height() - 160);	
	    });
	});
    }


    Template.messages.messages = function(){
	messages = Messages.find({}).fetch();
	return messages;
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
		});

		$("#newMessage").val("").focus();

		$("#messages").scrollTop( $(document).height() + 999999);
		
	    }
	}
    });

}

if (Meteor.isServer) {
    Meteor.startup(function () {

    });
}

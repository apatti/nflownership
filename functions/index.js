const functions = require('firebase-functions');
const admin = require('firebase-admin');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
admin.initializeApp(functions.config().firebase);
const adminUserKey = functions.config().adminUserKey; //This is set prior to deploying through firebase functions:config:set adminUserKey=<keyValue>
exports.endCurrentAuction = functions.https.onRequest((req,response)=>{
	const teamName=req.query.team;
	const user=req.query.user;
	if(user==adminUserKey)
	    {
		admin.database().ref('/CurrentTeam').once('value').then(function(snapshot){
			if(snapshot.val().name==teamName)
			    {
				var owner=snapshot.val().owner;
				var ownerkey=snapshot.val().ownerkey;
				var price = snapshot.val().price;
				response.status(201).send("Ended");
				return admin.database().ref('/Teams/'+teamName).update({"owner":owner,"price":price});
				//return response.
			    }
		    });
	    }
	else
	    {
		response.status(404).send("bad request");
		return;
	    }

    });

exports.startNewAuction = functions.https.onRequest((req,response)=>{
	const teamName=req.query.team;
	const user=req.query.user;
	if(user==adminUserKey)
	    {
		admin.database().ref('/CurrentTeam').set({'name':teamName,'owner':'Available','state':'new','price':20,"updatedAt":admin.database.ServerValue.TIMESTAMP});
		response.status(201).send("Started");
	    }
	else
	    {
		response.status(404).send("bad request");
	    }
    });

exports.bidAction = functions.https.onCall((data,context)=>{
	/*
	updates['/CurrentTeam/price']=parseInt(bidValue)+1;
	updates['/CurrentTeam/owner']=document.getElementById("username").innerHTML;
	updates['/CurrentTeam/ownerkey']=player;
	updates['/CurrentTeam/updatedAt']=firebase.database.ServerValue.TIMESTAMP;
	*/
	const price = data.price;
	const owner = data.owner;
	const ownerKey = data.ownerKey;
	const lastUpdate = data.lastUpdate;
	const state = data.state;
	const updatedAt = admin.database.ServerValue.TIMESTAMP;

	return admin.database().ref('/CurrentTeam').update({'price':price,'owner':owner,'ownerkey':ownerKey,'state':'update','updatedAt':updatedAt});

});

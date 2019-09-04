const functions = require('firebase-functions');
//this is using a node environment thats why we use require here

const admin = require(`firebase-admin`);
admin.initializeApp();
//we want to create a function that adds an admin role to a specific user

//there is a whole series on cloud functions later
exports.addAdminRole = functions.https.onCall((data, context) => {
    //check request is made by an admin
    if (context.auth.token.admin !== true){
        return {error: 'only admins can add other admins, :( '}
    }

    //get user and add custom claim (admin)
    return admin.auth().getUserByEmail(data.email).then(user => {
        return admin.auth().setCustomUserClaims(user.uid, {
            admin: true
        });
    }).then(() =>{
        //now we want to return a response to the user on the front end
        return {
            message: `Success! ${data.email} has been made an admin.`
        }
    }).catch(err => {
        return err;
    });
})
//now we can deploy this cloud function onto firebase.


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


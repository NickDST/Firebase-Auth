//add admin cloud function
const adminForm = document.querySelector('.admin-actions');
adminForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const adminEmail = document.querySelector('#admin-email').value;
    //initialized at index.html
    const addAdminRole = functions.httpsCallable('addAdminRole');
    addAdminRole({ email: adminEmail }).then(result => {
        console.log(result);
    });

})

//listen to auth status changes
auth.onAuthStateChanged(user => {

    console.log(user);
    //everytime someone logs in or logs out then this changes
    //it sees the first initialization as a change, by loading the page we can see the account

    //when logged out it reads "null" in the console.
    //if it doesnt exist then the user isnt logged in.
    //console.log(user);

    if(user){
        user.getIdTokenResult().then(idTokenResult => {
            //console.log(idTokenResult.claims.admin);
            user.admin = idTokenResult.claims.admin;
            setupUI(user);
        });
        console.log("User logged in: ", user);
        //Grab the document guides
        //use onSnapshot instead of .get().then()
        //what it also does is set up a realtime listener to the database,
        //whenever theres a change to the database, the thing fires again
        //a snapshot is a picture of the collection at point of time
        db.collection('guides').onSnapshot(snapshot => {
            //console.log(snapshot.docs)
            setupGuides(snapshot.docs);
            setupUI(user);
        }, err => {
            console.log(err.message)
        });
        
    } else {
        console.log('User is not logged in.');
        setupUI();
        setupGuides([]);
    }
})


// signup
const signupForm = document.querySelector('#signup-form');
//now we add an event listener

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    //console.log(email, password);

    //Now we can sign up the user, we use the method on the auth object
    //this will go out and communicate with the firebase server on the backend automatically
    auth.createUserWithEmailAndPassword(email, password).then( cred => {
        //when we save a new document to a collection that doesnt exist, 
        //firestore automatically creates it for us.
        //by passing .doc, it passes a document reference for us
        //we are creating a document and setting a property called bio on it
        //and it will have the same ID as the user. 
        return db.collection('users').doc(cred.user.uid).set({
            bio: signupForm['signup-bio'].value
        });
        //console.log(cred.user);
        //we get returned a user object with a lot of information. 
        
    }).then( () => {
         //okay now we clear the form and close the modal
         const modal = document.querySelector('#modal-signup');
         //we use the materialize library to get that instance and close it
         M.Modal.getInstance(modal).close();
         //this is a normal javascript method
         signupForm.reset();
         signupForm.querySelector('.error').innerHTML = '';

    }).catch(err => {
        signupForm.querySelector('.error').innerHTML = err.message;
    }); 
});

//create new guide
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //we have a handle on the guides collection
    //whatever we pass inside will be added to guides
    db.collection('guides').add({
        //createForm.title.value also works
        //if we have a hyphen then we can't use the ex above
        title: createForm['title'].value,
        content: createForm['content'].value
    }).then(() => {
        //we don't need to pass in anything
        //but we do need to clear the form and close the modal
        const modal = document.querySelector('#modal-create');
        //we use the materialize library to get that instance and close it
        M.Modal.getInstance(modal).close();
        //javascript default method to reset the form
        createForm.reset();
    }).catch(err => {
        //we catch the error and we can do soemthing with it
        console.log(err.message);
    })

})

//logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();

    //this is all we have to do, the username is already logged in so firebase will just log the student out
    auth.signOut().then( () =>{
        //console.log('the user has signed out');
    })
});



//logging in the user
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    //get user info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    auth.signInWithEmailAndPassword(email, password).then( cred => {
        //console.log(cred.user);
        //close the mlogin modal and reset the form
        const modal = document.querySelector('#modal-login');
        //we use the materialize library to get that instance and close it
        M.Modal.getInstance(modal).close();
        loginForm.reset();
        //the user has been logged in
        loginForm.querySelector('.error').innerHTML = '';
    }).catch(err => {
        loginForm.querySelector('.error').innerHTML = err.message;
    });

});

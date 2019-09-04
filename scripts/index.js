const guideList = document.querySelector('.guides');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');
const adminItems = document.querySelectorAll('.admin');

const setupUI = (user) => {
    if(user){
        if(user.admin){
            adminItems.forEach(item => item.style.display = 'block');
        }
        //account info
        //this is how to query the firestore
        db.collection('users').doc(user.uid).get().then(doc => {
            const html = `
            <div> Logged in as ${user.email} </div>
            <div> ${doc.data().bio} </div>
            <div class = "pink-text"> ${user.admin? 'Is Admin': 'Is not admin' } </div>
            `;
            accountDetails.innerHTML = html;
            //we also want to remove this if they log out
        });

        //toggle UI elements
        loggedInLinks.forEach(item => item.style.display = 'block');
        loggedOutLinks.forEach(item => item.style.display = 'none');
    } else {
        //hide account info
        accountDetails.innerHTML = '';

        //toggle UI elements
        adminItems.forEach(item => item.style.display = 'none');
        loggedInLinks.forEach(item => item.style.display = 'none');
        loggedOutLinks.forEach(item => item.style.display = 'block');
    }
}

//setup guides 
const setupGuides = (data) => {

    //if we have length, then we'll display the data,otherwise 

    if(data.length){

    let html = '';
    data.forEach(doc => {
        //we need to actually go out and grab that content
        //doc is each document, aka each object in the database
        //forEach cycles through the data and grabs the data from each doc
        const guide = doc.data();
        console.log(guide);
        //exporting a string to the DOM
        //below the escape key, we can dynamically put data into curly braces
        const li = `
        <li>
            <div class="collapsible-header grey lighten-4"> ${guide.title} </div>
            <div class="collapsible-body white"> ${guide.content}  </div>
        </li>
        `;

        //cycle through the data and append each one to the HTML
        html += li;
        
    });
    guideList.innerHTML = html;
    } else {
        guideList.innerHTML = '<h5 class ="center-align"> Log in to view guides </h5 >';
    }
}

//we need to initialize the modals
document.addEventListener('DOMContentLoaded', function() {
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);

    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);

});
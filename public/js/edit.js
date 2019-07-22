const mailField = document.getElementById('mail');
const passwordField = document.getElementById('password');
const displayNameField = document.getElementById('displayName');
const photoField = document.getElementById('photo');
const labels = document.getElementsByTagName('label');
const editButton = document.getElementById('edit');
const deleteButton = document.getElementById('delete');

const auth = firebase.auth();

const editInformation = () => {
    const newNameAndPhoto = {
        newDisplayName: displayNameField.value,
        newPhotoUrl: photoField.value,
    };
    const newEmail = mailField.value;
    const newPassword = passwordField.value;
    //Holds all the information about the current signed in user
    const user = auth.currentUser;

    changeNameAndPhoto(user, newNameAndPhoto);

    //Changes the email and password if the respective fields are filled with values
    if(newEmail && newPassword) {
        const credential = createCredential(user);
        changePassword(user, credential, newPassword);
        changeEmail(user, credential, newEmail);
    }
    //Changes only the email
    else if(newEmail) {
        const credential = createCredential(user);
        changeEmail(user, credential, newEmail);
    }
    //Changes only password
    else if(newPassword) {
        const credential = createCredential(user);
        changePassword(user, credential, newPassword);
    }
}

const changeNameAndPhoto = (user, newNameAndPhoto) => {
    const {newDisplayName, newPhotoUrl} = newNameAndPhoto;
    //Changes displayName and photoURL properties
    if(newDisplayName && newPhotoUrl)
        user.updateProfile({
            displayName: newDisplayName,
            photoURL: newPhotoUrl
        })
        .then(() => {
            window.location.assign('../profile');
        })
        .catch(error => {
            console.error(error);
        })
    //Changes only displaName
    else if(newDisplayName)
        user.updateProfile({
            displayName: newDisplayName
        })
        .then(() => {
            window.location.assign('../profile');
        })
        .catch(error => {
            console.error(error);
        })
    //Changes only photoURL
    else if(newPhotoUrl)
        user.updateProfile({
            photoURL: newPhotoUrl
        })
        .then(() => {
            window.location.assign('../profile');
        })
        .catch(error => {
            console.error(error);
        })
}

//Create credential for the reauthenticationWithCredential function which is a most do
//in order to change critical information such as changing email, password or
//deleting the account
const createCredential = user => {
    const password = prompt('Password:');
    const credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        password
    );
    return credential;
}

const changePassword = (user, credential, newPassword) => {
    user.reauthenticateWithCredential(credential)
    .then(() => {
        user.updatePassword(newPassword);
        console.log('Password has been updated !');
    })
    .catch(error => {
        console.error(error);
    })
}

const changeEmail = (user, credential, newEmail) => {
    user.reauthenticateWithCredential(credential)
    .then(() => {
        user.updateEmail(newEmail);
        console.log('Email has been updated !');
    })
    .catch(error => {
        console.error(error);
    })
}

const deleteAccount = () => {
    const user = auth.currentUser;
    const credential = createCredential(user);
    user.reauthenticateWithCredential(credential)
    .then(() => {
        user.delete();
        console.log('Account Deleted !');
    })
    .catch(error => {
        console.error(error);
    })
}

deleteButton.addEventListener('click', deleteAccount);

editButton.addEventListener('click', editInformation);

//Animations
mailField.addEventListener('focus', () => {
    labels.item(0).className = "focused-field";
});

passwordField.addEventListener('focus', () => {
    labels.item(1).className = "focused-field";
});

mailField.addEventListener('blur', () => {
    if(!mailField.value)
        labels.item(0).className = "unfocused-field";
});

passwordField.addEventListener('blur', () => {
    if(!passwordField.value)
        labels.item(1).className = "unfocused-field";
});

displayNameField.addEventListener('focus', () => {
    labels.item(2).className = "focused-field";
});

photoField.addEventListener('focus', () => {
    labels.item(3).className = "focused-field";
});

displayNameField.addEventListener('blur', () => {
    if(!displayNameField.value)
        labels.item(2).className = "unfocused-field";
});

photoField.addEventListener('blur', () => {
    if(!photoField.value)
        labels.item(3).className = "unfocused-field";
});
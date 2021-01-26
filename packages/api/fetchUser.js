import app from '../../utils/firebase';

export const fetchUserFromFirebaseApi = () => {
    app.auth().onAuthStateChanged(user => {
        if(user) {
            return {email: user.email, userId: user.uuid };
       }else {
           return null
       }
    });
};


export const fetchUsersFromFirebaseApi = () => {
    let dbRef = app.database().ref("users");
    dbRef.on("value", snap => snap.val());
};

export const fetchTweetsFromFirebaseApi = () => {
    let dbRef = app.database().ref("tweets");
    dbRef.on("value", snap => snap.val());
};

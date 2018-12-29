fa.onAuthStateChanged((user)=> {
    if(user) {
        window.location.href = 'home.html';
    }
});
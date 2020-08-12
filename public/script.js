document.getElementById('loginbtn').addEventListener('click', loginWithFacebook, false)

function loginWithFacebook() {

    FB.getLoginStatus(response => {
        if(response.status !== 'connected') {
            FB.login(response => {
                console.log(response);
            }, { scope: 'public_profile,email' });
            return false;
        } else {
            const { authResponse: { accessToken, userID } } = response;

            fetch('/login-facebook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ accessToken, userID })
            }).then(res => {
                console.log(res);
            })

            FB.api('/me', function(response) {
                console.log(JSON.stringify(response));
            });
        }
    });
}

// function fbSDKLoaded() {
    
//     FB.getLoginStatus(response => {
//         // statusChangeCallback(response);
//         console.log(response);

//         if(response.status == 'not_authorized') {
//             loginWithFacebook = _ => {
//                 FB.login(response => {
//                     console.log(response);
//                 }, { scopes: 'public_profile,email' });
//             }
//         }
//     });

// }
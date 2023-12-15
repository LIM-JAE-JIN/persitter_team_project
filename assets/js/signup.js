window.signup = signup;

async function signup() {
    const email = document.getElementById('email').value;
    const userName = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    const userInfo = {
        username: userName,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        phone: phone,
        address: address,
    };


    fetch('http://localhost:3000/api/users/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo),
    })
        .then((response) => response.json()) 
        .then((result) => {
            console.log(result.message);  
        if (result.success) {
            alert(`${result.message}`);
            window.location.href = '/page/signin.html';
        } else {
            alert(`${result.message}`);
            window.location.href = '/page/signup.html';

        }
    })
        .catch((error) => {
            console.log(error);
        });
}
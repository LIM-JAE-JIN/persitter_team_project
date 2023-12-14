window.signup = signup;

function signup() {
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
    }


    fetch('http://localhost:3000/api/users/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            if (data.success) {

                alert(`${data.message}`);
                window.location.href = '/page/signin.html';
            } else {
                alert(`${result.errorMessage}`);
                window.location.href = '/page/signup.html';

            }
        })
        .catch(error => {
            console.log(error.message);
        });
}
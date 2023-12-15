window.signin = signin;

async function signin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // 서버로 전송할 데이터 생성
    const userInput = {
        email: email,
        password: password,
    };


    const response = await fetch('http://localhost:3000/api/users/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userInput),
        })

        const userInfo = await response.json();
        
        console.log(userInfo)

        if(userInfo.success){
            alert(userInfo.message);
            window.location.href = '/page/main.html';
        } else {
            alert(userInfo.message);
            window.location.href = '/page/signin.html';
        }
}

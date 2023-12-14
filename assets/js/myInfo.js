const headers = {
  authorization: `${getCookieValue('connect.sid')}`,
  'Content-Type': 'application/json',
};

function getCookieValue(name) {
  const regex = new RegExp(`(^| )${name}=([^;]+)`);
  const match = document.cookie.match(regex);
  if (match) {
    return match[2];
  }
}

async function getUserInfo() {
  const response = await fetch('http://localhost:3000/api/users/me', {
    headers,
  });

  const user = await response.json();
  return userInfo;
}

async function getUser() {
  const headers = {
    authorization: `${getCookieValue('connect.sid')}`,
    'Content-Type': 'application/json',
  };

  const response = await fetch('http://localhost:3000/api/users/me', {
    method: 'get',
    headers,
  });
  if (response.ok) {
    return response.json();
  } else {
    const error = await response.json();
    throw Error(error.message);
  }
}

function auth() {
  const token = getCookieValue('connect.sid');
  return {
    token,
    requireLogin: async () => {
      try {
        if (!token) {
          throw Error('Invalid User');
        }
        const user = await getUser();
        return user;
      } catch {
        alert('인증된 사용자가 아닙니다.');
      }
    },
  };
}

//내정보 수정하기
$('#editBtn').on('click', async function () {
  const password = document.getElementById('userPassword').value;
  const phone = document.getElementById('userPhone').value;
  const imgUrl = document.getElementById('userImgUrl').value;
  const address = document.getElementById('userAddress').value;

  const editInput = {
    password,
    phone,
    imgUrl,
    address,
  };

  const profileEditData = await updateMyInfo(editInput);
});

async function updateMyInfo(profileDate) {
  try {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileDate),
    };
    const response = await fetch('http://localhost:3000/api/users/me');
    const data = await response.json();

    if (data.success) {
      console.log('프로필이 성공적으로 수정되었습니다.', data.data);
      alert('프로필이 수정되었습니다.');
      return data;
    } else {
      console.error('프로필 수정 실패: ', data, message);
      alert(data.message);
    }
  } catch (error) {
    console.log(error);
  }
}

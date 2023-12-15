const headers = {
  authorization: `${getCookieValue('connect.sid')}`,
  'Content-Type': 'application/json',
};

const { token, requireLogin } = auth();

document.addEventListener('DOMContentLoaded', async () => {
  const user = await requireLogin();
  const appointmentInfo = await getMyAppointment();
  console.log(appointmentInfo);

  document.getElementById(
    'span-user-email',
  ).innerHTML = `EMAIL : ${user.email}`;
  document.getElementById(
    'span-user-phone',
  ).innerHTML = `PHONE : ${user.phone}`;
  document.getElementById(
    'span-user-address',
  ).innerHTML = `ADDRESS : ${user.address}`;

  document.getElementById(
    'span-appointment-date',
  ).innerHTML = `Appointment Date : ${appointmentInfo[0].date}`;
  document.getElementById(
    'span-appointment-phone',
  ).innerHTML = `Appointment Phone : ${appointmentInfo[0].sitterPhone}`;
  document.getElementById(
    'span-appointment-address',
  ).innerHTML = `appointment address: ${appointmentInfo[0].address}`;
});

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

  const userInfo = await response.json();
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
        window.location.href = '/page/main.html';
      }
    },
  };
}

//내정보 수정하기

async function updateMyInfo(profileDate) {
  try {
    const options = {
      method: 'PUT',
      headers: {
        authorization: `${getCookieValue('connect.sid')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileDate),
    };
    const response = await fetch('http://localhost:3000/api/users/me', options);
    const data = await response.json();
  } catch (error) {
    console.log(error);
  }
}

$('#editBtn').on('click', async function () {
  const address = document.getElementById('userAddress').value;
  const phone = document.getElementById('userPhone').value;
  // const imgUrl = document.getElementById('userImgUrl').value ?? null;
  const password = document.getElementById('userPassword').value;

  const editInput = {
    password,
    phone,
    // imgUrl,
    address,
  };

  const profileEditData = await updateMyInfo(editInput);

  if (profileEditData) {
    alert('수정이 완료되었습니다');
  } else {
    alert('수정에 실패했습니다.');
    return;
  }
});

//예약 목록 가져오기
async function getMyAppointment() {
  try {
    const response = await fetch('http://localhost:3000/api/appointments', {
      headers,
    });

    const appointmentInfo = await response.json();

    const user = await getUserInfo();
    const appointment = appointmentInfo.data.filter(
      (data) => data.userId === user.userId,
    );

    return appointment;
  } catch (error) {
    console.log(error);
  }
}

//회원 탈퇴

window.signOut = signOut;
window.quitAppointment = quitAppointment;

async function signOut() {
  const msg = '탈퇴하시겠습니까?';
  const flag = confirm(msg);

  if (flag) {
    await deleteUser();
    alert('변경되었습니다.');
    res.clearCookie('connect.sid');
    window.location.href = '/page/main.html';
  } else alert('취소하였습니다.');
}

async function deleteUser() {
  const options = {
    method: 'DELETE',
    headers: {
      authorization: `${getCookieValue('connect.sid')}`,
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch('http://localhost:3000/api/users/me', options);
}

async function quitAppointment() {
  const msg = '예약을 취소 하시겠습니까?';
  const flag = confirm(msg);

  if (flag) {
    await deleteAppointment();
    alert('예약이 취소되었습니다.');
    location.reload(true);
  }
}

async function deleteAppointment() {
  const options = {
    method: 'DELETE',
    headers: {
      authorization: `${getCookieValue('connect.sid')}`,
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(
    `http://localhost:3000/api/appointments/${appointmentId}`,
  );
}

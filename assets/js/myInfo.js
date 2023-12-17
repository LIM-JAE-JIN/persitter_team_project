const headers = {
  authorization: `${getCookieValue('connect.sid')}`,
  'Content-Type': 'application/json',
};

const { token, requireLogin } = auth();

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const user = await requireLogin();
    const appointmentInfo = await getMyAppointment();
    const myPet = await getMyPets();

    document.getElementById(
      'span-user-email',
    ).innerHTML = `EMAIL : ${user.email}`;
    document.getElementById(
      'span-user-phone',
    ).innerHTML = `PHONE : ${user.phone}`;
    document.getElementById(
      'span-user-address',
    ).innerHTML = `ADDRESS : ${user.address}`;

    const appointmentlist = document.getElementById('appointment_list');

    if (appointmentInfo) {
      appointmentInfo.forEach((element) => {
        let appointmentHtml = ` 
          <a href="#" class="btn btn-primary" 
          onclick="quitAppointment()" style="float: right">예약 취소</a>
  
          <p class="card-text" id="span-appointment-date"
            style="font-size: 15px; margin-bottom: 10px;">
            Appointment Date : ${element.date}
           </p>
  
          <p class="card-text" id="span-appointment-phone"
            style="font-size: 15px; margin-bottom: 10px;">
            Appointment Phone : ${element.sitterPhone}
          </p>
  
          <p class="card-text" id="span-appointment-address" 
            style="font-size: 15px; margin-bottom: 20px; 
            border-bottom: 1px solid #000;">
            Appointment address: ${element.address}
          </p>    
        `;

        appointmentlist.innerHTML += appointmentHtml;
      });
    } else {
      appointmentlist.innerHTML += `<p style="font-size: 15px; margin-bottom: 10px;"> 아직 예약 목록이 없습니다.</p>`;
    }

    const petList = document.getElementById('petWrap');

    myPet.forEach((pet) => {
      let petHtml = `
    <li>
    <div class="card" >
      <img src="${pet.imgUrl}" class="card-img-top" alt="..." />
      <div class="card-body">
        <h5 class="card-title">${pet.petName}</h5>
        <p class="card-text">${pet.petAge}</p>
        <a href="#" class="btn btn-primary" onclick = "deleteMyPet(${pet.petId})" style="margin-top: 10px"
          >삭제</a
        >
      </div>
    </div>
  </li>      
        `;

      petList.innerHTML += petHtml;
    });
  } catch (error) {
    console.log(error);
  }
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

    return data;
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

window.deleteAccout = deleteAccout;
window.quitAppointment = quitAppointment;

async function deleteAccout() {
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
    const myAppointment = await getMyAppointment();
    await deleteAppointment(myAppointment[0].appointmentId);
    alert('예약이 취소되었습니다.');
    location.reload(true);
  }
}

async function deleteAppointment(appointmentId) {
  const options = {
    method: 'DELETE',
    headers: {
      authorization: `${getCookieValue('connect.sid')}`,
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(
    `http://localhost:3000/api/appointments/${appointmentId}`,
    options,
  );
}

// 내 펫 그려주기

async function getMyPets() {
  const response = await fetch('http://localhost:3000/api/pets/user');
  const responseData = await response.json();

  if (!responseData.success) {
    return alert(`${responseData.message}`);
  }
  const pets = responseData.data;

  if (pets.length === 0) {
    return alert('펫 등록 후 사용해주세요');
  }

  return pets;
}

//펫 등록

async function createMyPet(myPet) {
  try {
    const options = {
      method: 'POST',
      headers: {
        authorization: `${getCookieValue('connect.sid')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(myPet),
    };

    const response = await fetch('http://localhost:3000/api/pets', options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error.message);
  }
}

$('#create_btn').on('click', async function () {
  const petName = document.getElementById('petName').value;
  const petAge = document.getElementById('petAge').value;
  const imgUrl = document.getElementById('petUrl').value;
  const petCategory = document.getElementById('petCategory').value;

  console.log(imgUrl);

  const editInput = {
    petName,
    petAge: Number(petAge),
    imgUrl,
    petCategory,
  };

  const createdPet = await createMyPet(editInput);

  if (createdPet) {
    alert('펫이 등록이 완료되었습니다');
    location.reload(true);
  } else {
    alert('등록에 실패했습니다.');
    return;
  }
});

window.deleteMyPet = deleteMyPet;

//펫 삭제
async function deleteMyPet(petId) {
  const msg = '펫을 삭제 하시겠습니까?';
  const flag = confirm(msg);
  if (flag) {
    await deletePet(Number(petId));
    alert('펫이 삭제 되었습니다..');
    location.reload(true);
  }
}

async function deletePet(petId) {
  const options = {
    method: 'DELETE',
    headers: {
      authorization: `${getCookieValue('connect.sid')}`,
      'Content-Type': 'application/json',
    },
  };
  const response = await fetch(
    `http://localhost:3000/api/pets/${petId}`,
    options,
  );
}

import { drPopupOpen } from './common.js';
import { drPopupClose } from './common.js';

window.createReview = createReview;
window.appointPopupOpen = appointPopupOpen;
window.createAppointment = createAppointment;
window.deleteReview = deleteReview;
window.editReview = editReview;
window.editReviewBtn = editReviewBtn;

//팝업 열기
async function appointPopupOpen() {
  try {
    const response = await fetch(`http://localhost:3000/api/pets/user`);
    const responseData = await response.json();

    if (!responseData.success) {
      return alert(`${responseData.message}`);
    }
    const pets = responseData.data;

    if (pets.length === 0) {
      return alert('펫 등록 후 사용해주세요');
    }
    const myPetList = document.getElementById('myPetList');
    pets.forEach((pet) => {
      let petHtml = `<input type="checkbox"  value=${pet.petName} />
      <label >${pet.petName}</label>`;
      myPetList.innerHTML += petHtml;
    });
    drPopupOpen('#appointment_modal');
  } catch (error) {
    alert(`${error.message}`);
    // 에러 처리를 원하는 대로 수행
  }
}
// // 팝업닫기

// 예약하기 버튼 누를시
async function createAppointment(popName) {
  try {
    let myPetList = document.getElementById('myPetList');
    let checkboxes = myPetList.querySelectorAll(
      'input[type="checkbox"]:checked',
    );
    let sample6_address = document.getElementById('sample6_address').value;
    let sample6_detailAddress = document.getElementById(
      'sample6_detailAddress',
    ).value;
    let appointPets = [...checkboxes]

      .map((checkbox) => checkbox.value)
      .join(',');
    let selectSitter = document.getElementById('selectSitter').value;
    let appointmentDate = document.getElementById('appointmentDate').value;
    let appointmentPhone = document.getElementById('appointmentPhone').value;
    let appointAddress = sample6_address + '/' + sample6_detailAddress;
    let appointmentSignificant = document.getElementById(
      'appointmentSignificant',
    ).value;
    const data = {
      sitterName: selectSitter,
      pets: appointPets,
      date: appointmentDate,
      phone: appointmentPhone,
      address: appointAddress,
      significant: appointmentSignificant,
    };

    const response = await fetch(`http://localhost:3000/api/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();

    if (!responseData.success) {
      return alert(`${responseData.message}`);
    }
    alert('예약이 성공적으로 등록됬습니다');
    $('body').css('overflow', 'auto');
    $(popName).closest('.dr-popup-wrap').css('display', 'none');
    $('.dr-dim').css('display', 'none');
  } catch (error) {
    alert(`${error.message}`);
  }
}
// 예약하기 버튼 누를시

// Appointment Create
const getSitters = async () => {
  // 백엔드 조회 api 가져오기
  const response = await fetch(`http://localhost:3000/api/petsitter`);
  const responseData = await response.json();
  if (!responseData.success) {
    return alert(`${responseData.message}`);
  }
  const sitters = responseData.data;

  makeSitterList(sitters);
};
const makeSitterList = async (sitters) => {
  const sitterList = document.getElementById('selectSitter');
  sitterList.innerHTML = sitters
    .map((sitter) => `<option value="${sitter.name}">${sitter.name}</option>`)
    .join('');
};
// Appointment Create

// Review Create
async function createReview() {
  let reviewContent = document.getElementById('reviewContent').value;
  let reviewRaiting = document.getElementById('reviewRaiting').value;
  let queryString = window.location.search;
  let urlParams = new URLSearchParams(queryString);
  let sitterId = urlParams.get('sitter');
  const data = {
    content: reviewContent,
    raiting: +reviewRaiting,
  };
  try {
    const response = await fetch(
      `http://localhost:3000/api/reviews/${sitterId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
    );
    const responseData = await response.json();

    if (!responseData.success) {
      return alert(`${responseData.message}`);
    }
    let jsonSitterId = { sitterId: sitterId };
    await getSitterReviews(jsonSitterId);
    alert('댓글이 성공적으로 등록됬습니다');
    document.getElementById('reviewContent').value = '';
    document.getElementById('reviewContent').focus();
  } catch (error) {
    const errorResponse = JSON.parse(error.message);
    alert(`에러 발생: ${errorResponse.message}`);
  }
}
// Review Create

// SitterDetail get Data
let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let sitterId = urlParams.get('sitter');
const getSitter = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/petsitter/${sitterId}`,
    );
    const responseData = await response.json();
    const sitter = responseData.data;
    await getSitterReviews(sitter);
    getSitterInfo(sitter);
  } catch (error) {
    alert(`${error.message}`);
  }
};
const getSitterReviews = async (sitter) => {
  try {
    const sitterId = sitter.sitterId;
    const response = await fetch(
      `http://localhost:3000/api/reviews/${sitterId}`,
    );
    const responseData = await response.json();
    const reviews = await responseData.data;
    makeSitterReviews(reviews);
  } catch (error) {
    alert(`${error.message}`);
  }
};
const getSitterInfo = (sitter) => {
  const sitterImgUrl = document.getElementById('sitterImgUrl');
  const sitterInfo = document.getElementById('sitterInfoList');

  sitterImgUrl.src = sitter.imgUrl;
  sitterInfo.innerHTML = `   
    <li id="sitterCareer">경력:${sitter.career}</li>
    <li id="sitterPhone">전화번호:${sitter.phone}</li>
    <li id="sitterAddress">주소:${sitter.address}</li>
    <li id="sitterIntroduce">자기소개:${sitter.introduce}</li>`;
};

const makeSitterReviews = async (reviews) => {
  const reviewsList = document.getElementById('sitterReviewList');
  const response = await fetch('http://localhost:3000/api/users/me');
  const responseData = await response.json();

  reviewsList.innerHTML = '';
  console.log(reviews);
  reviews.forEach((review) => {
    if (responseData.userId == review.userId) {
      let reviewHtml = `<li class="reviews">
      <p>${review.raiting}</p>
      <p>
        <span style="font-weight: bold">${review.email}</span>
      </p>
      <p class="review-content">${review.content}</p>
      <div class="review-btnFD">
      <button class="btn btn-primary" onclick="editReview(${review.reviewId})">수정</button>
      <button class="btn btn-primary" onclick="deleteReview(${review.reviewId})">삭제</button>
        <p class="review-createdAt">${review.updatedAt}</p>
      </div>
    </li>`;
      reviewsList.innerHTML += reviewHtml;
    } else {
      let reviewHtml = `<li class="reviews">
      <p>${review.raiting}</p>
      <p>
        <span style="font-weight: bold">${review.email}</span>
      </p>
      <p class="review-content">${review.content}</p>
      <div class="review-btnFD">
        <p class="review-createdAt">${review.updatedAt}</p>
      </div>
    </li>`;
      reviewsList.innerHTML += reviewHtml;
    }
  });
};
async function deleteReview(reviewId) {
  try {
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    let sitterId = urlParams.get('sitter');

    const msg = '삭제하시겠습니까?';
    const flag = confirm(msg);

    if (flag) {
      await fetch(`http://localhost:3000/api/reviews/${sitterId}/${reviewId}`, {
        method: 'DELETE',
      });
      alert('삭제되었습니다.');
    } else alert('취소하였습니다.');

    let jsonSitterId = { sitterId: sitterId };
    await getSitterReviews(jsonSitterId);
  } catch (error) {
    alert(`${error.message}`);
  }
}
async function editReview(reviewId) {
  drPopupOpen('#reviewEditPopup');
  console.log(reviewId);
  const saveButton = document.getElementById('reviewEditbtn');
  console.log(saveButton);
  saveButton.addEventListener('click', async () => {
    await editReviewBtn(reviewId);
  });
}
async function editReviewBtn(reviewId) {
  console.log(reviewId);
  const editContent = document.getElementById('editContent');
  let reviewRaiting = document.getElementById('reviewRaiting').value;
  let queryString = window.location.search;
  let urlParams = new URLSearchParams(queryString);
  let sitterId = urlParams.get('sitter');
  const data = {
    content: `${editContent.value}`,
    raiting: +reviewRaiting,
  };

  const response = await fetch(
    `http://localhost:3000/api/reviews/${sitterId}/${reviewId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  );
  const responseData = await response.json();
  if (!responseData.success) {
    return alert(`${responseData.message}`);
  }
  let jsonSitterId = { sitterId: sitterId };
  await getSitterReviews(jsonSitterId);
  alert('댓글이 성공적으로 수정됬습니다');
  drPopupClose('#reviewEditPopup');
}

getSitter();
getSitters();
// SitterDetail get Data

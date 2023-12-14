$(document).ready(function () {
  var $images = $('.image');
  var currentIndex = 0;

  function changeImage() {
    // 현재 보이는 이미지의 클래스를 변경합니다.
    $images.eq(currentIndex).removeClass('opacity-100').addClass('transition-opacity-0');

    // 다음 이미지의 인덱스로 이동합니다.
    currentIndex = (currentIndex + 1) % $images.length;

    // 다음 이미지에 클래스를 추가하여 화면에 표시합니다.
    $images.eq(currentIndex).removeClass('transition-opacity-0').addClass('opacity-100');
  }

  // 3초마다 이미지 변경 함수를 호출합니다.
  setInterval(changeImage, 3000);
});

const getSitters = async () => {
  // 백엔드 조회 api 가져오기
  const response = await fetch(`http://localhost:3000/api/petsitter`);
  const responsetData = await response.json();
  const sitters = responsetData.data;

  makeCard(sitters);
};

getSitters();

const makeCard = (sitters) => {
  const listWrap = document.getElementById('sitterWrap');
  listWrap.innerHTML = sitters
    .map(
      (sitter) => `
      <li>
      <div class="card">
        <img
          src=${sitter.imgUrl}
          class="card-img-top"
          alt="..."
        />
        <div class="card-body">
          <h5 class="card-title" style="font-size: 16px">${sitter.name}</h5>
          <p class="card-text" style="margin-bottom: 10px; font-size: 13px">
            ${sitter.introduce}
            <br />
            <br />
            펫시터 경력 : ${sitter.career}
          </p>
          <a href="/page/sitterDetail.html?sitter=${sitter.sitterId}" class="btn btn-primary right">자세히 보기</a>
        </div>
      </div>
    </li>`,
    )
    .join('');
};
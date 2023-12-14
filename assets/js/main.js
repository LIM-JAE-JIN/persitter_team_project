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
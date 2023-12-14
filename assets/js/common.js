window.drPopupOpen = drPopupOpen;
window.drPopupClose = drPopupClose;

//팝업 열기
function drPopupOpen(popName) {
    $('body').css('overflow', 'hidden');
    $('.dr-dim').css('display', 'block');
    $(popName).css('display', 'block');
}
//팝업 닫기
function drPopupClose(im) {
    $('body').css('overflow', 'auto');
    $(im).closest('.dr-popup-wrap').css('display', 'none');
    $('.dr-dim').css('display', 'none');
}

$(document).ready(function () {
    // 세션 ID를 가져옵니다.
    var sessionId = getCookie('connect.sid');

    // 세션 ID가 있는지 여부에 따라 탭을 토글합니다.
    if (sessionId) {
        // 세션 ID가 있으면 로그인 상태로 간주하고 로그인 탭을 표시합니다.
        $('#loginTab').hide();
        $('#logoutTab').show();
    } else {
        // 세션 ID가 없으면 로그아웃 상태로 간주하고 로그아웃 탭을 표시합니다.
        $('#loginTab').show();
        $('#logoutTab').hide();
    }
});

// 쿠키에서 특정 이름의 쿠키 값을 가져오는 함수
function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
}

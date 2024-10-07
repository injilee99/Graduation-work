// auth.js

// JWT 토큰 디코딩 함수 (Base64 디코딩)
function decodeJWT(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// 로그인 상태 확인 함수
function checkLoginStatus() {
    const token = localStorage.getItem('token'); // localStorage에서 토큰 가져오기
    const nickname = localStorage.getItem('nickname'); // localStorage에서 닉네임 가져오기

    const welcomeMessage = document.getElementById('welcome-message');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');

    if (token && nickname) {
        if (welcomeMessage) {
            welcomeMessage.innerText = `환영합니다, ${nickname}님!`;
        }
        if (loginBtn) {
            loginBtn.style.display = 'none';
        }
        if (logoutBtn) {
            logoutBtn.style.display = 'inline-block';
        }
    } else {
        if (welcomeMessage) {
            welcomeMessage.innerText = '';
        }
        if (loginBtn) {
            loginBtn.style.display = 'inline-block';
        }
        if (logoutBtn) {
            logoutBtn.style.display = 'none';
        }
    }
}

// 로그아웃 처리 함수
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('nickname');
    checkLoginStatus();
}

// OAuth 로그인 시 URL에서 토큰을 추출하여 저장
function getTokenFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('access');
    if (token) {
        localStorage.setItem('token', token);
        const decodedToken = decodeJWT(token);
        localStorage.setItem('nickname', decodedToken.nickname);
        checkLoginStatus();
    }
}

// 페이지 로드 시 로그인 상태 확인
window.onload = function() {
    checkLoginStatus();
    getTokenFromUrl();
};

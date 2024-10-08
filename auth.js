// JWT 토큰 디코딩 함수 (Base64 디코딩)
function decodeJWT(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('토큰 디코딩 오류:', error);
        return null;
    }
}

// 로그인 상태 확인 함수
function checkLoginStatus() {
    const token = localStorage.getItem('token');
    const nickname = localStorage.getItem('nickname');

    console.log('로그인 상태 확인 - 토큰:', token, '닉네임:', nickname);

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
    console.log('로그아웃 완료');
    checkLoginStatus();
}

// OAuth 로그인 시 URL에서 토큰을 추출하여 저장
function getTokenFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('access');
    if (token) {
        console.log('URL에서 토큰 추출:', token);
        localStorage.setItem('token', token);
        const decodedToken = decodeJWT(token);
        if (decodedToken) {
            console.log('디코딩된 토큰:', decodedToken);
            localStorage.setItem('nickname', decodedToken.nickname || '알 수 없는 사용자');
        }
    }
}

// 페이지 로드 시 로그인 상태 확인 및 헤더 동적 로드
document.addEventListener("DOMContentLoaded", function () {
    // OAuth 토큰 추출 및 저장
    getTokenFromUrl();

    // 헤더를 동적으로 로드
    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header-placeholder").innerHTML = data;

            // 헤더가 로드된 후 로그인 상태 확인
            checkLoginStatus();

            // 로그아웃 버튼에 이벤트 리스너 추가
            const logoutButton = document.getElementById("logout-btn");
            if (logoutButton) {
                logoutButton.addEventListener("click", logout);
            }
        })
        .catch(error => console.error("헤더 로드 중 오류 발생:", error));
});

// 사용자 정보 가져오기
function fetchUserInfo() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('사용자 토큰이 없습니다.');
        return;
    }

    fetch('https://ludorium.store/api/user/mypage', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('서버 응답이 좋지 않습니다.');
            }
            return response.json();
        })
        .then(data => {
            console.log('서버로부터 받은 사용자 정보:', data);
            document.getElementById('user-email').innerText = data.email || '정보 없음';
            document.getElementById('user-social').innerText = data.socialType || '정보 없음';
            document.getElementById('user-birthdate').innerText = data.birthDate || '정보 없음';
            document.getElementById('user-tel').innerText = data.tel || '정보 없음';
            document.getElementById('user-gender').innerText = data.gender === 'M' ? '남자' : (data.gender === 'W' ? '여자' : '정보 없음');
        })
        .catch(error => console.error('사용자 정보 가져오는 중 오류 발생:', error));
}

document.addEventListener("DOMContentLoaded", fetchUserInfo);

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
    const token = localStorage.getItem('token');
    const welcomeMessage = document.getElementById('welcome-message');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');

    if (token) {
        const decodedToken = decodeJWT(token);
        const nickname = decodedToken.nickname;

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
    checkLoginStatus();
}

// OAuth 로그인 시 URL에서 토큰을 추출하여 저장
function getTokenFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('access');
    if (token) {
        localStorage.setItem('token', token);
    }
}

// 사용자 정보 가져오기
async function fetchUserInfo() {
    const token = localStorage.getItem('token');

    if (token) {
        try {
            const response = await fetch('https://ludorium.store/api/user/mypage', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                document.getElementById('user-nickname').innerText = `${userData.nickname} 님 안녕하세요!`;
                document.getElementById('user-email').innerText = userData.email || '이메일 정보 없음';
                document.getElementById('user-birthdate').innerText = userData.birthDate || '생년월일 정보 없음';
                document.getElementById('user-tel').innerText = userData.tel || '전화번호 정보 없음';
                document.getElementById('user-social').innerText = userData.social || '정보 없음';
                
                // 성별 처리 (M -> 남자, W -> 여자)
                document.getElementById('user-gender').innerText = userData.gender === 'M' ? '남자' : userData.gender === 'W' ? '여자' : '성별 정보 없음';
            } else {
                console.error('사용자 정보를 가져오는 중 오류 발생:', response.status);
            }
        } catch (error) {
            console.error('사용자 정보를 가져오는 중 오류 발생:', error);
        }
    }
}

// 페이지 로드 시 로그인 상태 및 사용자 정보 확인
document.addEventListener("DOMContentLoaded", function() {
    // OAuth 토큰 추출 및 저장
    getTokenFromUrl();

    // 헤더를 동적으로 로드
    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header-placeholder").innerHTML = data;

            // 헤더가 로드된 후 로그인 상태 확인
            checkLoginStatus();

            // 사용자 정보 가져오기
            fetchUserInfo();

            // 로그아웃 버튼에 이벤트 리스너 추가
            const logoutButton = document.getElementById("logout-btn");
            if (logoutButton) {
                logoutButton.addEventListener("click", logout);
            }
        })
        .catch(error => console.error("헤더 로드 중 오류 발생:", error));
});

// 헤더가 있는 모든 화면에서 사용: 로그인 확인, 이름 표시, 로그아웃

async function loadHeader() {
    const res = await fetch('/api/auth/me');

    // 로그인하지 않았으면 로그인 화면으로
    if (res.status === 401) {
        location.href = '/login.html';
        return;
    }

    const me = await res.json();
    document.getElementById('header-name').textContent = me.name;
}

document.getElementById('logout-btn').addEventListener('click', async () => {
    await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
            'X-XSRF-TOKEN': getCsrfToken()
        }
    });
    location.href = '/login.html';
});

loadHeader();
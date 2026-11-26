const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.hidden = true;

    const body = new URLSearchParams();
    body.append('loginId', document.getElementById('loginId').value.trim());
    body.append('password', document.getElementById('password').value);

    const submitBtn = loginForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'X-XSRF-TOKEN': getCsrfToken()
        },
        body: body
    });

    if (res.ok) {
        // 관리자는 관리자 화면으로, 일반 회원은 열람실 목록으로
        const meRes = await fetch('/api/auth/me');
        const me = await meRes.json();
        location.href = me.role === 'ADMIN' ? '/admin/status.html' : '/rooms.html';
        return;
    }

    const error = await res.json().catch(() => ({}));
    loginError.textContent = error.message || '로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.';
    loginError.hidden = false;
    submitBtn.disabled = false;
});
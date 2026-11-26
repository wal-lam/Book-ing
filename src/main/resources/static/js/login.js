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
        location.href = '/rooms.html';
        return;
    }

    const error = await res.json().catch(() => ({}));
    loginError.textContent = error.message || '로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.';
    loginError.hidden = false;
    submitBtn.disabled = false;
});
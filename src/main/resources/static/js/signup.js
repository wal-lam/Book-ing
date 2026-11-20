const signupForm = document.getElementById('signup-form');
const signupError = document.getElementById('signup-error');

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    signupError.hidden = true;

    const data = {
        loginId: document.getElementById('loginId').value.trim(),
        password: document.getElementById('password').value,
        passwordConfirm: document.getElementById('passwordConfirm').value,
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim()
    };

    if (data.password !== data.passwordConfirm) {
        showError('비밀번호가 일치하지 않습니다.');
        return;
    }

    // 응답을 기다리는 동안 버튼을 막아 중복 가입 요청을 방지
    const submitBtn = signupForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': getCsrfToken()
        },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        alert('회원가입이 완료되었습니다. 로그인해 주세요.');
        location.href = '/login.html';
        return;
    }

    // 에러 응답 { code, message }. JSON이 아닌 응답이 오면 빈 객체로 처리
    const error = await res.json().catch(() => ({}));
    showError(error.message || '회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    submitBtn.disabled = false;
});

function showError(message) {
    signupError.textContent = message;
    signupError.hidden = false;
}

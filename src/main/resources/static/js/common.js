// 쿠키에서 CSRF 토큰을 꺼낸다. POST/PUT 요청 헤더에 담아 보낼 때 사용
function getCsrfToken() {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === 'XSRF-TOKEN') {
            return decodeURIComponent(value);
        }
    }
    return '';
}

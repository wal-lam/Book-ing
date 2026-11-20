// 퍼블리싱 확인용 더미 배치도. 3단계 API 연동 때 삭제하고 fetch로 바꾼다.

const STATUS_TEXT = {
    AVAILABLE: '빈 자리',
    IN_USE: '사용 중',
    MINE: '내 자리',
    INACTIVE: '사용 중지'
};

// 한 줄(posY)에 좌석 여러 개를 만든다
function makeRow(rowName, posY, posXList) {
    const seats = [];
    for (let i = 0; i < posXList.length; i++) {
        seats.push({
            seatNo: rowName + '-' + (i + 1),
            posX: posXList[i],
            posY: posY,
            status: 'AVAILABLE'
        });
    }
    return seats;
}

// 한 열(posX)에 좌석 여러 개를 만든다 (벽면 좌석용)
function makeColumn(rowName, posX, posYList) {
    const seats = [];
    for (let i = 0; i < posYList.length; i++) {
        seats.push({
            seatNo: rowName + '-' + (i + 1),
            posX: posX,
            posY: posYList[i],
            status: 'AVAILABLE'
        });
    }
    return seats;
}

function setStatus(seats, seatNoList, status) {
    seats.forEach(function (seat) {
        if (seatNoList.includes(seat.seatNo)) {
            seat.status = status;
        }
    });
}

// 제1열람실: 가운데 통로(6열), 두 줄씩 마주 보는 책상 3묶음
const room1 = { name: '제1열람실', info: '중앙도서관 3층 · 06:00 ~ 23:00', seats: [] };
const room1X = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11];
room1.seats = room1.seats
    .concat(makeRow('A', 1, room1X))
    .concat(makeRow('B', 2, room1X))
    .concat(makeRow('C', 4, room1X))
    .concat(makeRow('D', 5, room1X))
    .concat(makeRow('E', 7, room1X))
    .concat(makeRow('F', 8, room1X));
setStatus(room1.seats, [
    'A-1', 'A-2', 'A-5', 'A-6', 'A-9', 'B-2', 'B-3', 'B-7', 'B-8', 'B-10',
    'C-1', 'C-4', 'C-5', 'C-6', 'C-8', 'D-1', 'D-2', 'D-3', 'D-7', 'D-9',
    'E-2', 'E-4', 'E-6', 'E-10', 'F-1', 'F-3', 'F-5', 'F-6', 'F-8', 'F-9',
    'F-10', 'E-7', 'C-10'
], 'IN_USE');
setStatus(room1.seats, ['B-4'], 'MINE');
setStatus(room1.seats, ['A-8', 'D-5'], 'INACTIVE');

// 제2열람실: 칸막이 1인석 10석 x 4줄, 줄 사이 한 칸 띄움 (만석)
const room2 = { name: '제2열람실', info: '중앙도서관 4층 · 09:00 ~ 22:00', seats: [] };
const room2X = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
room2.seats = room2.seats
    .concat(makeRow('A', 1, room2X))
    .concat(makeRow('B', 3, room2X))
    .concat(makeRow('C', 5, room2X))
    .concat(makeRow('D', 7, room2X));
room2.seats.forEach(function (seat) {
    seat.status = 'IN_USE';
});
setStatus(room2.seats, ['C-10'], 'INACTIVE');

// 노트북열람실: 벽면 ㄷ자 좌석 + 가운데 섬형 테이블
const room3 = { name: '노트북열람실', info: '중앙도서관 2층 · 09:00 ~ 21:00', seats: [] };
room3.seats = room3.seats
    .concat(makeRow('W', 1, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))
    .concat(makeColumn('L', 1, [3, 4, 5, 6, 7]))
    .concat(makeColumn('R', 10, [3, 4, 5, 6, 7]))
    .concat(makeRow('T', 4, [4, 5, 6, 7, 8]))
    .concat(makeRow('U', 5, [4, 5, 6, 7, 8]));
setStatus(room3.seats, ['L-5', 'T-3'], 'INACTIVE');

const DUMMY_ROOMS = { 1: room1, 2: room2, 3: room3 };

// mode가 'admin'이면 보기 전용(span), 'user'면 선택 가능한 버튼으로 그린다
function renderSeatMap(roomId) {
    const map = document.getElementById('seat-map');
    const mode = map.dataset.mode;
    const room = DUMMY_ROOMS[roomId] || DUMMY_ROOMS[1];

    map.innerHTML = '';

    room.seats.forEach(function (seat) {
        let status = seat.status;
        // 관리자 화면에는 '내 자리'가 없다
        if (mode === 'admin' && status === 'MINE') {
            status = 'IN_USE';
        }

        let el;
        if (mode === 'admin') {
            el = document.createElement('span');
        } else {
            el = document.createElement('button');
            el.type = 'button';
            el.dataset.seatId = seat.seatNo;
            el.setAttribute('aria-label', seat.seatNo + ' ' + STATUS_TEXT[status]);
            if (status !== 'AVAILABLE') {
                el.disabled = true;
            }
        }

        el.className = 'seat seat-' + status.toLowerCase().replace('_', '-');
        el.style.gridColumn = seat.posX;
        el.style.gridRow = seat.posY;
        el.textContent = seat.seatNo;
        map.appendChild(el);
    });

    // 사용자 배치도: 열람실 이름, 정보
    const nameEl = document.getElementById('room-name');
    const infoEl = document.getElementById('room-info');
    if (nameEl && infoEl) {
        nameEl.textContent = room.name;
        infoEl.textContent = room.info;
    }

    // 관리자 실시간 현황: 좌석 수 요약
    const totalEl = document.getElementById('stat-total');
    if (totalEl) {
        let inUse = 0;
        let available = 0;
        let inactive = 0;
        room.seats.forEach(function (seat) {
            if (seat.status === 'AVAILABLE') available++;
            else if (seat.status === 'INACTIVE') inactive++;
            else inUse++;
        });
        totalEl.textContent = room.seats.length;
        document.getElementById('stat-in-use').textContent = inUse;
        document.getElementById('stat-available').textContent = available;
        document.getElementById('stat-inactive').textContent = inactive;
    }
}

// 사용자 화면은 주소의 roomId, 관리자 화면은 열람실 선택 상자 기준
const roomSelect = document.getElementById('room-select');
if (roomSelect) {
    renderSeatMap(roomSelect.value);
    roomSelect.addEventListener('change', function () {
        renderSeatMap(roomSelect.value);
    });
} else {
    const params = new URLSearchParams(location.search);
    renderSeatMap(params.get('roomId'));
}

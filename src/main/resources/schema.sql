-- 자식 테이블부터 삭제 (외래키 때문에 순서 중요)
DROP TABLE IF EXISTS seat_usage;
DROP TABLE IF EXISTS seat;
DROP TABLE IF EXISTS reading_room;
DROP TABLE IF EXISTS member;

CREATE TABLE member (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    login_id        VARCHAR(50)  NOT NULL UNIQUE,
    password        VARCHAR(100) NOT NULL,
    name            VARCHAR(50)  NOT NULL,
    email           VARCHAR(100) NOT NULL,
    role            VARCHAR(20)  NOT NULL DEFAULT 'USER',
    suspended_until DATETIME     NULL,
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reading_room (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(50)  NOT NULL,
    location    VARCHAR(100) NOT NULL,
    open_time   TIME         NOT NULL,
    close_time  TIME         NOT NULL,
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE seat (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_id    BIGINT      NOT NULL,
    seat_no    VARCHAR(10) NOT NULL,
    pos_x      INT         NOT NULL,
    pos_y      INT         NOT NULL,
    is_active  BOOLEAN     NOT NULL DEFAULT TRUE,
    FOREIGN KEY (room_id) REFERENCES reading_room(id),
    UNIQUE (room_id, seat_no)
);

CREATE TABLE seat_usage (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    seat_id       BIGINT      NOT NULL,
    member_id     BIGINT      NOT NULL,
    start_at      DATETIME    NOT NULL,
    end_at        DATETIME    NOT NULL,
    returned_at   DATETIME    NULL,
    extend_count  INT         NOT NULL DEFAULT 0,
    status        VARCHAR(20) NOT NULL,
    FOREIGN KEY (seat_id)   REFERENCES seat(id),
    FOREIGN KEY (member_id) REFERENCES member(id),
    INDEX idx_usage_status_end (status, end_at)
);

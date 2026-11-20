package com.readingroom.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;

// 이용 규칙 위반(중복 아이디, 이미 사용 중인 좌석 등)을 알릴 때 던지는 예외
@Getter
public class BusinessException extends RuntimeException {

    private final HttpStatus status;
    private final String code;

    public BusinessException(HttpStatus status, String code, String message) {
        super(message);
        this.status = status;
        this.code = code;
    }
}

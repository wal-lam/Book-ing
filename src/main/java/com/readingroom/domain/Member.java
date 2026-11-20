package com.readingroom.domain;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Member {
    private Long id;
    private String loginId;
    private String password;
    private String name;
    private String email;
    private String role;
    private LocalDateTime suspendedUntil;
    private LocalDateTime createdAt;
}

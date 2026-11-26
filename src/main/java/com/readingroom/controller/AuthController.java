package com.readingroom.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;

import com.readingroom.dto.LoginMember;
import com.readingroom.dto.MeResponse;
import com.readingroom.dto.SignupRequest;
import com.readingroom.service.MemberService;
import com.readingroom.dto.LoginMember;
import com.readingroom.dto.MeResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final MemberService memberService;

    @PostMapping("/signup")
    public ResponseEntity<Void> signup(@Valid @RequestBody SignupRequest request) {
        memberService.signup(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/me")
    public MeResponse me(@AuthenticationPrincipal LoginMember loginMember) {
        return new MeResponse(loginMember.getLoginId(), loginMember.getName(), loginMember.getRole());
    }
}

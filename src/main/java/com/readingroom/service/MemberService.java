package com.readingroom.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.readingroom.domain.Member;
import com.readingroom.dto.SignupRequest;
import com.readingroom.exception.BusinessException;
import com.readingroom.mapper.MemberMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberMapper memberMapper;
    private final PasswordEncoder passwordEncoder;

    public void signup(SignupRequest request) {
        if (!request.getPassword().equals(request.getPasswordConfirm())) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "PASSWORD_MISMATCH", "비밀번호가 일치하지 않습니다.");
        }

        if (memberMapper.countByLoginId(request.getLoginId()) > 0) {
            throw new BusinessException(HttpStatus.CONFLICT, "DUPLICATE_LOGIN_ID", "이미 사용 중인 아이디입니다.");
        }

        Member member = new Member();
        member.setLoginId(request.getLoginId());
        member.setPassword(passwordEncoder.encode(request.getPassword()));
        member.setName(request.getName());
        member.setEmail(request.getEmail());

        memberMapper.insert(member);
    }
}

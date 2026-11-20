package com.readingroom.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.readingroom.domain.Member;
import com.readingroom.dto.LoginMember;
import com.readingroom.mapper.MemberMapper;

import lombok.RequiredArgsConstructor;

// 로그인 시 Spring Security가 호출해서 아이디로 회원을 찾는다
@Service
@RequiredArgsConstructor
public class LoginService implements UserDetailsService {

    private final MemberMapper memberMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Member member = memberMapper.findByLoginId(username);
        if (member == null) {
            throw new UsernameNotFoundException("존재하지 않는 아이디입니다.");
        }
        return new LoginMember(member);
    }
}

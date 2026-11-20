package com.readingroom.dto;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.readingroom.domain.Member;

import lombok.Getter;

// 로그인에 성공하면 세션에 저장되는 회원 정보
@Getter
public class LoginMember implements UserDetails {

    private final Long id;
    private final String loginId;
    private final String password;
    private final String name;
    private final String role;

    public LoginMember(Member member) {
        this.id = member.getId();
        this.loginId = member.getLoginId();
        this.password = member.getPassword();
        this.name = member.getName();
        this.role = member.getRole();
    }

    // hasRole("ADMIN")은 "ROLE_ADMIN" 권한을 확인하므로 앞에 ROLE_을 붙인다
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role));
    }

    @Override
    public String getUsername() {
        return loginId;
    }

    @Override
    public String getPassword() {
        return password;
    }
}

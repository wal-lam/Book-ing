package com.readingroom.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.readingroom.domain.Member;

@Mapper
public interface MemberMapper {

    int countByLoginId(String loginId);

    void insert(Member member);
}

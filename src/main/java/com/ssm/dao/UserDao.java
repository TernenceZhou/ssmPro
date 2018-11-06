package com.ssm.dao;

import com.ssm.model.UserInfo;
import org.mybatis.spring.annotation.MapperScan;

//@MapperScan
public interface UserDao {
    UserInfo getUser();
}

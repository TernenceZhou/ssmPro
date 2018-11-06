package com.ssm.service.impl;

import com.ssm.dao.UserDao;
import com.ssm.model.UserInfo;
import com.ssm.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private UserDao userDao;

    public UserInfo getUser() {
        return userDao.getUser();
    }
}

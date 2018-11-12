package com.ssm.service.impl;

import com.ssm.dao.UserDao;
import com.ssm.model.UserInfo;
import com.ssm.qo.UserInfoQO;
import com.ssm.service.UserService;
import com.ssm.vo.UserInfoVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private UserDao userDao;

    public UserInfo getUser() {
        return userDao.getUser();
    }

    @Override
    public List<UserInfoVO> getUserList(UserInfoQO qo) {
        return userDao.getUserList(qo);
    }
}

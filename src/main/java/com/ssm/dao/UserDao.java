package com.ssm.dao;

import java.util.List;

import com.ssm.model.UserInfo;
import com.ssm.qo.UserInfoQO;
import com.ssm.vo.UserInfoVO;

//@MapperScan
public interface UserDao {
    UserInfo getUser();

    List<UserInfoVO> getUserList(UserInfoQO qo);
}

package com.ssm.dao;

import com.ssm.model.UserInfo;
import com.ssm.qo.UserInfoQO;
import com.ssm.vo.UserInfoVO;

import java.util.List;

//@MapperScan
public interface UserDao {
    UserInfo getUser();

    List<UserInfoVO> getUserList(UserInfoQO qo);
}

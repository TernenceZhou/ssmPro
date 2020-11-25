package com.ssm.service;

import java.util.List;

import com.ssm.model.UserInfo;
import com.ssm.qo.UserInfoQO;
import com.ssm.vo.UserInfoVO;

public interface UserService {

    UserInfo getUser();

    List<UserInfoVO> getUserList(UserInfoQO qo);

}

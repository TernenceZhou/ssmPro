package com.ssm.service;

import com.ssm.model.UserInfo;
import com.ssm.qo.UserInfoQO;
import com.ssm.vo.UserInfoVO;

import java.util.List;

public interface UserService {

    UserInfo getUser();

    List<UserInfoVO> getUserList(UserInfoQO qo);

}

package com.ssm.xiangxueClass.spring.lesson14_mvc.service;

import com.ssm.xiangxueClass.spring.lesson14_mvc.annotation.MyService;

/**
 * @author
 * @description
 * @date 2019/12/3
 */
@MyService("/UserServiceImpl")
public class UserServiceImpl implements UserService{

    @Override
    public String getUser(String name,Integer age) {
        return name+ "my name is Hello world age:"+age;
    }
}

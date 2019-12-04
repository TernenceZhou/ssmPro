package com.ssm.xiangxueClass.spring.lesson14_mvc.controller;

import com.ssm.xiangxueClass.spring.lesson14_mvc.annotation.MyAutowired;
import com.ssm.xiangxueClass.spring.lesson14_mvc.annotation.MyController;
import com.ssm.xiangxueClass.spring.lesson14_mvc.annotation.MyRequestMapping;
import com.ssm.xiangxueClass.spring.lesson14_mvc.annotation.MyRequestParam;
import com.ssm.xiangxueClass.spring.lesson14_mvc.service.UserService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * @author
 * @description
 * @date 2019/12/3
 */
@MyController
@MyRequestMapping(value = "/user")
public class UserController {

    @MyAutowired("UserServiceImpl")
    private UserService userService;

    @MyRequestMapping("/get")
    public void user(@MyRequestParam("name") String name, @MyRequestParam("age") Integer age,
                     HttpServletRequest request, HttpServletResponse response) {
        try {
            PrintWriter writer = response.getWriter();
            String result = userService.getUser(name, age);
            writer.write("successful:" + result);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}

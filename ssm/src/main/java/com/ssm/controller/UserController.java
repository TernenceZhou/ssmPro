package com.ssm.controller;

import com.ssm.controller.base.BaseController;
import com.ssm.model.result.ResponseResult;
import com.ssm.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/user")
public class UserController extends BaseController{

   /* private static  final Logger logger = LoggerFactory.getLogger(BaseController.class);

    //http://localhost:8080/user/index
    @Autowired
    private UserService userService;

    @RequestMapping(value = "/index")
    @ResponseBody
    public ResponseResult index(){
        logger.info("comming");
        System.out.println("=========================================");
        ResponseResult result = null;
        result=  getResult(userService.getUser());
        System.out.println(result.getObj()+"   "+result.getResult());
        return result;
    }*/
}

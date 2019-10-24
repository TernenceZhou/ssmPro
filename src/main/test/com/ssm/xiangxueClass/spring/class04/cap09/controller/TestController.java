package com.ssm.xiangxueClass.spring.class04.cap09.controller;

import com.ssm.xiangxueClass.spring.class04.cap09.service.TestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;


@Controller
public class TestController {
	@Autowired
	private TestService testService;
}

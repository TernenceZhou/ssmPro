package com.ssm.xiangxueClass.spring.class04.cap09.service;

import com.ssm.xiangxueClass.spring.class04.cap09.dao.TestDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service
public class TestService {


//    @Qualifier("testDao")//指定名称来加载 配合autowired
	@Autowired(required = false)
	@Resource//(name = "testDao")
	private TestDao testDao;//如果使用Autowired, testDao2, 找到TestDao类型的

	public void println(){
		System.out.println("Service...dao...." + testDao);
	}
}

package com.ssm.xiangxueClass.spring.class08.service;

import com.ssm.xiangxueClass.spring.class08.dao.OrderDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.constraints.AssertTrue;

/**
 * @author
 * @description
 * @date 2019/11/4
 */
@Service
public class OrderService {

    @Autowired
    private OrderDao orderDao;


    @Transactional //开启基于注解的事务 @EnableTransactionManagement
    public  void  insert(){
        orderDao.insert();
//        int i = 10/0;
        System.out.println("OrderService--->insert  操作完成");
    }
}

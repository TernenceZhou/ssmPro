package com.ssm.xiangxueClass.spring.class05.aop;

import org.springframework.stereotype.Component;

/**
 * @author
 * @description
 * @date 2019/10/24
 */
@Component
public class Calculator {

    public int div(int i,int j){
        System.out.println("--------");
        return  i/j;
    }
}

package com.ssm.xiangxueClass.spring.class05.config;

import com.ssm.xiangxueClass.spring.class05.aop.Calculator;
import com.ssm.xiangxueClass.spring.class05.aop.LogAspect;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

/**
 * @author
 * @description
 * 面向切面编程就是指
 * 程序在运行过程中将某段代码切入到指定的方法位置 运行 的编程方式
 * @date 2019/10/24
 */
@Configuration
@EnableAspectJAutoProxy
//@ComponentScan(value = {"com.ssm.xiangxueClass.spring.class05.aop"})
public class Cap10MainAopConfig {

    @Bean
    public Calculator calculator(){
        return new Calculator();
    }

    @Bean
    public LogAspect logAspect(){
        return new LogAspect();
    }

}

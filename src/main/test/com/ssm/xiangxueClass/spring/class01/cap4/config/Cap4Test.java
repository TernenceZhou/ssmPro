package com.ssm.xiangxueClass.spring.class01.cap4.config;

import org.junit.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

/**
 * @author
 * @description
 * @Lazy 测试
 * @date 2019/10/23
 */
public class Cap4Test {
    @Test
    public void test01(){
        AnnotationConfigApplicationContext app = new AnnotationConfigApplicationContext(Cap4MainConfig.class);

        System.out.println("IOC容器创建完成........");
        app.getBean("person");//执行获取的时候才创建并初始化bean

    }
}

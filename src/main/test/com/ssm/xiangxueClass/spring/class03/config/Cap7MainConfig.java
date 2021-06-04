package com.ssm.xiangxueClass.spring.class03.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

/**
 * @author
 * @description
 * @date 2019/10/23
 */
@ComponentScan(value = "com.ssm.xiangxueClass.spring.class03.bean")
@Configuration
public class Cap7MainConfig {

    //默认单实例情况下调用init和构造方法
    //多实例是在使用的时候才会调用方法创建对象
    //多实例只负责初始化 不会管理bean ，容器关闭不会销毁方法
    //    @Scope("prototype")
    //    @Bean(initMethod = "init",destroyMethod = "destory")
    //    public Bike bike(){
    //        return new Bike();
    //    }

    //    @Bean
    //    public Train train(){
    //        return new Train();
    //    }
}

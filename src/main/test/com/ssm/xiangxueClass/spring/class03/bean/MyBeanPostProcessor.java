package com.ssm.xiangxueClass.spring.class03.bean;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.stereotype.Component;

/**
 * @author
 * @description
 * 后置处理器
 * @date 2019/10/23
 */
@Component //如果在Config中声明了@Bean 就不需要用@Component注解
public class MyBeanPostProcessor implements BeanPostProcessor {

    @Autowired
    //在初始化之前进行后置处理
    //什么时候调用 在init-method=init之前调用
    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("后置处理器的前置");
        System.out.println("postProcessBeforeInitialization------->beanName："+beanName+"------->bean："+bean);
        return beanName;
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("postProcessAfterInitialization------->beanName："+beanName+"------->bean："+bean);
        return beanName;
    }
}

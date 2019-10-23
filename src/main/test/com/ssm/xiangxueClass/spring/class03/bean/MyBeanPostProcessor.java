package com.ssm.xiangxueClass.spring.class03.bean;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.stereotype.Component;

/**
 * @author
 * @description
 * 后置处理器
 * @date 2019/10/23
 */
@Component
public class MyBeanPostProcessor implements BeanPostProcessor {

    //在初始化之前进行后置处理
    //什么时候调用 在init-method=init之前调用
    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("postProcessBeforeInitialization...."+beanName+"..."+bean);
        return beanName;
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("postProcessAfterInitialization...."+beanName+"..."+bean);
        return beanName;
    }
}

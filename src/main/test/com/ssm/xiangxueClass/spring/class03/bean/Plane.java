package com.ssm.xiangxueClass.spring.class03.bean;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

/**
 * @author
 * @description
 * 测试plane
 * @date 2019/10/23
 */
@Component
public class Plane implements ApplicationContextAware {

    private ApplicationContext  applicationContext;
    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }
    //类似初始化
    //对象创建赋值之后调用
    @PostConstruct
    public void init() {
        System.out.println("Plane.......PostConstruct...");

    }

    //销毁
    //当我们bean销毁时,调用此方法
    @PreDestroy
    public void destroy() throws Exception {
        System.out.println("Plane......PreDestroy......");

    }
}

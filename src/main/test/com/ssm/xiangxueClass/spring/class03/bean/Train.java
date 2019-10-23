package com.ssm.xiangxueClass.spring.class03.bean;

import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Component;

/**
 * @author
 * @description
 * @date 2019/10/23
 */
@Component
public class Train implements InitializingBean , DisposableBean {

    public Train(){
        System.out.println("Train......constructor............");
    }


    //类似初始化
    //当bean属性赋值和初始化完成时候调用此方法
    @Override
    public void afterPropertiesSet() throws Exception {
        System.out.println("Train.......afterPropertiesSet()...");

    }

    //销毁
    //当我们bean销毁时,调用此方法

    @Override
    public void destroy() throws Exception {
        System.out.println("Train......destory......");

    }
}

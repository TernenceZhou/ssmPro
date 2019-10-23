package com.ssm.xiangxueClass.spring.class03.bean;

import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

/**
 * @author
 * @description
 * @date 2019/10/23
 */
@Component
public class Jeep {
    public Jeep(){
        System.out.println("Jeep......constructor............");
    }


    //类似初始化
    //对象创建赋值之后调用
    @PostConstruct
    public void init() {
        System.out.println("Jeep.......PostConstruct...");

    }

    //销毁
    //当我们bean销毁时,调用此方法

    @PreDestroy
    public void destroy() throws Exception {
        System.out.println("Jeep......PreDestroy......");

    }
}

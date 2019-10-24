package com.ssm.xiangxueClass.spring.cap09;

import com.ssm.xiangxueClass.spring.cap09.config.Cap9MainConfig;
import com.ssm.xiangxueClass.spring.class03.config.Cap7MainConfig;
import org.junit.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

/**
 * @author
 * @description
 * @date 2019/10/22
 */
public class Cap9MainConfigTest {
    @Test
    public void test(){
        AnnotationConfigApplicationContext anno = new AnnotationConfigApplicationContext(Cap9MainConfig.class);
        System.out.println("IOC容器创建完成........");

    }


}

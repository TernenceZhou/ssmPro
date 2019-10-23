package com.ssm.xiangxueClass.spring.class01.cap2;

import com.ssm.xiangxueClass.spring.class01.cap2.config.Cap2MainConfig;
import org.junit.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

/**
 * @author
 * @description
 * 通过ComponentScan 自定义扫描注册进IOC容器的类
 * @date 2019/10/23
 */
public class Cap2Test {
    @Test
    public void test01(){
        AnnotationConfigApplicationContext app = new AnnotationConfigApplicationContext(Cap2MainConfig.class);


        String[] names = app.getBeanDefinitionNames();

        for(String name:names){
            System.out.println(name);
        }
    }
}

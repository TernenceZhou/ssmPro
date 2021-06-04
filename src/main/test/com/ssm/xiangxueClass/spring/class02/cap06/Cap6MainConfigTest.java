package com.ssm.xiangxueClass.spring.class02.cap06;

import org.junit.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import com.ssm.xiangxueClass.spring.class02.cap06.bean.Tiger;
import com.ssm.xiangxueClass.spring.class02.cap06.config.Cap6MainConfig;

/**
 * @author
 * @description
 * @date 2019/10/22
 */
public class Cap6MainConfigTest {
    @Test
    public void test() {
        AnnotationConfigApplicationContext anno = new AnnotationConfigApplicationContext(Cap6MainConfig.class);
        System.out.println("IOC容器创建完成........");

        Tiger tiger = (Tiger) anno.getBean("tiger");
        Tiger tiger2 = (Tiger) anno.getBean("tiger");

        System.out.println(tiger == tiger2);

        String[] names = anno.getBeanDefinitionNames();
        for (String name : names) {
            System.out.println(name);
        }
    }

}

package com.ssm.xiangxueClass.spring.class04.cap08;

import com.ssm.xiangxueClass.spring.class04.cap08.bean.Bird;
import com.ssm.xiangxueClass.spring.class04.cap08.config.Cap8MainConfig;
import org.junit.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;

/**
 * @author
 * @description
 * @date 2019/10/22
 */
public class Cap8MainConfigTest {
    @Test
    public void test() {
        AnnotationConfigApplicationContext anno = new AnnotationConfigApplicationContext(Cap8MainConfig.class);
        System.out.println("IOC容器创建完成........");
        Bird bird = (Bird) anno.getBean("bird");
        System.out.println(bird.getColor());
        System.out.println("IOC容器创建完成");

        ConfigurableEnvironment environment = anno.getEnvironment();
        String property = environment.getProperty("bird.color");
        System.out.println(property);

    }


}

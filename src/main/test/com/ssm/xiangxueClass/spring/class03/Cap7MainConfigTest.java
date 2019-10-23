package com.ssm.xiangxueClass.spring.class03;

import com.ssm.xiangxueClass.spring.class03.bean.Bike;
import com.ssm.xiangxueClass.spring.class03.config.Cap7MainConfig;
import org.junit.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

/**
 * @author
 * @description
 * @date 2019/10/22
 */
public class Cap7MainConfigTest {
    @Test
    public void test(){
        AnnotationConfigApplicationContext anno = new AnnotationConfigApplicationContext(Cap7MainConfig.class);
        System.out.println("IOC容器创建完成........");

//        Bike bike = (Bike) anno.getBean("bike");
//        Bike bike2 = (Bike) anno.getBean("bike");
//        System.out.println(bike == bike2);
//
//        String[] names = anno.getBeanDefinitionNames();
//        for (String name:names){
//            System.out.println(name);
//        }
        anno.close();//容器关闭
    }


}

package com.ssm.xiangxueClass.spring.class04.cap09;

import com.ssm.xiangxueClass.spring.class04.cap09.bean.Light;
import com.ssm.xiangxueClass.spring.class04.cap09.bean.Moon;
import com.ssm.xiangxueClass.spring.class04.cap09.bean.Sun;
import com.ssm.xiangxueClass.spring.class04.cap09.config.Cap9MainConfig;
import com.ssm.xiangxueClass.spring.class04.cap09.dao.TestDao;
import com.ssm.xiangxueClass.spring.class04.cap09.service.TestService;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
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
        TestService testService = (TestService) anno.getBean("testService");
        testService.println();

        TestDao dao = (TestDao) anno.getBean("testDao");
        System.out.println("unit test.testDao :" + dao);

        //@Autowired 和在IOC容器中的实例是一样的 默认单例
        //autowired是按照类型去IOC容器中获取找到对应的对象 相当于anno.getBean(TestDao.class);去容器获取id=testDao的bean
        //然后注入到Service中
        System.out.println("IOC容器创建完成........");


        Sun bean = anno.getBean(Sun.class);
        System.out.println(bean);
        Moon moon = anno.getBean(Moon.class);
        System.out.println(moon);
    }
    //自动装配:Aware注入spring底层组件原理
    @Test
    public void test02(){
        AnnotationConfigApplicationContext anno = new AnnotationConfigApplicationContext(Cap9MainConfig.class);
        System.out.println(anno);
        String[] names = anno.getBeanDefinitionNames();
        for (String name : names) {

            System.out.println(name);
        }
    }

}

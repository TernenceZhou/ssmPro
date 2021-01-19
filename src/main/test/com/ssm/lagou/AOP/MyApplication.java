package com.ssm.lagou.AOP;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * @author
 * @description
 * @date 2020/12/17
 */
public class MyApplication {

    public static void main(String[] args) {

        ApplicationContext context =
            new ClassPathXmlApplicationContext("classpath*:application.xml");
        Person person = context.getBean("person", Person.class);
        person.findPerson();
    }
}

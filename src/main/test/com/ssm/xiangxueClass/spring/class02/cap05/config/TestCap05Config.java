package com.ssm.xiangxueClass.spring.class02.cap05.config;

import com.ssm.xiangxueClass.spring.class01.cap1.Person;
import org.junit.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;

import java.util.Map;

/**
 * @author
 * @description
 * @date 2019/10/22
 */
public class TestCap05Config {

    @Test
    public void  test01(){
        //加上conditional之后类是直接通过单例加载到IOC容器中了 如果是linux环境就不会被加载
        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(Cap5MainConfig.class);
//        Person person = (Person) context.getBean("lison");
//        System.out.println(person.getAge()+" ---   "+person.getName());

        String[] namesForType = context.getBeanNamesForType(Person.class);
        for (String name : namesForType) {
            System.out.println(name);
        }
        //把所有的bean打印出来放到Map的key和val中去
        Map<String, Person> type = context.getBeansOfType(Person.class);
        for (Map.Entry<String, Person> entry : type.entrySet()) {
            System.out.println(
                    entry.getKey()+"--->"+entry.getValue()
            );
            /**
             * person--->Person [name=person, age=20]
             * lison--->Person [name=Lison, age=58]
             * james--->Person [name=james, age=20]
             */
        }

    }
    @Test
    public void  test02(){
        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(Cap5MainConfig.class);
        ConfigurableEnvironment environment = context.getEnvironment();
        String environmentProperty = environment.getProperty("os.name");
        System.out.println("当前的操作系统为："+environmentProperty);
        String[] namesForType = context.getBeanNamesForType(Person.class);
        for (String name : namesForType) {
            System.out.println(name);
        }
    }
}

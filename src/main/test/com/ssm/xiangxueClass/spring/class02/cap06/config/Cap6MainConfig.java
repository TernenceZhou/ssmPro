package com.ssm.xiangxueClass.spring.class02.cap06.config;

import com.ssm.xiangxueClass.spring.class01.cap1.Person;
import com.ssm.xiangxueClass.spring.class02.cap06.bean.Cat;
import com.ssm.xiangxueClass.spring.class02.cap06.bean.Dog;
import com.ssm.xiangxueClass.spring.class02.cap06.bean.Tiger;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * @author
 * @description
 * @date 2019/10/22
 */
@Configuration
@Import(value = { Dog.class, Cat.class,MyImportSelector.class,MyImportBeanDefinitionRegistrar.class
    //,MyBeanFactory.class
})
public class Cap6MainConfig {

   //容器启动时初始化person的bean实例
    @Bean("person")
    public Person person(){
        return new Person("james",20);
    }

    @Bean("tiger")
    public MyBeanFactory tiger(){
        return new MyBeanFactory();
    }
}

package com.ssm.xiangxueClass.spring.class02.cap06;

import com.ssm.xiangxueClass.spring.class01.cap1.Person;
import com.ssm.xiangxueClass.spring.class02.cap06.bean.Cat;
import com.ssm.xiangxueClass.spring.class02.cap06.bean.Dog;
import com.ssm.xiangxueClass.spring.class02.cap06.config.Cap6MainConfig;
import org.junit.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * @author
 * @description
 * @date 2019/10/22
 */
public class Cap6MainConfigTest {
    @Test
    public void test(){
        AnnotationConfigApplicationContext anno = new AnnotationConfigApplicationContext(Cap6MainConfig.class);
        String[] names = anno.getBeanDefinitionNames();
        for (String name:names){
            System.out.println(name);
        }
    }


}

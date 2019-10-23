package com.ssm.xiangxueClass.spring.class04.config;

import com.ssm.xiangxueClass.spring.class04.bean.Bird;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.test.context.ContextConfiguration;


/**
 * @author
 * @description
 * @date 2019/10/23
 */
//@PropertySource(value = {"classpath*:/test.properties"})
//@PropertySource(value = {"test.properties"})
//@ContextConfiguration({"classpath:/test.properties"})
@Configuration
public class Cap8MainConfig {

    @Bean
    public Bird bird(){
        return new Bird();
    }
}

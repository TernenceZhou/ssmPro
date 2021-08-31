package com.ssm.xiangxueClass.spring.class04.cap08.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.ssm.xiangxueClass.spring.class04.cap08.bean.Bird;

/**
 * @PropertySource 可以直接导入资源文件
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
    public Bird bird() {
        return new Bird();
    }
}

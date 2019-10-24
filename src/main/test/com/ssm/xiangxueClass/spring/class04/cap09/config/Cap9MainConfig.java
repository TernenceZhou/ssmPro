package com.ssm.xiangxueClass.spring.class04.cap09.config;

import com.ssm.xiangxueClass.spring.class04.cap09.dao.TestDao;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

/**
 * @author
 * @description
 * @date 2019/10/23
 */
@Configuration
@ComponentScan(value = {"com.ssm.xiangxueClass.spring.class04.cap09.dao",
        "com.ssm.xiangxueClass.spring.class04.cap09.service",
        "com.ssm.xiangxueClass.spring.class04.cap09.controller",
        "com.ssm.xiangxueClass.spring.class04.cap09.bean"})
public class Cap9MainConfig {

    @Primary
    @Bean("testDao")
    public TestDao testDao(){
        TestDao testDao = new TestDao();
        testDao.setFlag("2");
        return testDao;
    }
}

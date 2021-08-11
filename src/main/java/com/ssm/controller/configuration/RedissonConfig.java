package com.ssm.controller.configuration;

import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author
 * @description
 * @date 2021/6/17
 */
@Configuration
public class RedissonConfig {


    @Bean("myRedisson")
    public RedissonClient redissonClient() {
        Config config = new Config();
        config.useSingleServer().setAddress("redis://10.42.0.23:6379");
        //看门狗机制 默认30s
        config.setLockWatchdogTimeout(1000);
        return Redisson.create(config);
    }

}

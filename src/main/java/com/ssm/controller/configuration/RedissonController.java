package com.ssm.controller.configuration;/**
 * @author
 */

import java.util.concurrent.TimeUnit;

import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author
 * @description
 * @date 2021/6/17
 */

public class RedissonController {

    @Autowired
    private RedissonClient redissonClient;

    @RequestMapping("indexRedission")
    public void index() {
        RLock lock = redissonClient.getLock("");

        lock.lock(100L, TimeUnit.SECONDS);
        lock.tryLock();



        lock.unlock();
    }
}

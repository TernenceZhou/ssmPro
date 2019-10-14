package com.ssm.jikeLive.即可时间并发编程.lesson16;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Semaphore;

/**
 * @author
 * @description
 * @date 2019/10/12
 */
public class SemaphoreExample1 {

    private static int count = 20;

    public static void main(String[] args) {
        Semaphore semaphore = new Semaphore(3);//允许同时三个线程执行
        ExecutorService pool = Executors.newCachedThreadPool();
        for (int i = 0; i < count; i++) {
            pool.execute(()->{
                try {
                    semaphore.acquire();
                    test(12);
                    semaphore.release();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });
        }
    }
    private static void test(int threadNum) throws Exception {
    }
}

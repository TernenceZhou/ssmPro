package com.ssm.jikeLive.即可时间并发编程.lesson16;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * @author
 * @description
 * @date 2019/10/11
 */
public class CountDownLatchExample1 {
    private static Logger log = LoggerFactory.getLogger(CountDownLatchExample1.class);

    private final static int threadCount = 200;

    public static void main(String[] args) throws Exception {

        ExecutorService exec = Executors.newCachedThreadPool();

        final CountDownLatch countDownLatch = new CountDownLatch(threadCount);

        for (int i = 0; i < threadCount; i++) {
            final int threadNum = i;
            exec.execute(() -> {
                try {

                    test(threadNum);

                } catch (Exception e) {
                    System.out.println("exception"+ e);
                } finally {
                    countDownLatch.countDown();
                }
            });
        }
        countDownLatch.await();
        System.out.println("finish");
        exec.shutdown();
    }

    private static void test(int threadNum) throws Exception {
        Thread.sleep(100);
        //log.info("{}", threadNum);
        System.out.println(threadNum);
        Thread.sleep(100);
    }
}

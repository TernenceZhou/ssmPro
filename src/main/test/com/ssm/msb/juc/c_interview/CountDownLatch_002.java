package com.ssm.msb.juc.c_interview;/**
 * @author
 */

import java.io.IOException;
import java.util.concurrent.CountDownLatch;

/**
 * @author
 * @description
 * @date 2021/7/5
 */
public class CountDownLatch_002 {

    static CountDownLatch latch = new CountDownLatch(10);

    public static void main(String[] args) throws IOException, InterruptedException {

        Thread thread = new Thread(() -> {
            for (int i = 1; i <= 10; i++) {
                System.out.println("员工： " + i  + "在工作！");
                latch.countDown();
            }
        });
        thread.start();
        latch.await();
        System.out.println("所有员工工作完成");

    }
}

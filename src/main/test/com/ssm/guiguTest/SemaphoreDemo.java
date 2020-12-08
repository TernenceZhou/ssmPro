package com.ssm.guiguTest;

import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;

/**
 * 信号量 模拟车位
 * 六个车 抢三个车位
 * 六个线程 抢三个
 */
public class SemaphoreDemo {

    public static void main(String[] args) {
        Semaphore semaphore = new Semaphore(3);
        for (int i = 1; i <= 6; i++) {
            new Thread(() -> {
                try {
                    //加锁
                    System.out.println("抢占停车位~~~");
                    semaphore.acquire();
                    //semaphore.acquire(3);
                    TimeUnit.SECONDS.sleep(1);
                    System.out.println("抢占成功：我是" + Thread.currentThread().getName() + "号车主");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } finally {
                    semaphore.release();
                }
            }, String.valueOf(i)).start();
        }

    }

}

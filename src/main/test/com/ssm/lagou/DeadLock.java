package com.ssm.lagou;

import java.util.concurrent.TimeUnit;

/**
 * 死锁.
 */
public class DeadLock {

    public static void main(String[] args) {
        deadLock();
    }

    public static void deadLock() {
         final Object lock1 = new Object();
         final Object lock2 = new Object();
        new Thread( ()-> {
            synchronized (lock1) {
                System.out.println("获取 lock1 成功------------");
                try {
                    TimeUnit.SECONDS.sleep(3);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                synchronized (lock2) {
                    System.out.println(Thread.currentThread().getName());
                }
            }
        },"线程1").start();


        new Thread( ()-> {
            synchronized (lock2) {
                System.out.println("获取 lock2 成功");
                try {
                    TimeUnit.SECONDS.sleep(3);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                synchronized (lock1) {
                    System.out.println(Thread.currentThread().getName());
                }
            }
        },"线程2").start();

    }
}

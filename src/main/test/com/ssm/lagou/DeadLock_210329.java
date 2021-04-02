package com.ssm.lagou;

/**
 * 死锁demo.
 * 查看死锁 需要先 jps -l 查看进程id
 * 然后就          jstack pid
 */
public class DeadLock_210329 {
    final Object lock1 = new Object();
    final Object lock2 = new Object();
    public static void main(String[] args) {
//        deadLock();
        DeadLock_210329 d = new DeadLock_210329();
        d.deadLock();
    }

    public void deadLock() {
//        final Object lock1 = new Object();
//        final Object lock2 = new Object();
        new Thread(() -> {
            synchronized (lock1) {
                System.out.println("获取了lock1 锁" + Thread.currentThread().getName());
                synchronized (lock2) {
                    try {
                        Thread.sleep(1000);
                        System.out.println("获取了lock2 锁" + Thread.currentThread().getName());
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
        }, "threadA").start();
        new Thread(() -> {
            synchronized (lock2) {
                System.out.println("获取了lock2 锁" + Thread.currentThread().getName());
                synchronized (lock1) {
                    try {
                        Thread.sleep(1000);
                        System.out.println("获取了lock1 锁" + Thread.currentThread().getName());
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
        }, "threadB").start();
    }
}

package com.ssm.lagou;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import org.junit.Test;

/**
 * 可重入锁
 */
public class ReentrantLockTest {

    public static void main(String[] args) {

        //可重入锁
        final Lock lock = new ReentrantLock();
        try {
            lock.lock();
            boolean b = lock.tryLock();
            if (b) {

            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }

        //可重入锁 demo
        reentrantA();
    }

    /**
     * 可重入锁：也叫作递归锁 。
     * 表示外层的函数获取锁之后 内层的函数也能获取到该锁
     * synchronized 和ReentrantLock都是可重入锁
     * <p>
     * 可重入锁 A 方法
     */
    private synchronized static void reentrantA() {
        System.out.println(Thread.currentThread().getName() + "：执行 reentrantA");
        reentrantB();
    }

    /**
     * 可重入锁 B 方法
     */
    private synchronized static void reentrantB() {
        System.out.println(Thread.currentThread().getName() + "：执行 reentrantB");

    }

    @Test
    public void 创建线程() {
        for (int i = 1; i <= 20; i++) {
            new Thread(() -> {
                for (int j = 1; j <= 1000; j++) {
                    System.out.println(Thread.currentThread().getName() + " --------------" + j);
                }
            }, "线程：" + i).start();

        }
        while (Thread.activeCount() > 2) {
            //Thread.yield();
            //
            try {
                TimeUnit.SECONDS.sleep(3);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        System.out.println(Thread.currentThread().getName() + " --------------");

    }
}

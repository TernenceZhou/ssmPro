package com.ssm.guiguTest;

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * 锁----->
 * <p>
 * 可重入锁（递归锁）
 * 公平锁、非公平锁
 * 自旋锁
 * 偏向锁
 * ReentrantLock 和 Synchronized 都是 非公平的 的可重入锁
 */
public class LockDemo {

    public static void main(String[] args) {
        //用ReentrantLock实现可重入锁();

        用Synchronize实现可重入锁();


    }

    private static void 用Synchronize实现可重入锁() {
        MyLock myLock = new MyLock();
        Thread t1 = new Thread(myLock, "t1");
        Thread t2 = new Thread(myLock, "t2");

        t1.start();
        t2.start();
    }

    private static void 用ReentrantLock实现可重入锁() {
        /**
         * 可重入锁：外层函数获得锁之后，内层函数也可以获得锁
         * 比如：自己家里 打开外层锁后 进入厕所 厨房不用再要求其他条件（锁），所以他们拥有的是同一把锁
         *  看源码发现 默认ReentrantLock() false 非公平锁
         *
         */

        Lock lock = new ReentrantLock();
        new Thread(() -> {
            try {
                lock.lock();
                lock.lock();
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                lock.unlock();
                lock.unlock();
            }
        }, "线程：a").start();

        System.out.println(Thread.currentThread().getName() + " --------------");
    }

}

class MyLock implements Runnable {
    @Override
    public void run() {
        set();
    }

    public synchronized void set() {
        System.out.println("invoke set() ----------" + "线程名称：" + Thread.currentThread().getName());
        get();
    }

    public synchronized void get() {
        System.out.println("invoke get() ----------" + "线程名称：" + Thread.currentThread().getName());
    }
}

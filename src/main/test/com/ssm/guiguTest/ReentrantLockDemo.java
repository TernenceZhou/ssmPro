package com.ssm.guiguTest;

import com.ssm.xiangxueClass.spring.class01.cap1.Person;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * 可重入的读写锁.
 */


class Phone implements Runnable{

    public synchronized  void sendSms() {
        System.out.println(Thread.currentThread().getName() + " invoke : sendSms()");
        sendEmail();
    }

    public synchronized  void sendEmail() {
        System.out.println(Thread.currentThread().getName() + "  ####### invoke : sendEmail()");
    }

    public void set() {
        Lock lock = new ReentrantLock();
        lock.lock();
        try {
            System.out.println(Thread.currentThread().getName() + "###### invoke : set()");
        } finally {
            lock.unlock();
        }

    }

    public void get() {
        Lock lock = new ReentrantLock();
        lock.lock();
        try {
            System.out.println(Thread.currentThread().getName() + " invoke : get()");
            set();
        } finally {
            lock.unlock();
        }
    }

    @Override
    public void run() {
        get();
    }
}

public class ReentrantLockDemo {

    public static void main(String[] args) {

        Phone p1 = new Phone();

        new Thread(() -> {
            p1.sendSms();
        },"t1").start();

        new Thread(() -> {
            p1.sendSms();
        },"t2").start();



        try {
            TimeUnit.SECONDS.sleep(2);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println();
        System.out.println();
        System.out.println();
        System.out.println();


        Thread t1 = new Thread(p1, "pp1");
        Thread t2 = new Thread(p1, "pp2");

        t1.start();
        t2.start();
    }

    /**
     * t1 invoke : sendSms()
     * t1 invoke : sendEmail()
     * t2 invoke : sendSms()
     * t2 invoke : sendEmail()
     * 表示 每个线程获取到外层函数之后 同时可以获取到内存函数的锁
     *
     * 就像 自己家里 进入大门之后 进入卫生间 厨房等地方 不用获取锁就可以进入
     */


}

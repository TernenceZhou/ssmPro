package com.ssm.guiguTest;

import java.util.concurrent.atomic.AtomicReference;

/**
 * 手写实现自旋锁.// TODO: 2020/12/8
 */
public class ImplSpinLock {

    static AtomicReference<Thread> atomicReference = new AtomicReference<>();

    public static void main(String[] args) {

        atomicReference.set(new Thread());
        new Thread(()->{

        },"t1").start();

    }

}

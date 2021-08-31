package com.ssm.test.thread.ThreadA_B_Exchange;

import java.util.concurrent.locks.LockSupport;

/**
 * @author
 * @description
 * @date 2021/8/19
 */
public class A_B_LockSupport {

    static Thread t1;
    static Thread t2;

    public static void main(String[] args) {

        t1 = new Thread(() -> {
            for (int i = 0; i < 10; i++) {
                System.out.println("A");
                LockSupport.unpark(t2);
                LockSupport.park();
            }
        });

        t2 = new Thread(() -> {
            for (int i = 0; i < 10; i++) {
                LockSupport.park();
                System.out.println("B");
                LockSupport.unpark(t1);
            }
        });
        t1.start();
        t2.start();
    }
}

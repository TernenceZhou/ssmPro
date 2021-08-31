package com.ssm.test.thread.ThreadA_B_Exchange;

import java.util.concurrent.locks.ReentrantLock;

/**
 * A  B 线程交换打印
 *
 * @author
 * @description
 * @date 2021/8/19
 */
public class A_B_Exchange {

    static ReentrantLock lock = new ReentrantLock();
    static int state = 1; // 0 1 2

    public static void main(String[] args) {
        Thread t1 = new Thread(() -> {
            for (int i = 0; i < 10;) {
                lock.lock();
                try {
                    while (state % 3 == 1) {
                        System.out.println("A");
                        state ++;
                        i++;
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    lock.unlock();
                }
            }
        });

        Thread t2 = new Thread(() -> {
            for (int i = 0; i < 10;) {
                lock.lock();
                try {
                    while (state % 3 == 2) {
                        System.out.println("B");
                        state ++;
                        i++;
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    lock.unlock();
                }
            }
        });

        Thread t3 = new Thread(() -> {
            for (int i = 0; i < 10; ) {
                lock.lock();
                try {
                    while (state % 3 == 0) {
                        System.out.println("C");
                        state ++;
                        i++;
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    lock.unlock();
                }
            }
        });

        t1.start();
        t2.start();
        t3.start();
    }
}

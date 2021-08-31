package com.ssm.test.thread.ThreadA_B_Exchange;

import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

/**
 * A  B 线程交换打印
 *
 * @author
 * @description
 * @date 2021/8/19
 */
public class A_B_Exchange2 {

    static ReentrantLock lock = new ReentrantLock();
    static Condition c1 = lock.newCondition();
    static Condition c2 = lock.newCondition();

    public static void main(String[] args) {

        Thread t1 = new Thread(() -> {
            lock.lock();
            try {
                for (int i=0;i<10;i++) {
                    System.out.println("A");
                    c2.signal();
                    c1.await();
                }
                c2.signal();
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                lock.unlock();
            }
        });

        Thread t2 = new Thread(() -> {
            lock.lock();
            try {
                for (int i=0;i<10;i++) {
                    System.out.println("B");
                    c1.signal();
                    c2.await();
                }
                //c1.signal();
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                lock.unlock();
            }
        });
        t1.start();
        t2.start();
    }
}

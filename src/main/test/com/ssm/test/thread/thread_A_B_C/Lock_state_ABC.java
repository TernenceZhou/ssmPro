package com.ssm.test.thread.thread_A_B_C;

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * @author
 * @description
 * @date 2021/7/20
 */
public class Lock_state_ABC {

    static Lock lock = new ReentrantLock();
    static int state = 0;

    public static void main(String[] args) throws InterruptedException {

        Thread t1 = new Thread(() -> {
            for (int i = 1; i <= 10; ) {

                lock.lock();
                try {
                    while (state % 3 == 0) {  //1/4/7/10
                        System.out.println("A");
                        state++;
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
            for (int i = 1; i <= 10; ) {

                lock.lock();
                try {
                    while (state % 3 == 1) {  //1/4/7/10
                        System.out.println("B");
                        state++;
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
            for (int i = 1; i <= 10;) {
                lock.lock();
                try {
                    while (state % 3 == 2) {  //1/4/7/10
                        System.out.println("C");
                        state++;
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

//        t1.join();
//        t2.join();
//        t3.join();
    }
}

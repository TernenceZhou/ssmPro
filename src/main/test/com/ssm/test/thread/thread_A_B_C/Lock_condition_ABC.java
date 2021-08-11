package com.ssm.test.thread.thread_A_B_C;

import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * @author
 * @description
 * @date 2021/7/20
 */
public class Lock_condition_ABC {

    static Lock lock = new ReentrantLock();
    static Condition a = lock.newCondition();
    static Condition b = lock.newCondition();
    static Condition c = lock.newCondition();
    static int count = 0;



    public static void main(String[] args) {
       Thread t1 = new Thread(()->{
            for (int i = 0;i<10;i++) {
                lock.lock();
                try {
                    while (count % 3 != 0) {
                        a.await();
                    }
                    System.out.println("A");
                    count++;
                    b.signal();
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    lock.unlock();
                }
            }

        });
        Thread t2 = new Thread(()->{
            for (int i = 0;i<10;i++) {
                lock.lock();
                try {
                    while (count % 3 != 1) {
                        b.await();
                    }
                    System.out.println("B");
                    count++;
                    c.signal();
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    lock.unlock();
                }
            }

        });

        Thread t3 = new Thread(()->{
            for (int i = 0;i<10;i++) {
                lock.lock();
                try {
                    while (count % 3 != 2) {
                        c.await();
                    }
                    System.out.println("C");
                    count++;
                    a.signal();
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

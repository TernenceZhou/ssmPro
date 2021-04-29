package com.ssm.test.thread;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * 三个线程按照顺序打印
 * 把线程按照ABC
 * 注意使用等待通知机制
 * <p>
 * 可以使用CompletableFuture调用式链
 * <p>
 * 三线程按顺序交替打印ABC的四种方法
 * https://www.jianshu.com/p/f79fa5aafb44
 *
 * @author
 * @description
 */
public class ThreadOrder2 {
    private static Lock lock = new ReentrantLock();
    private static Condition A = lock.newCondition();
    private static Condition B = lock.newCondition();
    private static Condition C = lock.newCondition();
    private static CountDownLatch latch = new CountDownLatch(1);
    private static CountDownLatch latch2 = new CountDownLatch(1);

    public static void main(String[] args) {

        Thread t1 = new Thread(() -> {
            lock.lock();
            try {
                for (int i = 1; i <= 10; i++) {
                    System.out.print("A");
                    B.signal();
//                    if (i == 1) {
//                        latch.countDown();
//                    }
                    A.await();
                }
                B.signal();
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                lock.unlock();
            }

        }, "线程：A");

        Thread t2 = new Thread(() -> {
//            try {
//                latch.await();
//            } catch (InterruptedException e) {
//                e.printStackTrace();
//            }
            lock.lock();
            try {
                for (int i = 1; i <= 10; i++) {
                    System.out.print("B");
                    C.signal();
//                    if (i == 1) {
//                        latch2.countDown();
//                    }
                    B.await();
                }
                C.signal();
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                lock.unlock();
            }

        }, "线程：B");

        Thread t3 = new Thread(() -> {
//            try {
//                latch2.await();
//            } catch (InterruptedException e) {
//                e.printStackTrace();
//            }
            lock.lock();
            try {
                for (int i = 1; i <= 10; i++) {
                    System.out.print("C");
                    A.signal();
                    C.await();
                }
                A.signal();
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                lock.unlock();
            }

        }, "线程：C");

        t1.start();
        t2.start();
        t3.start();

    }
}

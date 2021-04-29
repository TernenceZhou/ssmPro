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
public class ThreadOrder {
    private static Lock lock = new ReentrantLock();
    private static Condition A = lock.newCondition();
    private static Condition B = lock.newCondition();
    private static Condition C = lock.newCondition();
    private static CountDownLatch latch = new CountDownLatch(1);
    private static CountDownLatch latch2 = new CountDownLatch(1);

    public static void main(String[] args) {

        for (int i = 1; i <= 10; i++) {
            Thread t1 = new Thread(() -> {

                lock.lock();
                try {
                    System.out.print("A");
                    latch.countDown();
                    if (latch.getCount() == 0) {
                        A.await();
                    }
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } finally {
                    lock.unlock();
                }
                B.signal();

            }, "线程：" + i);

            Thread t2 = new Thread(() -> {
                lock.lock();
                try {
                    System.out.print("B");
                    latch2.countDown();
                    if (latch2.getCount() == 0) {
                        B.await();
                    }

                } catch (InterruptedException e) {
                    e.printStackTrace();
                } finally {
                    lock.unlock();
                }

                C.signal();

            }, "线程：" + i);

            Thread t3 = new Thread(() -> {
                lock.lock();
                try {
                    System.out.print("C");
                    A.signal();
                    C.await();

                } catch (InterruptedException e) {
                    e.printStackTrace();
                } finally {
                    lock.unlock();
                }
                A.signal();

            }, "线程：" + i);

            t1.start();
            t2.start();
            t3.start();

        }
        //System.out.println(Thread.currentThread().getName() + " --------------");
    }
}

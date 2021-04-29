package com.ssm.test.thread;

import java.util.concurrent.Semaphore;

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
public class ThreadOrder3 {
    private static Semaphore A = new Semaphore(1);
    private static Semaphore B = new Semaphore(0);
    private static Semaphore C = new Semaphore(0);

    public static void main(String[] args) {

        Thread t1 = new Thread(() -> {
            try {
                for (int i = 1; i <= 10; i++) {
                    A.acquire();
                    System.out.print("A");
                    B.release();
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {

            }

        }, "线程：A");

        Thread t2 = new Thread(() -> {
            try {
                for (int i = 1; i <= 10; i++) {
                    B.acquire();
                    System.out.print("B");
                    C.release();
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
            }

        }, "线程：B");

        Thread t3 = new Thread(() -> {
            try {
                for (int i = 1; i <= 10; i++) {
                    C.acquire();
                    System.out.print("C");
                    A.release();
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
            }

        }, "线程：C");

        t1.start();
        t2.start();
        t3.start();

    }
}

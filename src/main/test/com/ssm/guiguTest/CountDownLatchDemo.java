package com.ssm.guiguTest;

import java.util.concurrent.CountDownLatch;

/**
 * 当A任务在等待 前面B 任务执行完成后 才做某件事情 可以用 Countdownlatch
 * 当减到某个数 时 表示处理完成
 */
public class CountDownLatchDemo {

    public static void main(String[] args) throws InterruptedException {

        CountDownLatch latch = new CountDownLatch(7);
        for (int i = 1; i <= 6; i++) {
            int tem = i;
            new Thread(() -> {
                latch.countDown();
                System.out.println(Thread.currentThread().getName() + "正在执行");
                try {
                    Thread.sleep(3000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }, "线程：" + i).start();

        }

        new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println(Thread.currentThread().getName() + "正在执行");
                try {
                    Thread.sleep(3000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                latch.countDown();

            }
        }, "线程 7").start();

        System.out.println("等待7个子线程执行完毕...");
        latch.await();
        System.out.println("7个子线程已经执行完毕");
        System.out.println("继续执行主线程");
    }

}

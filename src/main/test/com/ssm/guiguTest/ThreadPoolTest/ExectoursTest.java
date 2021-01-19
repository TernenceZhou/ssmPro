package com.ssm.guiguTest.ThreadPoolTest;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.RejectedExecutionHandler;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

/**
 * Executor/Executors
 * Collection/Collections
 * Array/Arrays
 */
public class ExectoursTest {

    public static void main(String[] args) {

        //一池多窗口
        ExecutorService pool = Executors.newFixedThreadPool(5);

        ThreadPoolExecutor poolExecutor = new ThreadPoolExecutor(
            3
            , 5,
            1L,
            TimeUnit.MILLISECONDS,
            new ArrayBlockingQueue<>(3),
            Executors.defaultThreadFactory(),
            new ThreadPoolExecutor.CallerRunsPolicy());
        //AbortPolicy 默认拒绝策略 当超过 max+队列size 时 会直接抛出 RejectedExecutionException
        //poolExecutor.submit(new Thread());
        //10个人 去银行办事 只有5个窗口

        for (int i = 1; i <= 10; i++) {
            Thread thread = new Thread(() -> {
                try {
                    TimeUnit.SECONDS.sleep(1L);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } finally {

                }
                System.out.println(Thread.currentThread().getName() + " --------------");
            });
            poolExecutor.submit(thread);
        }
        pool.shutdown();
    }
}

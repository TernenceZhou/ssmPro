package com.ssm.test.xiangxueClass.thread.lesson_10;

import org.junit.Test;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

/**
 * @author
 * @description
 * @date 2020/9/11
 */
public class CompletableFutureTest {

    @Test
    public void com() throws ExecutionException, InterruptedException {

        // 在 Java8 中，推荐使用 Lambda 来替代匿名 Supplier 实现类
        CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
            try {
                Thread.sleep(2000);
            } catch (Exception e) {
            }
            System.out.println("这就是一个线程");
            return "I have completed";
        });
        System.out.println(future.get());

    }
}

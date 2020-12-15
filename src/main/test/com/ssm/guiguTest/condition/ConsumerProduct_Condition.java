package com.ssm.guiguTest.condition;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

import com.ssm.common.util.StringUtil;

/**
 * 模拟生产消费者
 * Volatile/CAS/AtomicInteger/Lock/ReentrantLock/BlockingQueue 原子引用
 */
public class ConsumerProduct_Condition {

    public static void main(String[] args) throws InterruptedException {
        //适配器模式  构造注入 传递接口 创建实例
        MySource source = new MySource(new ArrayBlockingQueue<String>(10));

        new Thread(() -> {
            System.out.println(Thread.currentThread().getName() + "线程开始 \t 成功");
            System.out.println("\n");

            source.myProd();
        }, "AA ").start();

        new Thread(() -> {
            System.out.println(Thread.currentThread().getName() + "线程开始 \t 成功");
            System.out.println("\n");

            source.myConsumer();
        }, "BB ").start();

        TimeUnit.SECONDS.sleep(5);
        System.out.println("\n");
        System.out.println("大老板 暂停");
        source.stop();

    }

    static class MySource {

        private BlockingQueue<String> blockingQueue;
        private AtomicInteger atomicInteger = new AtomicInteger();
        private volatile boolean FLG = true;
        private AtomicBoolean atomicBoolean = new AtomicBoolean(true);

        //生产
        private void myProd() {
            boolean offer = false;
            String data = "";
            while (FLG) {
                try {
                    data = atomicInteger.incrementAndGet() + "";
                    offer = blockingQueue.offer(data, 2L, TimeUnit.SECONDS);
                    if (offer) {
                        System.out.println(Thread.currentThread().getName() + "生产队列 " + data + "\t 成功");
                    } else {
                        System.out.println(Thread.currentThread().getName() + "生产队列" + data + "\t 失败");
                    }
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }

                try {
                    TimeUnit.SECONDS.sleep(1L);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }

            System.out.println();
            System.out.println();
            System.out.println();
            System.out.println(Thread.currentThread().getName() + " 生产 队列任务 被叫停");

        }

        private void myConsumer() {
            String result = "";
            while (FLG) {
                //消费
                try {
                    result = blockingQueue.poll(2L, TimeUnit.SECONDS);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                if (StringUtil.isEmpty(result)) {
                    FLG = false;
                    System.out.println();
                    System.out.println();
                    System.out.println();
                    System.out.println(Thread.currentThread().getName() + " 2秒钟没有拿到数据 消费退出");
                    return;
                }

                System.out.println(Thread.currentThread().getName() + " 消费队列 " + result + "\t 成功");
            }

        }

        private void stop() {
            this.FLG = false;
        }

        //构造接口
        public MySource(BlockingQueue<String> blockingQueue) {
            this.blockingQueue = blockingQueue;
        }
    }

}

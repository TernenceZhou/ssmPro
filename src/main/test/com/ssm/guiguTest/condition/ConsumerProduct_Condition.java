package com.ssm.guiguTest.condition;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

/**
 *
 * 模拟生产消费者
 * Volatile/CAS/AtomicInteger/Lock/ReentrantLock/BlockingQueue
 *
 */
public class ConsumerProduct_Condition {

    public static void main(String[] args) {
        //适配器模式  构造注入 传递接口 创建实例
        BlockingQueue<String> blockingQueue = new ArrayBlockingQueue<>(3);

    }


    static class Consumer {

        private BlockingQueue<String> blockingQueue;

        public Consumer(BlockingQueue<String> blockingQueue) {
            this.blockingQueue = blockingQueue;
        }
    }
}

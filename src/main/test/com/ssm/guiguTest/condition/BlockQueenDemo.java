package com.ssm.guiguTest.condition;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.TimeUnit;

/**
 * 【添加元素】
 * BlockingQueue 提供了以下方法用于添加元素
 * <p>
 * 方法	说明
 * add()	如果插入成功则返回 true，否则抛出 IllegalStateException 异常
 * put()	将指定的元素插入队列，如果队列满了，那么会阻塞直到有空间插入
 * offer()	如果插入成功则返回 true，否则返回 false
 * offer(E e, long timeout, TimeUnit unit)	尝试将元素插入队列，如果队列已满，那么会阻塞直到有空间插入
 * 【检索元素】
 * BlockingQueue 提供了以下方法用于检索元素
 * <p>
 * 方法	说明
 * take()	获取队列的头部元素并将其删除，如果队列为空，则阻塞并等待元素变为可用
 * poll(long timeout, TimeUnit unit)	检索并删除队列的头部，如有必要，等待指定的等待时间以使元素可用，如果超时，则返回 null
 * 在构建生产者 - 消费者程序时，这些方法是 BlockingQueue 接口中最重要的构建块。
 */
public class BlockQueenDemo {

    public static void main(String[] args) throws InterruptedException {
        /**
         * 有边界的阻塞队列
         *
         * ArrayBlockingQueue
         * 必须给定初始容量，ArrayList就默认是10
         */
        System.out.println("--------------addQueue--------------start------------------------------");
        addQueye();
        System.out.println("--------------addQueue--------------end------------------------------");

        System.out.println("--------------putQueue--------------start------------------------------");
        putQueue();
        System.out.println("--------------putQueue--------------end------------------------------");

        System.out.println("--------------offerQueue--------------start------------------------------");
        offerQueue();
        System.out.println("--------------offerQueue--------------end------------------------------");


        System.out.println("--------------takeQueue--------------start------------------------------");
        takeQueue();
        System.out.println("--------------takeQueue--------------end------------------------------");

        System.out.println("--------------pollQueue--------------start------------------------------");
        pollQueue();
        System.out.println("--------------pollQueue--------------end------------------------------");
    }

    /**
     * offer
     */
    private static void offerQueue() throws InterruptedException {

        BlockingQueue<String> queue = new ArrayBlockingQueue<>(3);
        boolean offer = queue.offer("111");
        boolean offer2 = queue.offer("222");
        boolean offer3 = queue.offer("333");
        boolean offer4 = queue.offer("444");

        boolean offer5 = queue.offer("555", 1, TimeUnit.SECONDS);
        System.out.println("队列满了继续offer:" + offer4);
    }

    private static void addQueye() throws InterruptedException {
        BlockingQueue<String> addQueue = new ArrayBlockingQueue<>(3);
        addQueue.add("aaa");
        addQueue.add("bbb");
        addQueue.add("ccc");
        //addQueue.add("dddd");
        /**
         * 当超过队列最大容量时：
         * Exception in thread "main" java.lang.IllegalStateException: Queue full
         * 	at java.util.AbstractQueue.add(AbstractQueue.java:98)
         * 	at java.util.concurrent.ArrayBlockingQueue.add(ArrayBlockingQueue.java:312)
         * 	at com.ssm.guiguTest.condition.BlockQueenDemo.main(BlockQueenDemo.java:21)
         */
    }


    /**
     * 检索元素.
     * poll:
     * 检索并且删除头部.
     */
    private static void pollQueue() throws InterruptedException {
        BlockingQueue<String> queue = new ArrayBlockingQueue<>(3);
        queue.add("aaa");
        queue.add("bbb");
        queue.add("ccc");

        String take = queue.poll();
        queue.poll(1,TimeUnit.SECONDS);
        System.out.println("被删除元素：" + take);
        System.out.println("是否存在aaa ;" + queue.contains("aaa"));
    }

    /**
     * 检索元素.
     * take:
     * 获取队列的头部元素并将其删除，如果队列为空，则阻塞并等待元素变为可用
     */
    private static void takeQueue() throws InterruptedException {
        BlockingQueue<String> queue = new ArrayBlockingQueue<>(3);
        queue.add("aaa");
        queue.add("bbb");
        queue.add("ccc");
        //去
        String take = queue.take();
        System.out.println("被删除元素：" + take);
        System.out.println("是否存在;" + queue.contains("aaa"));
    }

    private static void putQueue() throws InterruptedException {
        /**
         * put：
         * put队满时 继续添加将会一直阻塞
         * 将指定的元素插入队列，如果队列满了，那么会阻塞直到有空间插入
         */

        BlockingQueue<String> putQueue = new ArrayBlockingQueue<>(3);
        new Thread(() -> {
            try {
                putQueue.put("aaa");
                putQueue.put("bbb");
                putQueue.put("ccc");
                System.out.println(Thread.currentThread().getName() + "\t" + "add queue [ccc] --------- end");

                putQueue.put("ddd");
                System.out.println(Thread.currentThread().getName() + "\t" + "add queue [ddd] --------- full");

            } catch (InterruptedException e) {
                e.printStackTrace();
            }

        }, "线程--AAA").start();

        new Thread(() -> {
            try {
                putQueue.remove("aaa");
                System.out.println(Thread.currentThread().getName() + "\t" + "remove queue [aaa]");
                System.out.println(Thread.currentThread().getName() + "\t" + "队列继续添加");
            } catch (Exception e) {
                e.printStackTrace();
            }

        }, "线程---BBB").start();

    }
}

package com.ssm.xiangxueClass.thread.lesson07_ConcurrentHash.ConcurrentContainer.concurrentHashMap;

import org.junit.Test;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ConcurrentLinkedQueue;

/**
 * @author
 * @description
 *  无边界阻塞队列
 *  add,offer将元素插入到尾部，peek（拿头部的数据，但是不移除）和poll（拿头部的数据，但是移除）
 * @date 2019/8/29
 */
public class ConcurrentLinkedQueueTest {

    @Test
    public void con(){
        ConcurrentLinkedQueue queue = new ConcurrentLinkedQueue();
//        queue.add("1");
//        queue.offer("2");
        int size = queue.size();
        //如果队列为空时 检查获取时候报NosuchElementException异常
        System.out.println(queue.element());
//        System.out.println(queue.peek());
        for (Object o : queue) {
            System.out.println(o);
        }

        //ArrayBlockingQueue
        //有边界的阻塞队列 ，初始化必须传入大小
        ArrayBlockingQueue blockingQueue = new ArrayBlockingQueue(10);


    }
}

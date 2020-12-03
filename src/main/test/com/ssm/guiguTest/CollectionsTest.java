package com.ssm.guiguTest;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * 集合相关数据结构测试.
 * 如何实现线程安全的集合操作类
 */
public class CollectionsTest {

    public static void main(String[] args) {
        //线程不安全的类
        //unSafeList();
        //线程安全的list  synchronizedList
        //synchronizedList();
        //线程安全的list CopyOnWriteArrayList 写时复制解決list的线程安全操作 比 Vector好
        copyOnWrite();

    }

    private static void unSafeList() {
        List list = new ArrayList<String>();
        for (int i = 1; i < 30; i++) {
            new Thread(() -> {
                list.add(Thread.currentThread().getName() + "    " + UUID.randomUUID().toString());
                System.out.println(list);
            }, "线程：" + i).start();
        }
    }

    private static void synchronizedList() {
        List list = Collections.synchronizedList(new ArrayList<>());
        for (int i = 1; i < 30; i++) {
            new Thread(() -> {
                list.add(Thread.currentThread().getName() + "    " + UUID.randomUUID().toString());
                System.out.println(list);
            }, "线程：" + i).start();
        }
    }

    private static void copyOnWrite() {
        List list = new CopyOnWriteArrayList();

        for (int i = 1; i < 30; i++) {
            new Thread(() -> {
                list.add(Thread.currentThread().getName() + "    " + UUID.randomUUID().toString());
                System.out.println(list);
            }, "线程：" + i).start();
        }
    }

    /**
     * 在多线程情况下操作 集合类：会 ConcurrentModificationException 异常
     *
     * 1.怎么解决
     *   Vector
     *   Collections.synchronizedList(xxx)
     * 2.如果不用以上的相关类
     * 使用 CopyOnWriteArrayList
     * 实现原理是用ReentrantLock 实现 ，变量用volatile修饰
     *
     */

}

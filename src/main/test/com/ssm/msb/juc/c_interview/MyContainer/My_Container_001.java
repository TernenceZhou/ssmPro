package com.ssm.msb.juc.c_interview.MyContainer;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import com.ssm.common.util.CommonUtil;

/**
 *@author
 *@description
 *   写一个固定容量同步容器，拥有put和get方法，以及getCount方法，
 *   能够支持2个生产者线程以及10个消费者线程的阻塞调用
 *   <p>
 *   使用wait和notify/notifyAll来实现
 *@date 2021/7/16
 */
public class My_Container_001<T> {


    private volatile int MAX_VALUE = 10;
    private LinkedList<T> list = new LinkedList<>();
    volatile int count = 0;

    public synchronized void put(T t) {
        while (list.size() == MAX_VALUE) {
            try {
                this.wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        list.add(t);
        ++count;
        this.notifyAll();//唤醒其他的消费者
    }

    public synchronized T get() {
        T t;
        while (list.size() == 0) {
            try {
                this.wait();//唤醒生产线程
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        t = list.removeFirst();
        count--;
        this.notifyAll();
        return t;
    }


    public static void main(String[] args) {


        My_Container_001 container = new My_Container_001();

        //生产
        for (int i = 0;i<2;i++) {
            new Thread(()-> {
                for (int j = 0; j < 25; j++) {
                    container.put(Thread.currentThread().getName() + j);
                }
            },"p").start();
        }


        //消费
        for (int i = 0; i < 10; i++) {
            new Thread(()-> {
                for (int j = 0; j < 5; j++) {
                    System.out.println(container.get() );
                    CommonUtil.commonSleep(1);

                }
            },"c" + i).start();
        }
    }

}

package com.ssm.guiguTest;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * 需求：
 * 执行任务 先执行A  然后再执行B 交替
 * 就比如 空调 一个开一个关
 */


class ThreadData {
    int num  = 0;

    private Lock lock = new ReentrantLock();

    private Condition condition = lock.newCondition();

    public void increament() {
        lock.lock();
        try {
            while (num != 0) {
                //有任务了 等待后面线程消费
                condition.await();
            }
            num ++ ;
            condition.signalAll();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }

    public void decreament() {
        lock.lock();
        try {
            while (num == 0) {
                condition.await();
            }
            num--;
            condition.signalAll();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }
}

public class BlockingQueueTask {
    public static void main(String[] args) {
        //开始   线程  执行   条件   资源类
        ThreadData data = new ThreadData();
        new Thread(() -> {
            for (int i = 1;i<=5;i++ ) {
                data.increament();
                try {
                    //TimeUnit.SECONDS.sleep(1);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                System.out.println(Thread.currentThread().getName() + "\t" + data.num);
            }
        },"线程：A").start();

        new Thread(() -> {
            for (int i = 1;i<=5;i++ ) {
                data.decreament();
                try {
                    //TimeUnit.SECONDS.sleep(1);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                System.out.println(Thread.currentThread().getName() + "\t" + data.num);
            }
        },"线程：B").start();


    }
}

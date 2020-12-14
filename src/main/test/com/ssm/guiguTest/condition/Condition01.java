package com.ssm.guiguTest.condition;

import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * 需求：
 * 执行任务 先执行A  然后再执行B 交替
 * 就比如 空调 一个开一个关
 */


public class Condition01 {
    public static void main(String[] args) {
        //  线程  执行     资源类
        //         方法
        ThreadData data = new ThreadData();
        /*new Thread(() -> {
            for (int i = 1; i <= 5; i++) {
                data.increament();
                try {
                    //TimeUnit.SECONDS.sleep(1);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }, "线程：A").start();

        new Thread(() -> {
            for (int i = 1; i <= 5; i++) {
                data.deCreament();
                try {
                    //TimeUnit.SECONDS.sleep(1);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }, "线程：B").start();*/

        new Thread(() -> {
            for (int i = 1; i <= 5; i++) {
                data.getAndIncrement();
                try {
                    //TimeUnit.SECONDS.sleep(1);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }, "线程：A").start();

        new Thread(() -> {
            for (int i = 1; i <= 5; i++) {
                data.getAndDecrement();
                try {
                    //TimeUnit.SECONDS.sleep(1);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }, "线程：B").start();

    }

    static class ThreadData {
        int num = 0;
        AtomicInteger atomicInteger = new AtomicInteger();
        private Lock lock = new ReentrantLock();
        private Condition condition = lock.newCondition();

        public void increament() {
            lock.lock();
            try {
                while (num != 0) {
                    //有任务了 等待后面线程消费
                    condition.await();
                }
                num++;
                System.out.println(Thread.currentThread().getName() + "\t" + num);
                condition.signalAll();
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                lock.unlock();
            }
        }

        public void deCreament() {
            lock.lock();
            try {
                while (num == 0) {
                    condition.await();
                }
                num--;
                System.out.println(Thread.currentThread().getName() + "\t" + num);
                condition.signalAll();
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                lock.unlock();
            }
        }

        public void getAndIncrement() {
            lock.lock();
            try {
                if (atomicInteger.get() != 0) {
                    //有任务了 等待后面线程消费
                    condition.await();
                }
                atomicInteger.getAndIncrement();
                System.out.println(Thread.currentThread().getName() + "\t" + atomicInteger.intValue());
                condition.signalAll();
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                lock.unlock();
            }
        }

        public void getAndDecrement() {
            lock.lock();
            try {
                if (atomicInteger.get() == 0) {
                    condition.await();
                }
                atomicInteger.getAndDecrement();
                System.out.println(Thread.currentThread().getName() + "\t" + atomicInteger.intValue());
                condition.signalAll();
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                lock.unlock();
            }
        }
    }
}

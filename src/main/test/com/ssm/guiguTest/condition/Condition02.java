package com.ssm.guiguTest.condition;

import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * @author
 * @description
 * @date 2020/12/14
 */
public class Condition02 {

    public static void main(String[] args) {

        ShareData data = new ShareData();

        new Thread(()-> {
            for (int i = 0; i < 5; i++) {
                data.print5();
            }
        },"线程 A ：").start();

        new Thread(()-> {
            for (int i = 0; i < 5; i++) {
                data.print10();
            }
        },"线程 B：").start();

        new Thread(()-> {
            for (int i = 0; i < 5; i++) {
                data.print15();
            }
        },"线程 C ：").start();
    }

    static class ShareData {

        int num = 1;
        Lock lock = new ReentrantLock();
        Condition c1 = lock.newCondition();
        Condition c2 = lock.newCondition();
        Condition c3 = lock.newCondition();

        public void print5 () {
            lock.lock();
            try {
                while (num != 1) {
                    c1.await();
                }
                for (int i=1;i<=5;i++) {
                    System.out.println(Thread.currentThread().getName() + "\t" + num);
                }
                num = 2;
                c2.signal();
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                lock.unlock();
            }
        }
        public void print10 () {
            lock.lock();
            try {
                while (num != 2) {
                    c2.await();
                }
                for (int i=1;i<=10;i++) {
                    System.out.println(Thread.currentThread().getName() + "\t" + num);
                }
                num = 3;
                c3.signal();
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                lock.unlock();
            }
        }

        public void print15 () {
            lock.lock();
            try {
                while (num != 3) {
                    c3.await();
                }
                for (int i=1;i<=15;i++) {
                    System.out.println(Thread.currentThread().getName() + "\t" + num);
                }
                num = 1;
                c1.signal();
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                lock.unlock();
            }
        }

    }
}


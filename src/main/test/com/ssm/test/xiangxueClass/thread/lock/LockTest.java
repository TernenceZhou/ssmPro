package com.ssm.test.xiangxueClass.thread.lock;

import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * 继承Thread的方式 中断线程
 */
public class LockTest {



    private static class UseThread extends Thread{
        public UseThread(String threadName){
            super(threadName);
        }
        @Override
        public void run() {
            ReentrantLock reentrantLock = new ReentrantLock();
            Condition condition = reentrantLock.newCondition();

            String threadName = Thread.currentThread().getName();

            while (!isInterrupted()){
                System.out.println("threadName ====>"+threadName + "is runing,Interrupt flag is "+isInterrupted());
            }
            System.out.println("threadName ====>"+threadName + "is Interrupted======>Interrupt flag is "+isInterrupted());

        }

    }

    public static void main(String[] args) throws InterruptedException {

        UseThread userThread = new UseThread("UseThread");
        userThread.start();
        Thread.sleep(20);
        userThread.interrupt();
    }
}

package com.ssm.test.xiangxueClass.thread.AQS;

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class LockDemo {
    private  Lock lock = new ReentrantLock();
    private int count;
    public static void main(String[] args) {
        long start = System.currentTimeMillis();
        LockDemo lockDemo = new LockDemo();
        for (int i = 0; i < 100000000; i++) {
//            lockDemo.lock();
            lockDemo.synIncr();
        }
        long end = System.currentTimeMillis();
        System.out.println(end-start);
        System.out.println(lockDemo.getCount());
    }

    public void lock(){
        lock.lock();
        try{
            count++;
        }finally {
            lock.unlock();
        }

    }

    public int getCount() {
        return count;
    }

    public synchronized void synIncr(){
        count++;
    }

}

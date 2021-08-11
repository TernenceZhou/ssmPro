package com.ssm.msb.juc.c_018_00_AtomicXXX;

import java.util.concurrent.atomic.LongAdder;

/**
 * @author
 * @description
 * @date 2021/7/19
 */
public class T03_SyncVsLongAdder {

    static int count = 0;
    static LongAdder longAdder = new LongAdder();

    public static void main(String[] args) throws InterruptedException {
        final Object object = new Object();
        Thread[] threads = new Thread[500];
        int len = threads.length;
        for (int i = 0 ; i<len ;i++) {
            threads[i] = new Thread(()->{
                for (int j = 0 ;j<100000; j++) {
                    synchronized (object) {
                        count++;
                    }
                }
            });
        }

        long start = System.currentTimeMillis();
        for (Thread thread : threads) {
            thread.start();
        }
        for (Thread thread : threads) {
            thread.join();
        }
        long end = System.currentTimeMillis();


        System.out.println(count + " \tsync use time:  " + String.valueOf((end - start)));

      //-------------------------------------------------------------------------------------
        for (int i = 0 ; i<len ;i++) {
            threads[i] = new Thread(()->{
                for (int j = 0 ;j<100000; j++) {
                    longAdder.increment();
                }
            });
        }

        long startaddr = System.currentTimeMillis();
        for (Thread thread : threads) {
            thread.start();
        }
        for (Thread thread : threads) {
            thread.join();
        }
        long endaddr = System.currentTimeMillis();

        System.out.println(longAdder.longValue() + " \tsync use time:  " + String.valueOf((endaddr - startaddr)));

    }
}

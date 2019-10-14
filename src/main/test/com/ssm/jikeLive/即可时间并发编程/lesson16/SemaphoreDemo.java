package com.ssm.jikeLive.即可时间并发编程.lesson16;

import java.util.concurrent.Semaphore;

/**
 * @author
 * @description
 * @date 2019/10/11
 * 简单信号量测试
 */
public class SemaphoreDemo{

    private static int count = 0;

    private static final Semaphore semaphore = new Semaphore(2);


    public synchronized static int getCount() {
        return count;
    }

    public static int calc(){
        try {
            //信号量值减1
            semaphore.acquire();
            count = count +1;
            //Thread.sleep(50);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            //信号量值加1
           semaphore.release();
        }
        return count;
    }

    static class Mythread extends Thread{
        private int count;

        private static final Semaphore semaphore = new Semaphore(1);
        @Override
        public void run() {
            try {
                //信号量值减1
                semaphore.acquire();
                Thread.sleep(50);
                count = count +1;
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                //信号量值加1
                semaphore.release();
            }
            System.out.println(count);
        }

        public int getCount() {
            return count;
        }
    }

    public static void main(String[] args) {
        SemaphoreDemo semaphoreDemo = new SemaphoreDemo();
        for (int i = 0; i < 10; i++) {
            new Thread(()->{
//                System.out.println(semaphoreDemo.calc()+" "+SemaphoreDemo.getCount());
                System.out.println(Thread.currentThread().getName()+" --  "+SemaphoreDemo.calc()+ "   count:" +getCount());
            }).start();
        }
    }
}

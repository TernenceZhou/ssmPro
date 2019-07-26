package com.ssm.test.xiangxueClass.thread.tool;

import java.util.concurrent.CountDownLatch;

/**
 * @author
 * @description
 * @date 2019/6/13
 */
public class Demo {
    static CountDownLatch latch  = new CountDownLatch(2);

    public static void main(String[] args) throws InterruptedException {
        Worker worker = new Worker("zhangsan",1000);
        Worker worker2 = new Worker("lsi",2000);
        worker.start();
        worker2.start();
        latch.await();
        System.out.println("all is work end!");
    }


    static class Worker extends Thread{
        String username;
        int time;

        public Worker(String username, int time) {
            this.username = username;
            this.time = time;
        }

        @Override
        public void run() {
            System.out.println(username+"begin work");
            work();
            System.out.println(username+"complete work");
            latch.countDown();

        }
        public void work(){
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}

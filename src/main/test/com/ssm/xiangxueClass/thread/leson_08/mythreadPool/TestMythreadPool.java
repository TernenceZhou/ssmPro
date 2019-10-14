package com.ssm.xiangxueClass.thread.leson_08.mythreadPool;

import java.util.Random;

public class TestMythreadPool {
    public static void main(String[] args) throws InterruptedException {
        // 创建3个线程的线程池
        MythreadPool t = new MythreadPool(3,0);
        t.executePool(new MyTask("testA"));
        t.executePool(new MyTask("testB"));
        t.executePool(new MyTask("testC"));
        t.executePool(new MyTask("testD"));
        t.executePool(new MyTask("testE"));
        System.out.println(t);
        Thread.sleep(10000);
        t.destroy();// 所有线程都执行完成才destory
        System.out.println(t);
    }
    // 任务类
    static class MyTask implements Runnable {

        private String name;
        private Random r = new Random();

        public MyTask(String name) {
            this.name = name;
        }

        public String getName() {
            return name;
        }

        @Override
        public void run() {// 执行任务
            try {
                Thread.sleep(r.nextInt(1000)+2000);
            } catch (InterruptedException e) {
                System.out.println(Thread.currentThread().getId()+" sleep InterruptedException:"
                        +Thread.currentThread().isInterrupted());
            }
            System.out.println("任务 " + name + " 完成");
        }
    }
}

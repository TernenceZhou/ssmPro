package com.ssm.xiangxueClass.thread.tool;

import java.util.concurrent.Semaphore;

/**
 * @author
 * @description
 * Semaphore
 * 控制同时访问某个特定资源的线程数量，用在流量控制
 * Semaphore可以控同时访问的线程个数，通过 acquire() 获取一个许可，如果没有就等待，而 release() 释放一个许可。
 * 假若一个工厂有5台机器，但是有8个工人，一台机器同时只能被一个工人使用，只有使用完了，其他工人才能继续使用。
 * @date 2019/6/17
 */
public class SemaphoreTest {
    private static Semaphore semaphore = new Semaphore(5); //机器
    private static int N = 8; //工人
    public static void main(String[] args) {
        for (int i = 0; i < N; i++) {
            new Thread(new Work(semaphore)).start();
        }
    }


    static class Work extends Thread{
        private Semaphore semaphore;
        public Work(Semaphore semaphore) {
            this.semaphore = semaphore;
        }

        @Override
        public void run() {
            try {
                semaphore.acquire();
                System.out.println(Thread.currentThread().getId()+" 工人占用一个机器在生产...！");
                Thread.sleep(2000);
                System.out.println(Thread.currentThread().getId()+" 工人释放出机器！");
                semaphore.release();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}

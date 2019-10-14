package com.ssm.xiangxueClass.thread.tool;

import java.util.concurrent.BrokenBarrierException;
import java.util.concurrent.CyclicBarrier;

/**
 * @author
 * @description
 * 写了之后再处理其他线程东西
 *
 *
 * @date 2019/6/17
 */
public class CyclicBarrierTest {

    private static CyclicBarrier barrier = new CyclicBarrier(5,new Barrier());
    static int N = 5;
    public static void main(String[] args) {
        for (int i = 0; i < N; i++) {
           new Thread(new Write(barrier)).start();
        }

    }

    static class Barrier extends Thread{
        @Override
        public void run() {
            try {
                Thread.sleep(2000);
                System.out.println(Thread.currentThread().getId()+" 开始业务处理！");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }


    static class Write implements Runnable{
        private CyclicBarrier barrier;
        public Write(CyclicBarrier barrier){
            this.barrier = barrier;
        }

        @Override
        public void run() {
            System.out.println("线程"+Thread.currentThread().getName()+"正在写入数据...");
            try {
                Thread.sleep(2000);
                System.out.println("线程"+Thread.currentThread().getName()+"写入数据完毕，等待其他线程写入完毕");
                barrier.await();

            } catch (InterruptedException e) {
                e.printStackTrace();
            } catch (BrokenBarrierException e) {
                e.printStackTrace();
            }
            System.out.println("所有线程写入完毕，继续处理其他任务...");

        }
    }


}

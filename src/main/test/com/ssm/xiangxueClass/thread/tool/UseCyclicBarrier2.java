package com.ssm.xiangxueClass.thread.tool;

import java.util.Random;
import java.util.concurrent.BrokenBarrierException;
import java.util.concurrent.CyclicBarrier;

/**
 *类说明：CyclicBarrier的使用
 */
public class UseCyclicBarrier2 {
	
   static CyclicBarrier barrier = new CyclicBarrier(4,new BussessCyclic());


    public static void main(String[] args) {
        for (int i = 0; i < 4; i++) {
            new Thread(new WorkCyclic()).start();
        }
    }
    static class BussessCyclic extends Thread{
        @Override
        public void run() {
            try {
                Thread.sleep(2000);
                System.out.println("do its business ");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

        }
    }
    static class WorkCyclic extends Thread{
        @Override
        public void run() {
            long id = Thread.currentThread().getId();//线程本身的处理结果
            Random r = new Random();//随机决定工作线程的是否睡眠
            try {
                if(r.nextBoolean()) {
                    Thread.sleep(2000+id);
                    System.out.println("Thread_"+id+" ....do something ");
                }
                System.out.println(id+"....is await");
                barrier.await();
                System.out.println("do other business........");
                Thread.sleep(1000);

            } catch (InterruptedException e) {
                e.printStackTrace();
            } catch (BrokenBarrierException e) {
                e.printStackTrace();
            }
        }
    }

}

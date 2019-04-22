package com.ssm.test.xiangxueClass.thread;

/**
 * 继承Thread的方式 中断线程
 */
public class EndThread {

    private static class UseThread extends Thread{
        public UseThread(String threadName){
            super(threadName);
        }
        @Override
        public void run() {
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

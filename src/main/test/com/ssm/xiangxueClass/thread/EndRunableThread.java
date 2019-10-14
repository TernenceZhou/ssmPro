package com.ssm.xiangxueClass.thread;

public class EndRunableThread {

    private static class UseRunable implements Runnable{
       /* public UseRunable(String threadName){
            super(threadName);
        }*/

        @Override
        public void run() {
            String threadName = Thread.currentThread().getName();

            while (!Thread.currentThread().isInterrupted()){
                System.out.println("threadName ====>"+threadName + "is runing ，interrupt flag is "
                        + Thread.currentThread().isInterrupted());
            }
            System.out.println("threadName ====>"+threadName + "interrupt flag is "
                    + Thread.currentThread().isInterrupted());

        }

    }

    public static void main(String[] args) throws InterruptedException {
        Thread thread = new Thread(new UseRunable());
        thread.start();
        Thread.sleep(20);
        thread.interrupt();
    }
}

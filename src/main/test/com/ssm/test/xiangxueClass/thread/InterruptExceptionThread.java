package com.ssm.test.xiangxueClass.thread;

/**
 *中断过程中有InterruptException 异常 处理中断不可达问题
 * 出现InterruptedException异常catch之后需要再次在catch块中进行手动中断线程操作
 */
public class InterruptExceptionThread {

    private static class UseThread extends Thread{
        public UseThread(String threadName){
            super(threadName);
        }

        @Override
        public void run() {
            String threadName = Thread.currentThread().getName();

            while (!isInterrupted()){
                try {
                    Thread.sleep(200);
                } catch (InterruptedException e) {
                    interrupt(); // 出现InterruptedException异常catch之后需要再次在catch块中进行手动中断线程操作
                                //如果不写线程没有终止
                    e.printStackTrace();
                    System.out.println("threadName ====>"+threadName + " is catch ，interrupt flag is "
                            + Thread.currentThread().isInterrupted());
                }
                System.out.println("threadName ====>"+threadName + " is runing ，interrupt flag is "
                        + Thread.currentThread().isInterrupted());
            }
            System.out.println("threadName ====>"+threadName + " interrupt flag is "
                    + Thread.currentThread().isInterrupted());

        }

    }

    public static void main(String[] args) throws InterruptedException {
        UseThread thread = new UseThread("Thread");
        thread.start();
        Thread.sleep(500);
        thread.interrupt();
    }
}

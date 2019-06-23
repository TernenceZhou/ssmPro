package com.ssm.test.xiangxueClass.thread;

/**
 * 设置守护线程
 * 守护线程和自主线程
 * 类说明：守护线程的使用和守护线程中的finally语句块
 * 守护线程的finally不能保证一定执行
 */
public class SetDaemonThread {

    private static class DaemonThread extends Thread{
        public DaemonThread(String threadName){
            super(threadName);
        }
        @Override
        public void run() {
            try {
                String threadName = Thread.currentThread().getName();
                while (!isInterrupted()){
                    System.out.println("threadName ====>"+threadName +
                            "   is runing,Interrupt flag is "+isInterrupted());
                }
                System.out.println("threadName ====>"+threadName +
                        "   is Interrupted======>Interrupt flag is "+isInterrupted());
            }finally {
                System.out.println("========finally....");

            }
        }

    }

    /**
     * 主线程的
     * @param args
     * @throws InterruptedException
     */
    public static void main(String[] args) throws InterruptedException {
        /**
         * 只有当调用了start方法之后 才会将线程对象和操作系统中的实际线程进行映射 ，然后调用run 方法
         */
        DaemonThread daemonThread = new DaemonThread("UseThread");
        daemonThread.setDaemon(true);// 要设置在start之前 daemonThread成为了main线程的守护线程
        daemonThread.start();
        Thread.sleep(20);
        daemonThread.interrupt();

    }
}

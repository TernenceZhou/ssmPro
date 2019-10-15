package com.ssm.xiangxueClass.thread;

/**
 * start和run的区别
 */
public class StartAndRun {

    private static class UseThread extends Thread{
        public UseThread(String threadName){
            super(threadName);
        }
        @Override
        public void run() {
            int i = 90;
            while(i>0){
                SleepTools.ms(1000);
                System.out.println("I am "+Thread.currentThread().getName()
                        +" and now the i="+i--);
            }

        }

    }

    public static void main(String[] args) throws InterruptedException {

        UseThread userThread = new UseThread("UseThread");
        userThread.setName("thread001");
//        userThread.run(); // 打印结果是i am main 所以表示现在调用的是实例后的一个方法 不是代表thread001线程
        userThread.start();// 打印结果是i am thread001 所以表示现在调用的是thread001线程

        //Thread.sleep(20);
        //userThread.interrupt();

        /**
         * 5 - 10 缺省为5 越小越高
         * **/
        userThread.setPriority(5);
    }
}

package com.ssm.test.xiangxueClass.thread.lesson_09;

/**
 * 简单死锁示例
 */
public class Dead_Lock {

    //定义锁对象
    private static Object firstLock = new Object();
    private static Object secondLock = new Object();


    public static void lock1() {
        String threadName = Thread.currentThread().getName();

        synchronized (firstLock){
            System.out.println(threadName+" get first");
            try {
                Thread.sleep(1000);
            }catch (InterruptedException e){
                e.printStackTrace();
            }
            synchronized (secondLock){
                System.out.println(threadName+" get second");
            }
        }
    }

    public static void lock2() {
        String threadName = Thread.currentThread().getName();
        synchronized (secondLock){
          try {
              Thread.sleep(1000);
          }catch (InterruptedException e){
              e.printStackTrace();
          }
            System.out.println(threadName+" get first");
            synchronized (firstLock){
                System.out.println(threadName+" get second");
            }
        }
    }
    private static class WorkThread extends Thread{

        private String  name;

        public WorkThread(String name) {
            this.name = name;
        }

        @Override
        public void run() {
            Thread.currentThread().setName(name);
            lock2();
        }
    }

    public static void main(String[] args) {

        //主线程的
        Thread.currentThread().setName("TestDeadThread");

        //工作线程
        WorkThread workThread = new WorkThread("SubTestThread");
        workThread.start();
        lock1();
    }

}

package com.ssm.xiangxueClass.thread.lesson_09.deadLock;

/**
 * 简单分析一下，线程t1因为flag为false所以永远走esle分支，相反的t2永远走if分支，当main线程运行到t2.start()；之后，两个线程开启，
 * 假定t2先拿到cpu的执行权，走if分支拿到obj1锁，这时候有可能t1也拿到cpu的执行权拿到obj2的锁，再如果t2继续走想拿obj2锁，
 * 但此时obj2锁在t1手里，而t2也想拿obj1，这样都相互想拿对方的锁，就僵持不下造成死锁，加一个while(true)的原因是让他一定出现死锁，
 * 不然有时候试好多次，死锁的现象不明显就蛋碎了。
 */
public class Dead_lock2 implements Runnable{

    private static Object object = new Object();

    private boolean flg;
    public Dead_lock2(boolean flag) {
        this.flg = flag;
    }

    @Override
    public void run() {
        if (flg) {
            while (true) {
                System.out.println(Thread.currentThread().getName() + "flg:"+ flg);
                synchronized (LockObj.obj1) {
                    System.out.println(Thread.currentThread().getName()+"  if...");
                    synchronized (LockObj.obj2) {
                        System.out.println(Thread.currentThread().getName()+"  if...");
                    }
                }
            }
        } else {
            while (!flg) {
                synchronized (LockObj.obj2) {
                    System.out.println(Thread.currentThread().getName()+"  else...");
                    synchronized (LockObj.obj1) {
                        System.out.println(Thread.currentThread().getName()+"  else...");
                    }
                }
            }
        }

    }

    public static void main(String[] args) {
        Dead_lock2 lock2 = new Dead_lock2(true);
        Dead_lock2 lock3 = new Dead_lock2(false);
        Thread t1 = new Thread(lock2);
        Thread t2 = new Thread(lock3);
        t1.start();
        t2.start();
    }
}

package com.ssm.test.xiangxueClass.thread.synchronize;

/**
 * @author
 * @description
 * @date 2019/6/18
 */
public class SynchronizedTest {
//     long count = 0L;
    private int count = 0;

    public int read(){
        return count;
    }
    public synchronized void addOne(){
        count++;
    }





    static class WorkThread extends Thread{
        private SynchronizedTest sy;
        public WorkThread(SynchronizedTest sy){
            this.sy = sy;
        }
        @Override
        public void run() {
            for (int i = 0; i < 10000; i++) {
                sy.addOne();
            }
            System.out.println(Thread.currentThread().getName()
                    +" age =  "+sy.read());
        }
    }
    public static void main(String[] args) {
        SynchronizedTest test = new SynchronizedTest();
        Thread t = new WorkThread(test);
        t.start();
        System.out.println(test.read());
    }
}

package com.ssm.xiangxueClass.thread.callableDemo;

/**
 * @author
 * @description
 * @date 2019/12/26
 * 多线程模拟一个线程增加 一个线程减少
 */
public class ThreadIncAndDec {

    int j = 0;

    public static void main(String[] args) {
        ThreadIncAndDec t = new ThreadIncAndDec();
        Inc inc = t.new Inc();
        Dec dec = t.new Dec();
        Thread ts = new Thread(inc);
        ts.start();
        Thread ts2 = new Thread(dec);
        ts2.start();

    }

    private synchronized void inc(){
        j++;
        System.out.println(Thread.currentThread().getName() +"inc：" + j);
    }

    private synchronized void dec(){
        j--;
        System.out.println(Thread.currentThread().getName()+"dec:" + j);

    }
    class Inc extends  Thread{
        @Override
        public void run() {
            for (int i = 0; i < 2; i++) {
                inc();
            }
        }
    }

     class  Dec extends  Thread{
        @Override
        public void run() {
            for (int i = 0; i < 2; i++) {
                dec();
            }
        }
    }
}

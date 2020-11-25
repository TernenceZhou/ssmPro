package com.ssm.guiguTest;

/**
 * @author
 * @description
 * @date 2020/11/23
 */
public class VolatileTest {

    public static void main(String[] args) {
        //testkejianxing();//查看可见性
        //不保证原子性
        final AddClass addClass = new AddClass();
        for (int i = 0; i < 2000; i++) {
            new Thread(() -> {
                addClass.add2000();
                System.out.println("当前线程名称：" +Thread.currentThread().getName() + "结果："+addClass.num);
            },"AAA").start();
        }
        //主线程查看执行结果
        System.out.println("当前线程名称：" +Thread.currentThread().getName() + "结果："+addClass.num);

    }

    private static void testkejianxing() {
        final AddClass addClass = new AddClass();
        int num = addClass.num;
        new Thread(()->{
            addClass.add60();
            System.out.println( Thread.currentThread().getName()+ ":" + addClass.num);
        },"AAA").start();

        while (addClass.num == 0) {
            //System.out.println("---");
        }
        System.out.println(Thread.currentThread().getName() + ":" +addClass.num);
    }

}

 class AddClass {

    volatile int num = 0;
    public void add60() {
        this.num = 60;
    }

    public void add2000() {
        num++;
    }
 }

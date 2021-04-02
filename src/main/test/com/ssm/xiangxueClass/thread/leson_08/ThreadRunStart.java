package com.ssm.xiangxueClass.thread.leson_08;

/**
 * @author
 * @description
 * @date 2021/3/17
 */
public class ThreadRunStart {
    public static void main(String[] args) {
        Thread thread = new Thread(() -> {
            System.out.println("thread 1111");
        });
        Thread thread2 = new Thread(() -> {
            System.out.println("thread 2222");
        });
        thread.start();
        thread.getState();
        thread.setPriority(1);
    }
}

package com.ssm.msb.juc.c_interview.A1B2C3;

import com.ssm.common.util.CommonUtil;

/**
 * @author
 * @description
 * @date 2021/7/16
 */
public class My_wait_notify {

    static Thread t1 = null, t2 = null,t3 = null;

    private static Object object = new Object();//锁对象

    public static void main(String[] args) throws InterruptedException {
        char[] aI = "1234567".toCharArray();
        char[] aC = "ABCDEFG".toCharArray();

        t1 = new Thread(()-> {
            synchronized (object) {
                for(char c:aI) {
                    System.out.print(c);
                    try {
                        object.notify();
                        object.wait();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
        });

        t2 = new Thread(()-> {
            synchronized (object) {
                for(char c: aC) {
                    System.out.print(c);
                    try {
                        object.wait();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    object.notify();
                }
            }
        });

       /* t3 = new Thread(()-> {
            synchronized (object) {
                for(char c: aC) {
                    System.out.print(c);
                    try {
                        object.notify();
                        object.wait();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
        });*/

        t1.start();
        t2.start();


    }
}

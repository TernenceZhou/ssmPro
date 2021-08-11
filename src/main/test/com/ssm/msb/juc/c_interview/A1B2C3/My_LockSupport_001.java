package com.ssm.msb.juc.c_interview.A1B2C3;

import java.util.concurrent.locks.LockSupport;

/**
 *@author
 *@description
 *@date 2021/7/16
 */
public class My_LockSupport_001 {

    static Thread t1 = null, t2 = null;


    public static void main(String[] args) {
        char[] aI = "1234567".toCharArray();
        char[] aC = "ABCDEFG".toCharArray();

        t1 = new Thread(()->{
            for (char c:aI) {
                System.out.print(c);
                LockSupport.unpark(t2);
                LockSupport.park();
            }
        });

        t2 = new Thread(()->{
            for (char c:aC) {
                LockSupport.park();
                System.out.print(c);
                LockSupport.unpark(t1);
            }
        });

        t1.start();
        t2.start();


    }


}

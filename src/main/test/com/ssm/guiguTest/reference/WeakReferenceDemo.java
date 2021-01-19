package com.ssm.guiguTest.reference;

import java.lang.ref.WeakReference;

/**
 * 不管内存够不够 垃圾回收时直接回收掉.
 */
public class WeakReferenceDemo {

    public static void main(String[] args) {

        Object o1 = new Object();
        WeakReference soft = new WeakReference(o1);
        o1 = null;
        System.gc();//手动模拟
        System.out.println(soft.get()); //空
    }
}

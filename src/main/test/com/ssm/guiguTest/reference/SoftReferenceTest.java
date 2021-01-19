package com.ssm.guiguTest.reference;

import java.lang.ref.SoftReference;

/**
 * 软引用
 * 内存不够时回收 够时不处理.
 */
public class SoftReferenceTest {

    public static void main(String[] args) {

        Object o1 = new Object();
        SoftReference soft = new SoftReference(o1);
        o1 = null;
        System.gc();//手动模拟
        System.out.println(soft.get()); //非null
    }
}

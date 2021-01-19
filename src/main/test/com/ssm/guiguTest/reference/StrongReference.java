package com.ssm.guiguTest.reference;

/**
 * @author
 * @description
 * @date 2021/1/5
 */
public class StrongReference {

    /**
     * 强引用
     * 打死都不回收
     *
     * @param args
     */
    public static void main(String[] args) {
        Object o1 = new Object();
        Object o2 = o1;

        System.out.println(o1);

        o1 = null;
        System.out.println(o1);
        System.out.println(o2);

    }
}

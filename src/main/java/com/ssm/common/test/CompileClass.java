package com.ssm.common.test;

/**
 * @author
 * @description
 * @date 2021/3/8
 */
public class CompileClass {
    public static void main(String[] args) {
        int a = 1215;
        Integer i1 = new Integer(1215);
        Integer i2 = new Integer(1215);
        Integer aa = 1;
        Integer bb = 1;
        System.out.println(i1.equals(i2));
        System.out.println(i1 == i2);
        System.out.println(a == i1);
        System.out.println(i1 + i2);
        System.out.println((aa + bb));
        System.out.println(i1.equals((aa + bb)));


        System.out.println();
        long l = 1215L;
        Long l1 = new Long(1215L);
        Long l2 = new Long(1215L);
        System.out.println(l == l1);
        System.out.println(l1 == l2);
        System.out.println(l1.equals(l2));


    }
}

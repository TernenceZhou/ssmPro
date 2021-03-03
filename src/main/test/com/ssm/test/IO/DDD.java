package com.ssm.test.IO;

import java.util.Objects;

/**
 * 查看jad文件操作步骤
 * javac xxx.java
 * javap -c xxx.class
 * jad xxx.class
 */
public class DDD {
    public static void main(String[] args) {
        Integer aa = new Integer(2);
        int bb = 2;
        System.out.println(aa == bb);

        boolean condition = false;
        Double value1 = 1.0D;
        Double value2 = 2.0D;
        Double value3 = null;
        //Double result = condition ? value1 * value2 : value3; NUll指针

        // String s1 = new String("aa");
        // String s2 = new String("aa");
        // System.out.println(s1 == s2);

        String s1 = "abc";
        String s2 = "ab" + "c";
        String s3 = "a" + "b" + "c";
        System.out.println(s1 == s2);
        System.out.println(s1 == s3);

        String s4 = "ab";
        String s5 = "c";
        String s6 = s4 + "c";
        System.out.println(s1 == s6);

        int i1 = 12345;
        Short shortValue = (short) 12345;

        System.out.println(Objects.equals(shortValue, i1)); //false
        System.out.println(i1 == shortValue); // true

    }
}

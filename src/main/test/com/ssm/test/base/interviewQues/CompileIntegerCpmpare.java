// Decompiled by Jad v1.5.8g. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://www.kpdus.com/jad.html
// Decompiler options: packimports(3) 
// Source File Name:   IntegerCompare.java

package com.ssm.test.base.interviewQues;

/**
 * 查看反编译后的结果
 * 类IntegerCompare.class 字节码
 * jad命令查看反编译后的结果
 */
public class CompileIntegerCpmpare
{
    public CompileIntegerCpmpare()
    {
    }
    public static void main(String args[])
    {
        Integer integer = new Integer(3);
        Integer integer1 = Integer.valueOf(3);
        byte byte0 = 3;
        Integer integer2 = Integer.valueOf(3);
        Integer integer3 = new Integer(2);
        Integer integer4 = new Integer(2);
        System.out.println(integer == integer1);
        System.out.println(integer.intValue() == byte0);
        System.out.println(integer1 == integer2);
        System.out.println(integer3 == integer4);
    }
}

package com.ssm.test.xiangxueClass.thread.lesson07_ConcurrentHash.ConcurrentContainer;

import org.junit.Test;

/**
 * 二进制数据
 * 参考链接：https://mp.weixin.qq.com/s/pVoL_KEr3gD46Wa5u9gVLw
 */
public class IntToBinary {
    @Test
    public void test(){
        int data = 6;
        String binary6 = Integer.toBinaryString(6);
        String binary8 = Integer.toBinaryString(8);
        System.out.println(" binary4: "+ Integer.toBinaryString(4) + "  binary6:  " + Integer.toBinaryString(6));
        System.out.println(" binary6: "+ binary6 + "  binary8:  " + binary8);
        //位或 | （1|1 = 1 ；1|0 = 1； 0|0 = 0）
        System.out.println("6|8:"+Integer.toBinaryString(6|8));
        //位与 & （1&1 = 1 ；1&0 = 0； 0&0 = 0）
        System.out.println("6 & 8:"+Integer.toBinaryString(6&8));
        System.out.println("4 & 6:"+Integer.toBinaryString(4&6));
        //位非 ~ （ ~1  = 0 ；~0  = 1）
        System.out.println("~4  :"+Integer.toBinaryString(~4));
        //位异或^（ 1^1 = 0 ；1^0 = 1； 0^0 = 0）

        // n % 2^m 等价于 n & (2^m - 1)
        System.out.println("(345 % 16)="+(345 % 16) +"  (345 & (16-1))=  " + (345 & (16-1)));
    }
    @Test
    public void test2(){
        /**
         * 计算 m * 2^n 次方
         */
        //2 << 3 = 16;
        //2 * (2 * 2 * 2) = 16;


        /**
         * 判断奇偶性 a & 1 = 0 偶数
         */
        int a = 11;
        int b = 2;
        System.out.println("a的二进制："+Integer.toBinaryString(a));
        System.out.println("b的二进制："+Integer.toBinaryString(b));

        //a --> 1011
        //1 --> 0001
        System.out.println("偶数0,奇数1 ：-------->  "+(a & 1));
        System.out.println("偶数0,奇数1 ：-------->  "+(b & 1));

        /**
        * 不用临时变量交换两个数
        */
        int m = 2;
        int mm = 3;
        m = m^mm;
        mm = mm^m;
        m = m^mm;
        System.out.println(m+"   " +mm);
    }
}

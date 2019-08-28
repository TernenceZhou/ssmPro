package com.ssm.test.xiangxueClass.thread.lesson07_ConcurrentHash.ConcurrentContainer;

import org.junit.Test;

/**
 * 二进制数据
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
}

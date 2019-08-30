package com.ssm.test.base;

/**
 * @author
 * @description
 * 位运算测试
 * @date 2019/8/29
 */
public class PositionArithmetic {

    public static void main(String[] args) {
        //线程个数 设置  分为IO密集型 和 CPU密集
        //
        /**
         * 位运算：
         * 位与: &  1 & 1 = 1 1 & 0 = 0  0 & 0 = 0
         * 位或：| 1|1 = 1 1 | 0 = 1    0 | 0 = 0
         * 位非：~ 1~ = 0  -0~ = 1
         * 位异或：^ 1^1 = 1 1^0 = 1  0 ^ 0 = 0
         *170  8-10
         *
         *
         * 10进制转换为2进制： 大 -> 小  除基取余数
         * 2-->10进制  小 到 大 权位相加
         */
        System.out.println(3^7);
        System.out.println(Integer.toBinaryString(2));
        System.out.println(Integer.toBinaryString(3)+"   "+Integer.toBinaryString(7));
        System.out.println(3 & 7);
        System.out.println(Integer.toBinaryString(-5));
        //a &= 3  表示为： a= a & 3
        System.out.println(5&3 );
    }
}

package com.ssm.test.base;

/**
 * @author
 * @description
 * 位运算测试
 * @date 2019/8/29
 * &	与	两个位都为1时，结果才为1
 * |	或	两个位都为0时，结果才为0
 * ^	异或	两个位相同为0，相异为1
 * ~	取反	0变1，1变0
 * <<	左移	各二进位全部左移若干位，高位丢弃，低位补0
 * >>	右移	各二进位全部右移若干位，对无符号数，高位补0，有符号数，各编译器处理方法不一样，有的补符号位（算术右移），有的补0（逻辑右移）
 *
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

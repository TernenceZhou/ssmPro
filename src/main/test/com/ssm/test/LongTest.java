package com.ssm.test;

/**
 * @author
 * @description
 * @date 2021/3/3
 */
public class LongTest {
    public static void main(String[] args) {
        Long long1 = 129L;
        Long long2 = Long.valueOf(129L);
        Long long3 = new Long(129L);
        System.out.println(long1 == long2);
        System.out.println(long1 == long3);
    }
}

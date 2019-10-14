package com.ssm.xiangxueClass.thread.forkJoinTest.sum;

import java.util.Random;

/**
 * 生成数组
 */
public class MakeArray {

    public static final int DEFAULT_INITIAL_CAPACITY = 4000;

    public static int[] makeArr(){
        int arr[] = new int[DEFAULT_INITIAL_CAPACITY];
        Random random = new Random();
        for (int i = 0; i < DEFAULT_INITIAL_CAPACITY; i++) {
            arr[i] = random.nextInt(DEFAULT_INITIAL_CAPACITY*3);
        }
        return arr  ;
    }

}

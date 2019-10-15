package com.ssm.xiangxueClass.thread.forkjoin.sum;

import java.util.Random;

public class MakeArr {

    public static final int DEFAULT_INITIAL_CAPACITY = 10000000;

    public static int[] makeArray(){
        int result[] = new int[DEFAULT_INITIAL_CAPACITY];
        Random r = new Random();
        for (int i = 0; i < DEFAULT_INITIAL_CAPACITY; i++) {
            result[i] = r.nextInt(DEFAULT_INITIAL_CAPACITY*2);
        }
        return result;
    }

    public static void main(String[] args) {
        Random r = new Random();
        for (int j = 0; j < 100; j++) {
            int i = r.nextInt(10000*3);
            System.out.println(i);

        }
    }
}

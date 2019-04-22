package com.ssm.test.HashMap;

import java.util.HashMap;

/**
 * 多线程死循环问题
 */
public class HashMapInfiniteLoop {
    private static HashMap<Integer, Integer> map = new HashMap<Integer, Integer>(2,0.75f);

    public static void main(String[] args) {
        map.put(5, 55);
        new Thread("Thread1"){
            @Override
            public void run() {
                map.put(7, 77);
                System.out.println(map);
            }
        }.start();

        new Thread("Thread2"){
            @Override
            public void run() {
                map.put(3, 33);
                System.out.println(map);
            }
        }.start();

    }
}

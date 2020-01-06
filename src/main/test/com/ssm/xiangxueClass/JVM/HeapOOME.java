package com.ssm.xiangxueClass.JVM;

import java.util.LinkedHashMap;

/**
 * @author
 * @description
 * @date 2020/1/6
 * 堆溢出
 * -Xms5M -Xmx5M -XX:+PrintGC 设置jvm启动参数
 * 出现OutofMemeryError 需要用Throwable来捕获
 * java.lang.OutOfMemoryError: Java heap space 一般是由于巨型对象的存在比如大数组String str[] = new String[100000000];
 * java.lang.OutOfMemoryError: GC overhead limit exceeded 由于GC
 */
public class HeapOOME {

    private static int i =0;

    private void add(int ii){
        i++;
        LinkedHashMap map = new LinkedHashMap();
        //map.put(i ,new Object());

    }

    public static void main(String[] args) {
        try {
            for (int i = 0; i < 100000000; i++) {
                LinkedHashMap map = new LinkedHashMap();
                map.put(i ,new Object());
            }

        } catch (Throwable e) {
            System.out.println(i);
            e.printStackTrace();
        }
    }
}

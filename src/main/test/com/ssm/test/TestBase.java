package com.ssm.test;

import org.junit.Test;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public final class TestBase {
    String a = "";
    int ii = 0;
    final int id = 1; // 基本类型，不可改变
    final Object obj = new Object(); // 则引用不可改变，但 obj里面的属性可以改变！
    public void i(){
        ii = 22;
        a.substring(1);
    }

    public static void main(String[] args) {
        String a = "123";
        System.out.println(a.substring(1));
        Map map = new HashMap<>();
        map.put("1", 11);
        map.put("2", 22);
        Iterator iterator = map.keySet().iterator();
        while (iterator.hasNext()) {
            Object key = iterator.next();
            Object value = map.get(key);
            System.out.println(value);

        }
        System.out.println("---------------");
        for (Object o : map.keySet()) {
            Object o1 = map.get(o);
            System.out.println(o1);
        }
        int aaa[] = new int[5];
        int aa[] = {};
        int aaaa[] = new int[]{23};

        int i = 11;
        System.out.println(i / 3);
        System.out.println(-8 >> 2);
        byte k = -2; //转为int,二进制码为：0000000000000000000000000000010
        System.out.println(k >> 2);// 右移2位，抛弃最后2位，负数补1,二进制吗为：11000000000000000000000000000
        System.out.println((-2 / 4));
        System.out.println();
        System.out.println(i>>=1);
        long start = System.currentTimeMillis();
        System.out.println("------------------");
        System.out.println(System.currentTimeMillis());
        ArrayList list = new ArrayList();
        for (int ii = 0;ii<100000;ii++){
            list.add(i);
        }
        if( i ==11 & i<=10){
            System.out.println("ttttt");
        }
        System.arraycopy(aa,2,aa,2,1);
        System.out.println(System.currentTimeMillis()-start);
        System.out.println("------------------");
    }

    @Test
    public void t1(){
        String a = "";
        String intern = a.intern();
    }


}

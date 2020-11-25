package com.ssm.test;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.junit.Test;

public class TestCollections {
    public static void main(String[] args) {
        List list = listTest();
        Iterator iterator = list.iterator();
        while (iterator.hasNext()){
            Map map = (Map) iterator.next();
            System.out.println(" --------- "+map);
        }
        for (int i = 0; i < list.size(); i++) {
            Map<Object,Object> map = (Map) list.get(i);
            for (Map.Entry<Object,Object> o : map.entrySet()) {

            }
            Object o = map.get(i+1);
            System.out.println(o);
        }
        System.out.println("size :"+list.size());
    }

    public static List listTest(){
        List<Map<Object,Object>> list = new ArrayList<>();

        Map map = new HashMap();
        for (int i = 0; i < 10; i++) {
            map.put(i+1,i+1);
            list.add(map);
        }
        return list;
    }

    @Test
    public void HashSet(){
        HashSet<String> a = new HashSet<String>();
        a.add(null);
        a.add(null);
        Integer i = new Integer(100);
        Integer ii = 100;
        String s  = "str";
        System.out.println( i == ii);
        System.out.println(s.hashCode()+"   "+i.hashCode()+"  "+ii.hashCode()+"  ");
        System.out.println(a.size());
        if(a.contains(null)){
            System.out.println("true");
        }
    }
}

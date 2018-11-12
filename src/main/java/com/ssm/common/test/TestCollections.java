package com.ssm.common.test;

import java.util.*;

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
}

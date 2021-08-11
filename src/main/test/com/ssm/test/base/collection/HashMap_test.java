package com.ssm.test.base.collection;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.apache.commons.collections.CollectionUtils;
import org.junit.Test;

/**
 * Java Map 按Key排序和按Value排序
 * https://www.cnblogs.com/zhujiabin/p/6164826.html
 * @author
 * @description
 * @date 2021/8/9
 */
public class HashMap_test {

    /**
     * hashmao无序的
     * 如何针对key排序
     */
    @Test
    public void testKeySort_001() {
        Map<String,String> map = new HashMap();
        map.put("b","2");
        map.put("c","3");
        map.put("a","1");
        map.put("A","f");
        for (Map.Entry<String, String> entry : map.entrySet()) {
            System.out.println(entry.getKey() + "----" +entry.getValue());
        }
        Map<String, String> sortMap = new TreeMap<String, String>(
            new MapKeyComparator());
        sortMap.putAll(map);



    }

    @Test
    public void testKeySort_002() {
        Map<String,String> sortedParam = new HashMap();
        Map<String,String> map = new HashMap();
        sortedParam.put("b","2");
        sortedParam.put("c","3");
        sortedParam.put("a","1");
        sortedParam.put("A","f");
        for (Map.Entry<String, String> entry : sortedParam.entrySet()) {
            System.out.println(entry.getKey() + "----" +entry.getValue());
        }
        List<String> keyList = new ArrayList<>(sortedParam.keySet());
        Collections.sort(keyList);
        for (String s : keyList) {
            String value  = sortedParam.get(s).toString();
            map.put(s,value);
        }
    }

    /**
     * 自定义的比较器
     */
    class MapKeyComparator implements Comparator<String> {

        @Override
        public int compare(String o1, String o2) {
            return o1.compareTo(o2);
        }
    }
}

package com.ssm.test;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

import org.junit.Test;

/**
 * 报错
 */
public class ArrayListTest {

    @Test
    public void testListRemove() {
        List<String> list = new ArrayList<>();
        list.add("1");
        list.add("2");
        list.add("3");
        List<String> list2 = new ArrayList<String>(){{
            add("1");add("22");
        }};


        //随机数代替 Math.random();
        ThreadLocalRandom current = ThreadLocalRandom.current();
        Math.random();
        for (String item : list) {
            if ("2".equals(item)) {
                list.remove(item);
            }
        }
        list.forEach(x->{
//            list.remove(x);
            System.out.println(x);
        });
    }
}

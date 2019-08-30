package com.ssm.test.base;

import java.io.FileNotFoundException;
import java.net.SocketException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * @author
 * @description
 * @date 2019/7/9
 */
public class TestInterface implements Cloneable{
    static {
        System.out.println("我是static代码块");
    }

    {

        System.out.println("构造代码块");
    }

    public TestInterface(){
        System.out.println("构造函数代码块");
    }
    private String a;
    private static int i;
    final int x = 1;
    // x = 2;  // cannot assign value to final variable 'x'


    public static void main(String[] args) {
        IllegalArgumentException e = new IllegalArgumentException();
        IndexOutOfBoundsException iob = new IndexOutOfBoundsException();
        NumberFormatException n;
        ArrayIndexOutOfBoundsException aif;
        FileNotFoundException ffe;
        SocketException soc;


        System.out.println();
        System.setProperty("a", "b");
        String property = System.getProperty("a");
        System.out.println("property"+property);
        //代码块 static代码块>main>构造代码块 （在类中没有加static的代码块），构造代码块的执行顺序优先于类构造函数>方法代码块
        TestInterface a = new TestInterface();

        List<String> list = new ArrayList<>();
        list.add("a");
        list.add("b");
        Iterator<String> iterator = list.iterator();
        while (iterator.hasNext()) {
            System.out.println(iterator.next());
        }
        list.stream().forEach(s -> {
            System.out.println(s);
        });

        Arrays.asList(1,2,3);
        int []i = {1,2,3};
        String s = Arrays.toString(i);
        List<String> strings = Arrays.asList(s);
        System.out.println(s);
        strings.stream().forEach(s2-> System.out.println(s2));

        //--------------------------------------------------
        Map<String,String> map = new HashMap();
        Iterator<Map.Entry<String, String>> entrySetIt = map.entrySet().iterator();
        Iterator<String> keySetIt = map.keySet().iterator();

        while (entrySetIt.hasNext()){
            Map.Entry<String, String> next = entrySetIt.next();
            next.getKey();
            next.getValue();
        }
        for (Map.Entry<String, String> entry : map.entrySet()) {
            System.out.println(entry.getValue());
        }

        map.forEach((k,v)-> System.out.println(k));

    }
   /* @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if(obj == null || getClass() != obj.getClass()) return false;
        TestInterface fa = (TestInterface)obj;
        if(fa.a == fa.a){return true;}
        return super.equals(obj);
    }*/

    @Override
    public int hashCode() {
        return a.hashCode()+1;
    }
}

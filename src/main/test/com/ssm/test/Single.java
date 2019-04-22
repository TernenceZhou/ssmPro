package com.ssm.test;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class Single {
    //饿汉 天生线程安全
    /*private static Single sin = new Single();
    private Single(){}
    public static Single getSingle(){
        return sin;
    }*/

    //懒汉
    /*private static Single sin;
    private Single(){}
    public static Single getSingle(){
        if(sin == null) {
            sin = new Single();
        }
        return sin;
    }*/
    private volatile static Single sin ;
    private Single(){}
    public static Single getSingle(){
        if (sin == null){
            synchronized (Single.class){
                if(sin == null){
                    sin = new Single();
                }
            }
        }
        return sin;
    }

    public static void main(String[] args) {
        List<Integer> li = new ArrayList<>();
        li.add(1);
        li.add(2);
        li.add(2);
        li.add(3);
      /*  for (Integer o : li) {
            if(o == 2){
                li.remove(o);
            }
//            System.out.println(o+"[====]"+li.size());
        }
        for (int i = 0; i < li.size(); i++) {
            System.out.println(li.get(i)+"[====]"+li.size());
        }*/

        Iterator<Integer> it = li.iterator();
        while (it.hasNext()){
            Integer next = it.next();
            System.out.println(next);
            if(next == 2){
                it.remove();
            }
        }
        for (int i = 0; i < li.size(); i++) {
            System.out.println(li.get(i)+"[====]"+li.size());
        }
    }
}

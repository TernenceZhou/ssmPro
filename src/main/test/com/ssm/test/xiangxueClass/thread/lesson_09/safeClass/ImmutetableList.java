package com.ssm.test.xiangxueClass.thread.lesson_09.safeClass;

import java.util.ArrayList;
import java.util.List;

public class ImmutetableList {

    //要么使用线程安全的list
    //要么类 发布出去时候 是一个副本 ，深拷贝
    private List<Integer> list = new ArrayList();

    public ImmutetableList(){
        list.add(1);
        list.add(2);
        list.add(3);
    }


    public boolean isContains(int i){
        return list.contains(i);
    }

    /**
     *提供了以下方法 后 当前类就不是安全的 因为外部可以改变list值
     * 所以不是一个线程安全的类
     */
    public List getList() {
        return list;
    }

    //也是安全的,加了锁--------------------------------
    public synchronized Integer getIndexVal(int i){
        return list.get(i);
    }
    public synchronized Integer set(int i,int value){
        return list.set(i,value);
    }
    //加了锁--------------------------------

    public static void main(String[] args) {
        ImmutetableList list = new ImmutetableList();
        List list1 = list.getList();
        list1.add(4);
    }
}

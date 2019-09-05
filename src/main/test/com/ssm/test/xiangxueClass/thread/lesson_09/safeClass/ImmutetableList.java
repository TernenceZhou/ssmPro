package com.ssm.test.xiangxueClass.thread.lesson_09.safeClass;

import java.util.ArrayList;
import java.util.List;

/**
 *   不可变的类 类和变量设置为final,类中不提供set方法、
 *   返回结果使用深拷贝，或者返回副本，比如String返回对应的对象copy，不是对象的直接引用
 *  优点：安全、效率
 *  不可变类天生线程安全，所以不用使用 synchronized关键字修饰
 *
 */
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

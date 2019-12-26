package com.ssm.test.base.javaReference;

import org.apache.ibatis.session.Configuration;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.lang.ref.SoftReference;
import java.lang.ref.WeakReference;

/**
 * @author
 * @description
 * java的四种引用类型
 * @date 2019/12/11
 */
public class JavaReferenceClass {
    public static void main(String[] args) {
        weak();
//        soft();
    }

    /**
     * 强引用
     * java GC不会主动进行回收
     * (最常见的引用,如果一个对象具有强引用, VM宁愿抛出 OutOfMemoryError 都不会回收它)
     */
    public static void strong(){
        System.out.println("MAX Mem\t:" + (Runtime.getRuntime().maxMemory()/1024/1024));
        System.out.println("FREE Mem\t:" + (Runtime.getRuntime().freeMemory()/1024/1024));
        String[] strs = new String[9999999]; //存放String数组对象的强引用
        System.out.println("=======================");
        System.out.println("FREE Mem\t:" + (Runtime.getRuntime().freeMemory()/1024/1024));
        String[] strs1 = new String[9999999]; //存放String数组对象的强引用
    }



    /**
     * 软引用
     * (不保证对象一定会被回收:不管是否显式gc,内存不足时才会回收)
     */
    public static void soft(){
        System.out.println("MAX Mem\t:" + (Runtime.getRuntime().maxMemory()/1024/1024));
        System.out.println("FREE Mem\t:" + (Runtime.getRuntime().freeMemory()/1024/1024));
        String[] strs = new String[9999999]; //存放String对象的强引用
        System.out.println("=======================");
        System.out.println("FREE Mem\t:" + (Runtime.getRuntime().freeMemory()/1024/1024));
        SoftReference<String[]> sr = new SoftReference<String[]>(strs);//一个软引用指向strs
        strs = null;//释放strs的强引用
        System.out.println("释放strs的强引用后：\t "+sr.get());//回收以后通过软引用访问strs(没有被回收)
        System.gc();
        System.out.println("GC后: \t"+ sr.get());//回收以后通过软引用访问strs(没有被回收)
        System.out.println("=======================");
        String[] strs1 = new String[9999999]; //存放String对象的强引用
        System.out.println(sr.get());//回收以后通过软引用访问strs(已经被回收)
        System.out.println("FREE Mem\t:" + (Runtime.getRuntime().freeMemory()/1024/1024));
    }

    public static void weak(){
        System.out.println("MAX Mem\t:" + (Runtime.getRuntime().maxMemory()/1024/1024));
        System.out.println("FREE Mem\t:" + (Runtime.getRuntime().freeMemory()/1024/1024));
        String[] strs = new String[9999999]; //存放String对象的强引用
        System.out.println("=======================");
        System.out.println("FREE Mem\t:" + (Runtime.getRuntime().freeMemory()/1024/1024));
        WeakReference<String[]> sr = new WeakReference<String[]>(strs);//一个弱引用指向strs
        strs = null;//释放strs的强引用
        System.out.println("GC前: \t" + sr.get());//回收以后通过弱引用访问strs(GC前没有被回收)
        System.out.println("FREE Mem\t:" + (Runtime.getRuntime().freeMemory()/1024/1024));
        System.gc();
        System.out.println("GC后: \t" + sr.get());//回收以后通过弱引用访问strs(GC后已经被回收)
        System.out.println("FREE Mem\t:" + (Runtime.getRuntime().freeMemory()/1024/1024));
        System.out.println("=======================");
        String[] strs1 = new String[9999999]; //存放String对象的强引用
        System.out.println("GC后: \t" + sr.get());//回收以后通过弱引用访问strs(GC后已经被回收)
        System.out.println("FREE Mem\t:" + (Runtime.getRuntime().freeMemory()/1024/1024));
    }

}

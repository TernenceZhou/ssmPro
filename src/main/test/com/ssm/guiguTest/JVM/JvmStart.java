package com.ssm.guiguTest.JVM;

import java.nio.ByteBuffer;

import org.junit.Test;

/**
 *
 *  查看进程
 *  jps -l
 *  查看某个进程的jvm参数
 *  jinfo -flags pid
 *
 * 查看某个进程的所有jvm参数
 * jinfo -flags pid
 *
 * 查看某个进程是否有某个参数
 *  jinfo -flag PrintGCDetails pid (jinfo -flag UseParallelGC 38964)
 *  结果：-XX:+UseParallelGC  +  表示开启
 *         -XX:-PrintGCDetails - 表示关闭
 *
 * XX参数分为 boolean  和 KV 类型
 * -XX:InitialHeapSize=266338304  等同于Xms
 * -XX:+PrintGCDetails
 *  -XX:SurrRatios 设置新生代大小4  如果是
 *  -XX:MaxTuredSize 设置多少岁进入老年代 只能是小于15
 *
 *  Eden：from:to  8:1:1
 *  直接内存大小
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * 查看GC详情
 * -XX:+PrintGCDetails
 * -XX:+PrintCommandLineFlags  查看程序使用的默认JVM参数
 * -XX:+PrintFlagsInitial 打印初始值，注意 = 和 :=  的区别
 * = 默认值  := 被修改过的值
 * -XX:+PrintFlagsFinal 打印最终值，如果某个默认值被新值覆盖，显示新值
 * java -jar -Xms10m -Xmx10m -Xss512
 * xml 等同于
 * -Xmn
 * -XX:newRatio 新生代老年代大小
 *
 */
public class JvmStart {

    public static void main(String[] args) throws InterruptedException {

        //byte[] bytes = new byte[50* 1024 * 1024];
        System.out.println("hello GC");
        //ByteBuffer.allocateDirect(60*1024*1024);
        Thread.sleep(Integer.MAX_VALUE);

    }

    @Test
    public void doescape() {

    }


    @Test
    public void GCDirectOOM() {
        //设置直接内存大小
        //Exception in thread "main" java.lang.OutOfMemoryError: Direct buffer memory 这种异常出现情况一般是在NIO

    }
    @Test
    public void ThreadSize() {
        //-XX:+PrintGCDetails -XX:MaxDirectMemorySize=5m
        //设置直接内存大小
        //Exception in thread "main" java.lang.OutOfMemoryError: Direct buffer memory 这种异常出现情况一般是在NIO

    }

}

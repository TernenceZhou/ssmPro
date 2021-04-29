package com.ssm.bibi;

import org.openjdk.jol.info.ClassLayout;

/**
 * @author
 * @description
 * @date 2021/4/21
 * Java 查看对象布局工具 - Java Object Layout
 */
public class JavaLockTest {

    public static void main(String[] args) {
        //查看java markword
        // markword 指针类型 klassponiter xxx.class  实例数据
        //看到  object header 在加上sync后改变  说明加锁是在对象的对象头加上锁标识
        Object o = new Object();
        System.out.println(ClassLayout.parseInstance(o).toPrintable());
        synchronized (o) {
            System.out.println(ClassLayout.parseInstance(o).toPrintable());
        }
        System.out.println(ClassLayout.parseInstance(o).toPrintable());
        System.out.println(Runtime.getRuntime().availableProcessors());
    }

}

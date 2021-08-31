package com.ssm.guiguTest;

import java.util.concurrent.atomic.AtomicInteger;

import org.junit.Test;
import org.springframework.aop.framework.AopContext;
import org.springframework.context.annotation.Scope;

import com.ssm.xiangxueClass.spring.lesson14_mvc.service.UserService;

/**
 * @author
 * @description
 * @date 2020/11/23
 */
@Scope(value = "prototype")
public class VolatileTest {

    public static void main(String[] args) {
        //testkejianxing(); //查看可见性
        atimicVolaite();    //查看volatile 原子性
    }

    private static void atimicVolaite() {

        //不保证原子性， volatile修饰的变量 在以下多线程执行结果总是小于20000
        final AddClass addClass = new AddClass();
        for (int i = 1; i <= 20; i++) {
            new Thread(() -> {
                for (int j = 1; j <= 1000; j++) {
                    addClass.addNum();
                    //addClass.atomicNum();
                }
            }, String.valueOf(i)).start();
        }

        //        try {
        //            TimeUnit.SECONDS.sleep(3);
        //        } catch (Exception e) {
        //            e.printStackTrace();
        //        }

        while (Thread.activeCount() > 2) {// 表示除了主线程之外 有其他线程在处理时继续等待
            Thread.yield();
        }
        //结果始终小于20000
        System.out.println("当前线程名称：" + Thread.currentThread().getName() + "结果：" + addClass.num);
        //原子类操作 始终等于20000
        System.out.println("当前线程名称：" + Thread.currentThread().getName() + "结果：" + addClass.atomicInteger);

    }

    private static void testkejianxing() {
        final AddClass addClass = new AddClass();
        int num = addClass.num;
        new Thread(() -> {
            addClass.add60();
            System.out.println(Thread.currentThread().getName() + ":" + addClass.num);
        }, "AAA").start();

        while (addClass.num == 0) {
            //System.out.println("---");
        }
        System.out.println(Thread.currentThread().getName() + ":" + addClass.num);
    }

    @Test
    public void stringValue() {
        String b = new StringBuilder("ja").append("va").toString();
        System.out.println(b.intern() == b);

    }

    static class AddClass {

        volatile int num = 0;

        public void add60() {
            this.num = 60;
        }

        public void addNum() {
            num++;
        }

        final AtomicInteger atomicInteger = new AtomicInteger();

        public void atomicNum() {

            atomicInteger.getAndIncrement(); //类比i++
        }

    }
}



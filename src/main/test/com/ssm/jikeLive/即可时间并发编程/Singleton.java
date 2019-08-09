package com.ssm.jikeLive.即可时间并发编程;

import com.ssm.test.Single;

/**
 * @author
 * @description
 *  单例模式：通过双重排空的锁也不是最安全的。并发情况下的指令重排导致空指针异常
 *  过程：当有A B两个线程同时访问时
 *  1、分配一块内存空间M
 *  2、在内存M上初始化Single对象
 *  3、把M的地址值分配给singele变量
 *  如果顺序为1 3 2，A线程访问时single对象已经被赋值，然后b线程过来时看到single有值 ，直接返回的是一个空对象导致后续的空异常
 *  这就是所谓的指令冲重排 线程切换原子性问题。所以java中的voliate关键字就可以禁止指令重排
 * @date 2019/7/29
 */
public class Singleton {

    static Singleton singleton;
    private Singleton(){}

    public Singleton getInstance(){
        if(singleton == null){
            synchronized (Singleton.class){
                if(singleton == null){
                    singleton = new Singleton();
                }
            }
        }
        return singleton;
    }

    /*private static class MySingletonHandler{
        private  static Singleton singleton = new Singleton();
    }

    public static Singleton getMyInstance(){
        return MySingletonHandler.singleton;
    }*/
}

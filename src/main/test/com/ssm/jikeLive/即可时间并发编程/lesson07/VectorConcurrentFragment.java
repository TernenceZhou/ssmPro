package com.ssm.jikeLive.即可时间并发编程.lesson07;

import java.util.Vector;

/**
 * @author
 * @description
 *
 * @date 2019/8/14
 */
public class VectorConcurrentFragment {


    /**
     * 这段代码会有并发问题吗？
     * 答案是：有
     * 因为contains和add方法是不同的操作
     *  contails没有用sync修饰，当两个线程同时判断后 会出现重复添加 的过程
     *  解决办法：加上对vector对象加上synchonized
     *
     *  Vector实现线程安全是通过给主要的写方法加了synchronized，类似contains这样的读方法并没有synchronized，该题的问题就出在不是线程安全的contains方法，
     *  两个线程如果同时执行到if(!v.contains(o)) 是可以都通过的，这时就会执行两次add方法，重复添加。也就是老师说的竞态条件。
     * @param vector
     * @param obj
     */
    public  static Vector vect(Vector vector,Object obj){
        if(!vector.contains(obj)){
            vector.add(obj);
        }
        return vector;
    }

    public static void main(String[] args) throws InterruptedException {
        Vector vector = new Vector();
        Object object = new Object();
        Thread t1 = new Thread(() -> {
            vect(vector, object);
        });
        Thread t2 = new Thread(() -> {
            vect(vector, object);
        });
        t1.start();
        t2.start();
        t1.join();
        t2.join();
        int size = vector.size();
        System.out.println(size);
    }

}

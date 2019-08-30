package com.ssm.test.base;

import java.util.concurrent.atomic.AtomicInteger;

/**
 * @author
 * @description
 * @date 2019/7/8
 */
public class Test {

    public static void main(String[] args) {
        int d1 = 1;
        int d2= 1;
        Integer t1 = new Integer(1);
        Integer t2 = new Integer(1);
        Integer a1 = Integer.valueOf(d1);
        Integer a2 = Integer.valueOf(d2);
        System.out.println(a1 == a2);

        //从缓存池中获取 多次调用使用过的是目标对象的引用
        //========================

        String s = "123";
        String intern = s.intern();
        String s5 = "bbb";
        String s6 = "bbb";
        System.out.println(s5 == s6);  // true

        short s1 = 1;
        s1 = (short)(s1 + 1);




        AtomicInteger ato = new AtomicInteger(1);
        Thread th = Thread.currentThread();
        while (true){
            ato.addAndGet(1);
            System.out.println("------"+ato.get());

            if(th.isInterrupted()){
                break;
            }
            try {
                Thread.sleep(100);
                th.interrupt();
            }catch (InterruptedException e){
                e.printStackTrace();
            }
        }
        System.out.println("########################"+ato.toString());
    }
}

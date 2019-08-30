package com.ssm.jikeLive.即可时间并发编程.lesson07;

import org.junit.Test;

/**
 * @author
 * @description
 * 竞态条件.
 * @date 2019/8/14
 */
public class CompetitiveCondition {
    private volatile  long count= 0;
    public synchronized long get(){
        return count;
    }
    public synchronized void set(long v){
//        count += v;
        count = v;
    }

    public synchronized void add(){
        int id = 0;
        while (count<10000){
            //set(get()+1);
            count += 1;
        }
    }

    @Test
    public void test(){

        /*for (int i = 0; i < 10; i++) {
            new Thread(()->{
                add();
            }).start();
        }*/
        new Thread(()->{
            add();
        }).start();
//        new Thread(()->{
//            add();
//        }).start();

        System.out.println(get());
    }
}

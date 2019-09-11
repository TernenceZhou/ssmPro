package com.ssm.jikeLive.即可时间并发编程.lesson05;

import java.util.ArrayList;
import java.util.List;

/**
 * @author
 * @description
 * 抢占且等待
 * 处理并发死锁情况 自旋的方式一次性申请所有资源
 * @date 2019/8/7
 */
public class Allocator {

    List list = new ArrayList();
    //要设置为单例
    private Allocator allocator;

    synchronized boolean apply(Object from,Object to){
        if ((list.contains(from) || list.contains(to))){
            return false;
        }else {
            list.add(from);
            list.add(to);
        }
            return true;
    }
    //归还资源
    synchronized void release(Object from,Object to){
            list.remove(from);
            list.remove(to);
    }

    class Account{
            private Integer balance;

            public void transfer(Account target,Integer amt){
                //一次性申请转出转入账户，直到成功
                while (!(allocator.apply(this,target))) {
                    System.out.println("申请资源中!");
                };
                try{
                    synchronized (this){
                        synchronized (target){
                            if(this.balance >amt){
                                this.balance -=amt;
                                target.balance += amt;
                            }
                        }
                    }
                }catch (Exception e){
                    e.printStackTrace();
                }finally {
                    allocator.release(this,target);
                }
            }
        }

        static class StaticAllocator{
            private static Allocator allocator = new Allocator();
        }
        public Allocator getInstance(){
            return StaticAllocator.allocator;
        }

}

package com.ssm.jikeLive.即可时间并发编程.lesson06;

import java.util.ArrayList;
import java.util.List;

/**
 * @author
 * @description
 * 用通知等待机制 优化 循环等待
 * @date 2019/8/7
 */
public class Allocator {

    List list = new ArrayList();

    synchronized void apply(Object from,Object to){
        while (!(list.contains(from) || list.contains(to))){
            try{
                //不满足的等待阻塞，其他满足条件的线程可以进来
                wait();
            }catch (Exception e){

            }
            list.add(from);
            list.add(to);

        }
    }
    //归还资源
    synchronized void release(Object from,Object to){
            list.remove(from);
            list.remove(to);
            //唤醒所有的线程，保险不至于出现等待队列没法被唤醒的情况
            notifyAll();
    }

    class Account{
        private Integer balance;
        private Allocator allocator;

        public void transfer(Account target,Integer amt){
            //一次性申请转出转入账户，直到成功
           /* while (!(allocator.apply(this,target))) {
                System.out.println("申请资源中!");
            };*/
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


}

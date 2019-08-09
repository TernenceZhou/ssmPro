package com.ssm.jikeLive.即可时间并发编程.lesson06;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;

/**
 * @author
 * @description
 * 并发转账的demo
 * @date 2019/8/8
 */
public class MyTransferLock {
    public static void main(String[] args) {
        Account src = new Account(10000);
        Account target = new Account(10000);
        CountDownLatch downLatch = new CountDownLatch(9999);
        for (int i = 0; i < 9999; i++) {
            System.out.println("执行过程："+i);
            new Thread(()->{
                src.transfer(target,1);
                downLatch.countDown();
            }).start();
        }
        try {
            downLatch.await();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("src="+src.getBalance() );
        System.out.println("target="+target.getBalance() );
    }

    static class AllocatorLok{
        //创建单例类
        private AllocatorLok(){};
        static class StaticAllocatorLok{
            private static AllocatorLok allocatorLok = new AllocatorLok();

        }
        public static AllocatorLok getInstance(){
            return StaticAllocatorLok.allocatorLok;
        }

        List balLok = new ArrayList();
        //申请资源
        synchronized void apply(Object from ,Object to){
            while (balLok.contains(from) || balLok.contains(to)){
                try {
                    wait();
                }catch (InterruptedException  e){
                    e.printStackTrace();
                }
            }
            balLok.add(from);
            balLok.add(to);
        }
        //归还资源
        synchronized void release(Object from,Object to){
            balLok.remove(from);
            balLok.remove(to);
            //唤醒所有的线程，保险不至于出现等待队列没法被唤醒的情况
            notifyAll();
        }

    }
    static class Account{

        private Integer balance;

        private void transfer(Account target,Integer amt){
            AllocatorLok.getInstance().apply(this,target);
            try {
                if(this.balance > amt){
                    this.balance -= amt;
                    target.balance += amt;
                    //target.setBalance(target.getBalance()+amt);

                }
                //因为用了apply申请可以不用synchronized
                /*synchronized (this){
                    synchronized (target){
                        if(this.balance > amt){
                            this.balance -= amt;
                            target.balance += amt;
                            //target.setBalance(target.getBalance()+amt);

                        }
                    }
                }*/
            }finally {
                AllocatorLok.getInstance().release(this,target);
            }
        }

        public Account(Integer balance) {
            this.balance = balance;
        }

        public Integer getBalance() {
            return balance;
        }

        public void setBalance(Integer balance) {
            this.balance = balance;
        }
    }

}

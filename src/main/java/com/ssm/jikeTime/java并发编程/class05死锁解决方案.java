package com.ssm.jikeTime.java并发编程;

import java.util.ArrayList;
import java.util.List;

/**
 *通过A---B 转账给B
 * B---A 转账给A
 * 并发死锁的场景解决方案
 * 会产生死锁的几个情景：
 * 1、互斥 共享资源X和共享资源Y只能被一个线程使用 （转账过程中 A一直被线程1占用 线程2无法使用 ）
 * 2、占用且等待：线程T1 取得共享资源X 等待共享资源Y 不释放共享资源X （T1占有A锁 等待B,没有释放A）
 * 3、不可抢占：其他线程不能强行抢占T1占有的资源
 * 4、循环等待 ：线程T1等待T2占有的资源  ，线程T2等待T1占有的资源 -----循环等待对方过程
 * 其中，互斥这个条件我们没有办法破坏，因为我们用锁为的就是互斥。不过其他三个条件都是有办法破坏掉的
 * a、对于“占用且等待”这个条件，我们可以一次性申请所有的资源，这样就不存在等待了。
 *  b、对于“不可抢占”这个条件，占用部分资源的线程进一步申请其他资源时，如果申请不到，可以主动释放它占有的资源，这样不可抢占这个条件就破坏掉了。
 * c、对于“循环等待”这个条件，可以靠按序申请资源来预防。所谓按序申请，是指资源是有线性顺序的，申请的时候可以先申请资源序号小的，再申请资源序号大的，这样线性化后自然就不存在循环了。
 */
public class class05死锁解决方案 {

    class Account{
        //1.占用并等待   一次性申请所有的资源  解决并发问题
        private int balance;
        private Allocator allocator;

        public void transfer(Account target ,int amt){
            try {
                while (!allocator.applyRes(this,target)){
                    ;
                    synchronized (this){
                        synchronized (target){
                            if(this.balance > amt){
                                this.balance -= amt;
                                target.balance += amt;
                            }
                        }
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                allocator.free(this,target);
            }

        }

        //3.循环等待解决并发问题
        private int balance2;
        private int id;
        public void tranfer2(Account target,int amt){
            Account left = this;
            Account right = target;
            if(this.id > target.id) {
                left = target;
                right = this;
            }

            synchronized (this){
                synchronized (target){
                    this.balance -= amt;
                    target.balance += amt;
                }
            }
        }

    }

    /**
     * 分配资源类。
     */
    class Allocator{

        //管理 资源的 集合
        List<Account> res = new ArrayList<>();
        /**
         * 同时申请资源
         * @param from
         * @param to
         * @return
         */
        public synchronized boolean applyRes(Account from,Account to){

            if(res.contains(from) || res.contains(to)){
                return false;
            }else {
                res.add(from);
                res.add(to);
            }
            return true;
        }

        /**
         * 释放资源
         */
        public synchronized void free(Account from,Account to){
            res.remove(from);
            res.remove(to);
        }

    }
}

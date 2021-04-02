package com.ssm.xiangxueClass.thread.lesson_09.transfer.service;

import com.ssm.xiangxueClass.thread.lesson_09.transfer.UserAccount;

/**
 * @author
 * @description
 * 转账安全 实现类 01
 * 通过一个id从小到大排序的方式来解决 循环等待 造成的死锁 问题
 * 这里的id我们用hash值来代替
 * @date 2019/9/10
 */
public class ITransferImpl_safe01 implements ITransfer{

    private final Object tryLock = new Object(); //冲突锁

    @Override
    public void transfer(UserAccount from, UserAccount target, long amt) throws InterruptedException {
        //返回hashcode值，然后大小排序来 进行加锁账户。达到一种先后顺序
        int hashFrom = System.identityHashCode(from);
        int hashTarget = System.identityHashCode(target);
//        先锁hash小的那个
        if(hashFrom > hashTarget){
            synchronized (target){

                System.out.println("thread name:"+Thread.currentThread().getName()+
                        "target account name"+target.getAccountName());
                Thread.sleep(100);
                synchronized (from){
                    System.out.println("thread name:"+Thread.currentThread().getName()+
                            "from account name"+from.getAccountName());
                    target.addMoney(amt);
                    from.flyMoney(amt);
                }
            }
        }else if(hashFrom < hashTarget){
            synchronized (from){
                System.out.println("thread name:"+Thread.currentThread().getName()+
                        "from account name"+from.getAccountName());
                Thread.sleep(100);
                synchronized (target){
                    System.out.println("thread name:"+Thread.currentThread().getName()+
                            "target  account name" + target.getAccountName());
                    target.addMoney(amt);
                    from.flyMoney(amt);
                }
            }
        }else {//如果hashcode值冲突的话 ，通过加lock方式来处理
            synchronized (tryLock){
                synchronized (from){
                    synchronized (target){
                        from.flyMoney(amt);
                        target.addMoney(amt);
                    }
                }
            }
        }



    }

    public static void main(String[] args) {
        //hashcode返回对象或者重写后的hashcode值
        //identityHashcode 不管对象重写与否hashcode方法，直接返回对象的hashcode值，返回对象在物理内存地址值
        String a = new String("hhh");
        String b = new String("hhh");

        System.out.println(System.identityHashCode(a));
        System.out.println(System.identityHashCode(b));
        System.out.println(a.hashCode());
        System.out.println(b.hashCode());

        UserAccount use = new UserAccount("a",123);
        UserAccount use2 = new UserAccount("a",123);

        System.out.println(System.identityHashCode(use));
        System.out.println(use.hashCode());
        System.out.println(System.identityHashCode(use2));
        System.out.println(use2.hashCode());
        /**
         * 结果分析：
         *
         * 1、str1和str2的hashCode是相同的，是因为String类重写了hashCode方法，它根据String的值来确定hashCode的值，所以只要值一样，hashCode就会一样。
         *
         * 2、str1和str2的identityHashCode不一样，虽然String重写了hashCode方法，identityHashCode永远返回根据对象物理内存地址产生的hash值，所以每个String对象的物理地址不一样，identityHashCode也会不一样。
         *
         * 3、User对象没重写hashCode方法，所以hashCode和 identityHashCode 返回的值一样。
         */

    }
}

package com.ssm.xiangxueClass.thread.lesson_09.transfer.service;

import com.ssm.xiangxueClass.thread.lesson_09.transfer.UserAccount;

/**
 * @author
 * @description
 *
 * 类说明：不安全的转账动作的实现
 * 会出现相互等待的过程 发生死锁
 *
 * @date 2019/9/10
 */
public class TransferImpl_Unsafe implements ITransfer{

    @Override
    public void transfer(UserAccount from, UserAccount target, long amt) {
        synchronized (from){//先锁转出
            System.out.println("thread name:"+Thread.currentThread().getName()+
                    " account name"+from.getAccountName());
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            synchronized (target){//先锁转入
                System.out.println("thread name:"+Thread.currentThread().getName()+
                        " account name"+from.getAccountName());
                target.addMoney(amt);
                from.flyMoney(amt);
            }
        }
    }
}

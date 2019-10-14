package com.ssm.xiangxueClass.thread.lesson_09.transfer.service;

import com.ssm.xiangxueClass.thread.lesson_09.transfer.UserAccount;

import java.util.Random;

/**
 * @author
 * @description
 * 转账安全 实现类 02
 * 通过外部的可重入锁lock来 保证线程安全的转账
 * 自旋来申请锁
 *
 *
 * @date 2019/9/10
 */
public class ITransferImpl_safe02 implements ITransfer{


    @Override
    public void transfer(UserAccount from, UserAccount target, long amt) throws InterruptedException {
        System.out.println(">>>>>>>>>>>>>>>>>>>>>"+Thread.currentThread().getName()+"<<<<<<<<<<<<<<<<<<<start transfer.......");
        Random r = new Random();
        while (true){

            if(from.getLock().tryLock()){
                try{
                    System.out.println(Thread.currentThread().getName()
                            +"from get "+from.getAccountName());
                    if(target.getLock().tryLock()){
                        try{
                            System.out.println(Thread.currentThread().getName()
                                    +"target get "+target.getAccountName());
                            from.flyMoney(amt);
                            target.addMoney(amt);
                            break;
                        }finally {
                            target.getLock().unlock();
                        }
                    }
                }finally {
                    from.getLock().unlock();
                }
            }
           Thread.sleep(r.nextInt(50));
        }
        System.out.println(">>>>>>>>>>>>>>>>>>>>>"+Thread.currentThread().getName()+"<<<<<<<<<<<<<<<<<<<end transfer.......");

    }
}

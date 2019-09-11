package com.ssm.test.xiangxueClass.thread.lesson_09.transfer;

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * @author
 * @description
 * @date 2019/9/9
 */
public class UserAccount {
    //账户名称
    private String accountName;
    //账户金额
    private long amt;

    private final Lock lock = new ReentrantLock();

    public Lock getLock() {
        return lock;
    }


    public UserAccount(String accountName, long amt) {
        this.accountName = accountName;
        this.amt = amt;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public long getAmt() {
        return amt;
    }

    public void setAmt(long amt) {
        this.amt = amt;
    }

    @Override
    public String toString() {
        return "UserAccount{" +
                "name='" + accountName + '\'' +
                ", money=" + amt +
                '}';
    }

    //转入资金
    public void addMoney(long amount){
        amt = amt + amount;
    }

    //转出资金
    public void flyMoney(long amount){
        if(this.amt > amount){
            amt = amt - amount;
        }
    }

}

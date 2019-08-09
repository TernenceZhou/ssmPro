package com.ssm.jikeLive.即可时间并发编程.lesson04;

/**
 * @author
 * @description
 * 不同的锁对受保护资源进行精细化管理
 * @date 2019/8/5
 */
public class Accout {

    //账户余额
    private Integer balance;
    private final Object balLock=new Object();
    private String password;
    private final Object passLock = new Object();

    /**
     * 取款
     */
    public void athrim(Integer amt){
        synchronized (balLock){
            if(balance >= amt){
                this.balance -= amt;
            }
        }
    }
    //查看余额
    public Integer getBalance(){
        synchronized (balLock){
            return this.balance;
        }
    }

    public void upPassword(String newPass){
        synchronized (passLock){
            if(!password.equals(newPass)){
                this.password = newPass;
            }
        }
    }
    //查看余额
    public String getPassword(){
        synchronized (passLock){
            return this.password;
        }
    }

    /**
     *  针对于一个锁多个资源时，比如A账户转账到B账户这个过程
     *  为了避免自家锁别人资源的问题，锁Account.class 这样每个Account持有同一个锁资源对象
     *  因为这个锁对象在JVM加载Account类时就创建了，保证了唯一性
     * @param target
     * @param amt
     */

    public void transfer(Accout target,Integer amt){
        synchronized (Accout.class){
            if(this.balance > amt){
                this.balance -=amt;
                target.balance += amt;
            }
        }
    }
}

package com.ssm.jikeLive.即可时间并发编程.lesson05;

/**
 * @author
 * @description
 * 循环等待
 *
 * 用id从小到大的 排序方式 处理 破坏死锁条件
 * @date 2019/8/8
 */
public class Account {

    Integer id;
    Integer balance;

    public void transfer(Account target,Integer amt){
        Account left = this;
        Account right =target;
        if(this.id > target.id){
            left = target;
            right = this;
        }
        // 锁定序号小的账户
        synchronized(left){
            // 锁定序号大的账户
            synchronized(right){
                if (this.balance > amt){
                    this.balance -= amt;
                    target.balance += amt;
                }
            }
        }


    }

}

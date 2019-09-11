package com.ssm.test.xiangxueClass.thread.lesson_09.transfer.service;

import com.ssm.test.xiangxueClass.thread.lesson_09.transfer.UserAccount;

/**
 * @author
 * @description
 * 轉賬接口
 * @date 2019/9/9
 */
public interface ITransfer {

    void transfer(UserAccount from,UserAccount to,long amt) throws InterruptedException;

}

package com.ssm.test.xiangxueClass.thread.lesson_10;

/**
 * @author
 * @description
 * 任务返回结果：只有成功 失败  异常
 * 方法本身运行是否正确的结果类型
 * @date 2019/9/11
 */
public enum  TaskResultType {
    //返回执行成功并且正确的结果
    SUCCESS,
    //抛出异常
    EXCEPTION,
    //返回执行成功，结果不正确
    FAITURE;

}

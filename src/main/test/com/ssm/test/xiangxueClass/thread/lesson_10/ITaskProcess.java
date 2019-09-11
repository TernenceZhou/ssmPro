package com.ssm.test.xiangxueClass.thread.lesson_10;

/**
 * @author
 * @description
 * 实现自定义框架任务接口
 * 由于任务接口只有在调用时才知道，所以类使用泛型修饰
 * @date 2019/9/11
 */
public interface ITaskProcess<R,T> {

    /**
     * 方法需要使用的业务数据
     * @param data
     * @return 返回执行后的结果
     */
    TaskResult<R> taskExecute(T data);
}

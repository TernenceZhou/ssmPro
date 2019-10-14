package com.ssm.xiangxueClass.thread.lesson_10;

/**
 * @author
 * @description
 * 任务返回结果实体类
 * @date 2019/9/11
 */
public class TaskResult<R> {

    //返回任务是否正确的结果
    private TaskResultType resultType;
    //方法业务结果数据
    private R returnValue;
    //失败原因
    private String reason;


    public TaskResult(TaskResultType resultType, R returnValue, String reason) {
        super();
        this.resultType = resultType;
        this.returnValue = returnValue;
        this.reason = reason;
    }

    //自定义一个方便使用的构造方法
    public TaskResult(TaskResultType resultType, R returnValue) {
        super();
        this.resultType = resultType;
        this.returnValue = returnValue;
        this.reason = "SUCCESS";
    }

    public TaskResultType getResultType() {
        return resultType;
    }

    public R getReturnValue() {
        return returnValue;
    }

    public String getReason() {
        return reason;
    }

    @Override
    public String toString() {
        return "[ resultType: "+getResultType()+" ]\n"+
                "[returenVal"+getReturnValue()+"]\n"+
                "[reason:"+getReason()+"]";
    }
}

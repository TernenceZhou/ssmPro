package com.ssm.xiangxueClass.thread.lesson_10;

import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * @author
 * @description
 * 提交给框架执行的实体类，本批次任务的task集合
 * @date 2019/9/11
 */
public class JobInfo<R> {

    //任务名称 （唯一区分）
    private String jobName;
    //工作任务个数
    private int jobLength;
    //成功任务计数
    private AtomicInteger successCount;
    //执行任务接口类
    private ITaskProcess<?,?> taskProcess;
    //执行的任务个数
    private AtomicInteger processCount;
    //任务保存 销毁的时间
    private long expireTime;
    //结果队列，从头部拿，尾部存放
    private LinkedBlockingDeque<TaskResult<R>> taskQueue;

    public JobInfo(String jobName, int jobLength, ITaskProcess<?, ?> taskProcess, long expireTime) {
        this.jobName = jobName;
        this.jobLength = jobLength;
        this.taskProcess = taskProcess;
        this.expireTime = expireTime;
        this.successCount = new AtomicInteger(0);
        this.processCount = new AtomicInteger(0);
        this.taskQueue = new LinkedBlockingDeque<TaskResult<R>>(jobLength);
    }

    //返回当前已处理的成功结果数
    public int getSuccessCount() {
        return successCount.get();
    }
    //返回当前已处理的成功结果数
    public int getFailtureCount() {
        return processCount.get() - successCount.get();
    }
    //返回当前已处理的结果数
    public int getProcessCount() {
        return processCount.get();
    }

    public ITaskProcess<?, ?> getTaskProcess() {
        return taskProcess;
    }
    //总共任务
    public String getTotalProcess() {
        return "Success["+successCount.get()+"]/Current["
                +processCount.get()+"] Total["+jobLength+"]";
    }

    //获得工作中每个任务的处理详情
    public List<TaskResult<R>> getTaskDetail(){
        List<TaskResult<R>> taskList = new LinkedList<>();
        TaskResult<R> taskResult;
        //从阻塞队列中拿取结果，直到队列为空.说明当前队列中的最新结果已经被拿取完
        while ((taskResult = taskQueue.pollFirst()) != null){
            taskList.add(taskResult);
        }
        return taskList;
    }
    //放任务的结果，最终保证一致性。所以不用加锁
    public void addTaskResult(TaskResult<R> taskResult,CheckJobProcesser checkJobProcesser) {

        if(TaskResultType.SUCCESS.equals(taskResult.getResultType())){
            //成功的记录
            successCount.incrementAndGet();
        }
        //新增总记录条数，队列尾部加上任务结果
        processCount.incrementAndGet();
        taskQueue.addLast(taskResult);
        //任务完成，需要移除队列
        if(processCount.get() == jobLength){
            checkJobProcesser.putJob(jobName,expireTime);
        }
    }

}

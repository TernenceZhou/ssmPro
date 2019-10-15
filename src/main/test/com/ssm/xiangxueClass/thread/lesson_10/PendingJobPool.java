package com.ssm.xiangxueClass.thread.lesson_10;

import org.apache.poi.ss.formula.functions.T;

import java.util.Map;
import java.util.concurrent.*;

/**
 * 框架的主题类
 */
public class PendingJobPool {

    //保守估计 定义线程数量 这儿我们定位CPU核心数
    private static final int THREAD_COUNTS = Runtime.getRuntime().availableProcessors();
    //存放任务的队列
    private static BlockingQueue<Runnable> blockingQueue = new ArrayBlockingQueue<>(500);

    //线程池
    private static ThreadPoolExecutor poolExecutor = new ThreadPoolExecutor(
            THREAD_COUNTS,
            THREAD_COUNTS,
            60,
             TimeUnit.SECONDS,
            blockingQueue);
    private static ConcurrentHashMap<String,JobInfo<?>> jobInfoMap
            = new ConcurrentHashMap();

    //获得CheckJobProcesser实例
    private static CheckJobProcesser checkJob
            = CheckJobProcesser.getInstance();

    // -----------单例模式------------
    private PendingJobPool(){}
    private static class PendingHolder{
        public static PendingJobPool jobPool = new PendingJobPool();
    }
    public  static PendingJobPool getInstance(){
        return PendingHolder.jobPool;
    }
    // -----------------------

    public static Map<String,JobInfo<?>> getMap() {
        return jobInfoMap;
    }

    //将工作任务进行封装，提交给线程池使用，并处理结果，放入缓存中使用
    private static class PendingTask<T,R> implements Runnable{

        private JobInfo<R> jobInfo;
        private T processData;

        public PendingTask(JobInfo<R> jobInfo, T processData) {
            this.jobInfo = jobInfo;
            this.processData = processData;
        }

        @Override
        public void run() {
            R r = null;
            ITaskProcess<T, R>  process = (ITaskProcess<T, R>) jobInfo.getTaskProcess();
            TaskResult<R> result = null;
            try{
               //调用业务人员实现的具体方法
                result = process.taskExecute(processData);
                //要做检查，防止开发人员处理不当
                if(result == null){
                    result = new TaskResult<R>(TaskResultType.EXCEPTION,r,
                            "result is null");
                }
                if(result.getResultType() ==null){
                    if(result.getReason() == null){
                        result = new TaskResult<R>(TaskResultType.EXCEPTION,r,
                                "result is null");
                    }else {
                        result = new TaskResult<R>(TaskResultType.EXCEPTION,r,
                                "result is null bug"+result.getReason());
                    }
                }
            }catch (Exception e){
                e.printStackTrace();
                result = new TaskResult<R>(TaskResultType.EXCEPTION,r,
                        e.getMessage());
            }finally {
                jobInfo.addTaskResult(result,checkJob);
            }
        }
    }

    /**
     * 通过jobName获取任务
     * @param jobName
     * @param <R>
     * @return
     */
    public <R> JobInfo<R> getJob(String jobName){
        JobInfo<R> jobInfo = (JobInfo<R>)jobInfoMap.get(jobName);
        if(jobInfo == null){
            throw new RuntimeException(jobName +"是否非法任务！");
        }
        return jobInfo;
    }

    public void putTask(String jobName,T t){
        JobInfo<Object> jobInfo = getJob(jobName);
        PendingTask task = new PendingTask(jobInfo,t);
        poolExecutor.execute(task);
    }

    //调用者注册工作，如工作名 任务的处理器等
    public <R> void registerJob(String jobName, int jobLength,
                          ITaskProcess<R,T> taskProcess, long expireTime){

        JobInfo jobInfo = new JobInfo(jobName,jobLength,taskProcess,expireTime);
        if(jobInfoMap.putIfAbsent(jobName,jobInfo) != null){//已经存在
            throw new RuntimeException(jobName+"已经注册了");
        }

    }
}

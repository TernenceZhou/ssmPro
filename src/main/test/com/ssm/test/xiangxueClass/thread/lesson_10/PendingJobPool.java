package com.ssm.test.xiangxueClass.thread.lesson_10;

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

    public <R> void regis(String jobName, int jobLength,
                          ITaskProcess<R,T> taskProcess, long expireTime){

        JobInfo jobInfo = new JobInfo(jobName,jobLength,taskProcess,expireTime);
    }
}

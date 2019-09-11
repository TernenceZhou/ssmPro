package com.ssm.test.xiangxueClass.thread.lesson_10;

import org.apache.poi.ss.formula.functions.T;

import java.util.concurrent.*;

/**
 * 框架的主题类
 */
public class PendingJobPool {

    //保守估计 定义线程数量 这儿我们定位CPU核心数
    final int THREAD_COUNTS = Runtime.getRuntime().availableProcessors();
    //存放任务的队列
    private BlockingQueue<Runnable> blockingQueue = new ArrayBlockingQueue<>(500);

    //线程池
    ThreadPoolExecutor poolExecutor = new ThreadPoolExecutor(THREAD_COUNTS,
            THREAD_COUNTS,
            60
            , TimeUnit.SECONDS,
            blockingQueue);
    private static ConcurrentHashMap jobMap = new ConcurrentHashMap();


    public <R> void regis(String jobName,int jobLength,
                          ITaskProcess<R,T> taskProcess,long expireTime){

        JobInfo jobInfo = new JobInfo(jobName,jobLength,taskProcess,expireTime);
    }
}

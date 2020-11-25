package com.ssm.test.xiangxueClass.thread.lesson_10;

import java.util.List;
import java.util.Random;

import com.ssm.xiangxueClass.thread.SleepTools;
import com.ssm.xiangxueClass.thread.lesson_10.PendingJobPool;
import com.ssm.xiangxueClass.thread.lesson_10.TaskResult;

/**
 * 模拟应用程序，模拟任务的启动提交 查看任务进度
 */
public class AppTest {

    private static String jobName = "你还是来了";
    private final static int JOB_LENGTH = 1000;

    private static class QueryResult implements Runnable{

        private PendingJobPool pool;

        public QueryResult(PendingJobPool pool) {
            this.pool = pool;
        }

        @Override
        public void run() {
            int i = 0;//查询次数
            while (i < 350){
                List<TaskResult<Object>> taskDetail = pool.getDetail(jobName);
                if(!taskDetail.isEmpty()){
                    System.out.println(pool.getProcess(jobName));//任务进度
                    System.out.println(taskDetail);
                }
                SleepTools.ms(100);
                i++;
            }
        }
    }

    public static void main(String[] args) {
        MyTask task = new MyTask();
        PendingJobPool pool = PendingJobPool.getInstance();
        pool.registerJob(jobName,JOB_LENGTH, task, 1000*5);
        Random random = new Random();
        for (int i = 0; i < JOB_LENGTH; i++) {
            //依次推入Task
            pool.putTask(jobName,random.nextInt(1000));
        }
        Thread t = new Thread(new QueryResult(pool));
        t.start();
    }
}

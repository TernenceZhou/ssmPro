package com.ssm.test.xiangxueClass.thread.leson_08;

import org.junit.Test;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

/**
 * @author
 * @description
 * @date 2019/8/27
 */
public class TestThreadPoolExecutor {

    @Test
    public void test(){
        ThreadPoolExecutor poolExecutor = new ThreadPoolExecutor(5,8,6,
                TimeUnit.SECONDS,new ArrayBlockingQueue<>(6));
        poolExecutor.execute(new WorkThread());
        poolExecutor.submit(new WorkThread());
        poolExecutor.shutdown(); //设置线程池的状态，中断 没有执行任务的线程
        poolExecutor.shutdownNow();// 中断所有执行或者没有执行的线程
    }


    static class WorkThread implements Runnable{

        private String name;

        @Override
        public void run() {

        }
    }
}

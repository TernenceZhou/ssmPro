package com.ssm.xiangxueClass.thread.leson_08;

import org.junit.Test;

import java.lang.reflect.ParameterizedType;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

/**
 * @author
 * @description
 * @date 2019/8/27
 */
public class TestThreadPoolExecutor<T> {

    @Test
    public void test(){
        ThreadPoolExecutor poolExecutor = new ThreadPoolExecutor(5,8,6,
                TimeUnit.SECONDS,new ArrayBlockingQueue<>(6));
        //new ThreadPoolTaskExecutor
        poolExecutor.execute(new WorkThread());
        poolExecutor.submit(new WorkThread());
        poolExecutor.shutdown(); //设置线程池的状态，中断 没有执行任务的线程
        poolExecutor.shutdownNow();// 中断所有执行或者没有执行的线程
    }
    /**
     * 结束
     */
    @Test
    public void doEnd() {
        System.out.println(getClass().getName());
        System.out.println("当前类名："+serviceName());
    }

    protected String serviceName(){
        return getClass().getSimpleName();
    }

    //获取
    protected String taskName(){
        ParameterizedType pt = (ParameterizedType) this.getClass().getGenericSuperclass();
        Class<T> clazz = (Class<T>) pt.getActualTypeArguments()[0];
        return clazz.getSimpleName();
    }


    static class WorkThread implements Runnable{

        private String name;

        @Override
        public void run() {

        }
    }
}

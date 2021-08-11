package com.ssm.xiangxueClass.thread.leson_08;

import java.lang.reflect.ParameterizedType;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.Future;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import org.junit.Test;

/**
 * @author
 * @description
 * @date 2019/8/27
 * submit和execute区别
 * execute是同步的，没有返回值
 * submit 是异步的,有返回值
 * 线程池简单使用:
 * https://blog.csdn.net/qq_22912803/article/details/80526002
 */
public class TestThreadPoolExecutor<T> {

    @Test
    public void test() {
        ThreadPoolExecutor poolExecutor = new ThreadPoolExecutor(5, 8, 6, TimeUnit.SECONDS, new ArrayBlockingQueue<>(6));
        //new ThreadPoolTaskExecutor
        WorkThread thread = new WorkThread();
        poolExecutor.execute(new WorkThread());
        poolExecutor.submit(new WorkThread());
        Future<?> submit = poolExecutor.submit(new WorkThread());
        poolExecutor.shutdown(); //设置线程池的状态，中断 没有执行任务的线程
        poolExecutor.shutdownNow();// 中断所有执行或者没有执行的线程
        //关闭线程原理
        //遍历线程池中的工作线程 去调用它的interrupt方法 内部打印了一个标识来

    }

    /**
     * 结束
     */
    @Test
    public void doEnd() {
        System.out.println(getClass().getName());
        System.out.println("当前类名：" + serviceName());
    }

    protected String serviceName() {
        return getClass().getSimpleName();
    }

    //获取
    protected String taskName() {
        ParameterizedType pt = (ParameterizedType) this.getClass().getGenericSuperclass();
        Class<T> clazz = (Class<T>) pt.getActualTypeArguments()[0];
        return clazz.getSimpleName();
    }

    static class WorkThread implements Runnable {

        private String name;

        @Override
        public void run() {

        }
    }

    public static void main(String[] args) {
        for (int i = 0; i < 10; i++) {
            new Thread(() -> {
                System.out.println("当前线程名称：" + Thread.currentThread().getName());
            }, "threadName").start();
        }

    }
}

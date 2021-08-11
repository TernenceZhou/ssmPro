package com.ssm.test.thread;/**
 * @author
 */

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.RejectedExecutionHandler;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

import org.junit.Test;

/**
 * @author http://ifeve.com/%e6%b7%b1%e5%ba%a6%e8%a7%a3%e6%9e%90java%e7%ba%bf%e7%a8%8b%e6%b1%a0%e7%9a%84%e5%bc%82%e5%b8%b8%e5%a4%84%e7%90%86%e6%9c%ba%e5%88%b6/
 * java 线程池的异常处理
 * 线程捕获异常方式
 * 1.直接try catch
 * 2.重写Thread UncaughtExceptionHandler
 */
public class ThreadCatchException {

    //直接 重写异常Handler
    @Test
    public void caugh() {

        Thread thread1 = new Thread();
        Thread.UncaughtExceptionHandler uncaughtExceptionHandler = thread1.getUncaughtExceptionHandler();
        thread1.setUncaughtExceptionHandler(new Thread.UncaughtExceptionHandler() {
            @Override
            public void uncaughtException(Thread t, Throwable e) {
                System.out.println("thread err " + t.getName());
            }
        });
    }

    @Test
    public void caugh2() {

        //BlockingQueue blockingQueue = new LinkedBlockingDeque(2);
        BlockingQueue blockingQueue = new ArrayBlockingQueue(3);

        //自定义拒绝策略
        UserRejectHandler userRejectHandler = new UserRejectHandler();
        //自定义工厂 可以定义线程名称
        UserThreadFactory threadFactory = new UserThreadFactory("工作 1");

        ThreadPoolExecutor poolExecutor = new ThreadPoolExecutor(2, 10, 20, TimeUnit.SECONDS, blockingQueue, threadFactory, userRejectHandler);

        //启动一个核心线程预创建
        poolExecutor.prestartCoreThread();
        //启动所有核心线程
        poolExecutor.prestartAllCoreThreads();

        Thread t = new Work();
        for (int i = 0; i < 400; i++) {
            poolExecutor.execute(t);
            poolExecutor.submit(t);
        }

    }

    static class UserThreadPoolExecutor extends ThreadPoolExecutor {

        public UserThreadPoolExecutor(int corePoolSize, int maximumPoolSize, long keepAliveTime, TimeUnit unit, BlockingQueue<Runnable> workQueue) {
            super(corePoolSize, maximumPoolSize, keepAliveTime, unit, workQueue);
        }

        @Override
        protected void beforeExecute(Thread t, Runnable r) {
            super.beforeExecute(t, r);
        }
    }

    /**
     * 自定义拒绝策略.
     */
    static class UserRejectHandler implements RejectedExecutionHandler {

        /**
         * 友好的拒绝策略有：
         * （1）保存到数据库进行削峰填谷。在空闲时再提取出来执行
         * （2）转向某个提示页面
         * （3）打印日志
         *
         * @param r
         * @param executor
         */
        @Override
        public void rejectedExecution(Runnable r, ThreadPoolExecutor executor) {
            System.out.println("task reject ." + executor.toString());
        }
    }

    /**
     * threadFactory自定义线程信息
     */
    static class UserThreadFactory implements ThreadFactory {

        private String namePrefix;
        private static final AtomicInteger nexId = new AtomicInteger(1);

        public UserThreadFactory(String threadName) {
            this.namePrefix = "UserThreadFactory's " + threadName + "-Worker-";
        }

        @Override
        public Thread newThread(Runnable r) {
            String name = this.namePrefix + nexId.getAndIncrement();
            Thread t = new Thread(null, r, name, 0);
            System.out.println(t.getName());
            return t;
        }
    }

    static class Work extends Thread {
        private final AtomicLong count = new AtomicLong(0L);

        @Override
        public void run() {

            System.out.println("running_" + count.getAndIncrement());
        }
    }

}

package com.ssm.test.xiangxueClass.thread.leson_08.completeService;

import org.omg.CORBA.INTERNAL;

import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

/**
 *
 */
public class CompletionCase {
    private final int POOL_SIZE = Runtime.getRuntime().availableProcessors();
    private final int TASK_SIZE = Runtime.getRuntime().availableProcessors();


    public void tryQueue() throws ExecutionException, InterruptedException {
        long start = System.currentTimeMillis();
        //统计所有任务休眠的总时长
        AtomicInteger count = new AtomicInteger(0);
        BlockingQueue<Future<Integer>> queue = new ArrayBlockingQueue<>(POOL_SIZE);
        ExecutorService pool = Executors.newFixedThreadPool(POOL_SIZE);


        //往队列中丢元素
        for (int i = 0; i < POOL_SIZE; i++) {
            Future<Integer> future = pool.submit(new WorkTask("sleep:  " + i));
            queue.add(future);
        }
        for (int i = 0; i < POOL_SIZE; i++) {
            //取出来任务
            Integer sleptTime = queue.take().get();
            System.out.println(" slept "+ sleptTime+" ms ...");
            count.addAndGet(sleptTime);
        }

        pool.shutdown();
        System.out.println("thread time:"+(System.currentTimeMillis() - start)+" ms");
    }

    public void tryQueue2() throws ExecutionException, InterruptedException {

        long start = System.currentTimeMillis();

        //统计所有任务休眠的总时长
        AtomicInteger count = new AtomicInteger(0);

        ExecutorService pool = Executors.newFixedThreadPool(POOL_SIZE);
        CompletionService<Integer> service = new ExecutorCompletionService(pool);


        //往队列中丢元素
        for (int i = 0; i < POOL_SIZE; i++) {
            service.submit(new WorkTask("sleep:  " + i));
        }
        for (int i = 0; i < POOL_SIZE; i++) {
            //取出来任务
            Integer sleptTime = service.take().get();
            System.out.println(" slept "+ sleptTime+" ms ...");
            count.addAndGet(sleptTime);
        }

        pool.shutdown();
        System.out.println("thread time:"+(System.currentTimeMillis() - start)+" ms");
    }


    public static void main(String[] args) {
        CompletionCase completionCase = new CompletionCase();
        try {
            completionCase.tryQueue();
            completionCase.tryQueue2();

        } catch (ExecutionException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

}

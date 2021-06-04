package com.ssm.guiguTest.ThreadPoolTest;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.stream.IntStream;

/**
 * @author
 * @description
 * @date 2021/6/4
 */

public class MyselfThreadPool {

    private BlockingQueue<Runnable> blockingQueue;
    public List<Thread> threads;

    public MyselfThreadPool(BlockingQueue<Runnable> blockingQueue, int threadSize) {
        threads = new ArrayList<>(threadSize);
        this.blockingQueue = blockingQueue;
        IntStream.rangeClosed(0, threadSize).forEach(x -> {
            MyThread thread = new MyThread("my thread pool " + x);
            thread.start();
            threads.add(thread);
        });
    }

    //往队列加任务
    public void execute(Runnable runnableTask) throws InterruptedException {
        blockingQueue.put(runnableTask);
    }

    class MyThread extends Thread {

        public MyThread(String name) {
            super(name);
        }

        @Override
        public void run() {
            while (true) {
                Runnable runnable = null;
                try {
                    runnable = blockingQueue.take();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }
}

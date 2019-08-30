package com.ssm.test.xiangxueClass.thread.leson_08;

import com.ssm.test.xiangxueClass.thread.SleepTools;
import org.junit.Test;

import java.util.Random;
import java.util.concurrent.*;

public class UseThreadPool {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        //最后一个参数是饱和策略 丢弃还是继续暂停
//        ThreadPoolExecutor threadPoolExecutor = new ThreadPoolExecutor(
//                5,6,1000, TimeUnit.SECONDS,
//                new ArrayBlockingQueue<Runnable>(10),
//                new ThreadPoolExecutor.AbortPolicy()
//        );

        //ExecutorService service = Executors.newCachedThreadPool();
        //ExecutorService service = Executors.newFixedThreadPool(4);
        //ExecutorService service = Executors.newSingleThreadExecutor();
        ExecutorService service = Executors.newScheduledThreadPool(3);
        ScheduledExecutorService scheduledExecutorService =
                Executors.newSingleThreadScheduledExecutor();

        for (int i = 0; i < 6; i++) {
            Worker worker = new Worker("work"+i);
            service.execute(worker);
        }

        for (int i = 0; i < 6; i++) {
            WorkerCall worker = new WorkerCall("workCall"+i);
            Future<String> submit = service.submit(worker);
            String s = submit.get();
            System.out.println(s);
        }

    }

    static class Worker implements Runnable{
        private String taskName;
        Random r  = new Random();

        public Worker(String taskName) {
            this.taskName = taskName;
        }

        @Override
        public void run(){
            System.out.println(Thread.currentThread().getName()
                    +" process the task : " + taskName);
            SleepTools.ms(r.nextInt(100)*5);
        }
    }
    static class WorkerCall implements Callable<String>{
        private String taskName;
        Random r  = new Random();

        public WorkerCall(String taskName) {
            this.taskName = taskName;
        }


        @Override
        public String call() {
            System.out.println(Thread.currentThread().getName()
                    + " process the task : " + taskName);
            SleepTools.ms(r.nextInt(100) * 5);
            return Thread.currentThread().getName()+":"+ r.nextInt(500)*5;
        }
     }



    @Test
    public void test(){
        Random r  = new Random();
        System.out.println(r.nextInt(500));
    }
}

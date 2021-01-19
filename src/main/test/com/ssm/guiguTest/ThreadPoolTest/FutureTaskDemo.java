package com.ssm.guiguTest.ThreadPoolTest;

import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.FutureTask;

import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 *
 */
public class FutureTaskDemo {

    public static void main(String[] args) throws ExecutionException, InterruptedException {
        //创建线程的第三种方式
        Thread t1 = new Thread();
        t1.start();

        FutureTask futureTask = new FutureTask(new MyThread());
        futureTask.run();

        String a = (String)futureTask.get();

        System.out.println(a);
        ClassPathXmlApplicationContext applicationContext = new ClassPathXmlApplicationContext();

    }


    static class MyThread implements Callable<String> {

        @Override
        public String call() throws Exception {
            return "1024";
        }

    }
}

package com.ssm.xiangxueClass.thread.callableDemo;

import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.FutureTask;

/**
 * @author
 * @description
 * @date 2019/12/26
 * 多线程模拟一个线程增加 一个线程减少
 */
public class ThreadIncAndDecCallAble {

    int j = 0;

    public static void main(String[] args) throws ExecutionException, InterruptedException {
        ThreadIncAndDecCallAble t = new ThreadIncAndDecCallAble();
        Inc inc = t.new Inc();
        Dec dec = t.new Dec();


        ExecutorService service = Executors.newCachedThreadPool();
        //使用Future+Callable
       /* Future<Integer> future = service.submit(inc);
        Integer integer = future.get();
        System.out.println("最终递增后的结果："+integer);
        Future<Integer> decFuture = service.submit(dec);
        Integer integer1 = decFuture.get();
        System.out.println("最终递减后的结果："+integer1);*/

        //使用FutureTask + Callable
        //FutureTask实现了RunnableFuture，然后RunnableFuture extends Runnable, Future<V>
        FutureTask taskInc = new FutureTask(inc);
        FutureTask taskDec = new FutureTask(dec);
        service.submit(taskInc);
        Object o = taskInc.get();
        System.out.println("最终递增后的结果：" + o );

        service.submit(taskDec);
        Object o2 = taskDec.get();
        System.out.println("最终递增后的结果："+ o2);

    }

    private synchronized Integer inc(){
        j++;
        System.out.println(Thread.currentThread().getName() +"inc：" + j);
        return j ;
    }

    private synchronized Integer dec(){
        j--;
        System.out.println(Thread.currentThread().getName()+"dec:" + j);
        return j ;
    }
    class Inc implements Callable<Integer> {
        Integer inc;
        @Override
        public Integer call() {
            for (int i = 0; i < 10; i++) {
                inc = inc();
            }
            return inc;
        }

    }

     class  Dec implements Callable<Integer>{
         Integer inc;
         @Override
         public Integer call() {
             for (int i = 0; i < 10; i++) {
                 inc = dec();
             }
             return inc;
         }
    }
}

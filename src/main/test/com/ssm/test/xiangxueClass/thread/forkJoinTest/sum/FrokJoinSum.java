package com.ssm.test.xiangxueClass.thread.forkJoinTest.sum;

import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.RecursiveTask;
import java.util.concurrent.TimeUnit;

/**
 * 通过forksJoin实现数组的求和
 * 有返回值的情况
 */
public class FrokJoinSum {

    public static class SumTask extends RecursiveTask<Integer>{
        private static int THRESHOLD = MakeArray.DEFAULT_INITIAL_CAPACITY/10;
        int fromIndex;
        int toIndex;
        int arr[];

        public SumTask(int fromIndex, int toIndex, int[] arr) {
            this.fromIndex = fromIndex;
            this.toIndex = toIndex;
            this.arr = arr;
        }

        @Override
        protected Integer compute() {
            if (fromIndex - toIndex < THRESHOLD){
                int count = 0;
                for (int i = fromIndex; i < THRESHOLD; i++) {
                    try {
                        TimeUnit.MILLISECONDS.sleep(1);
                    } catch (InterruptedException e) {
                    }
                    count = count + arr[i];
                }
                return count;
            }else {
                int mid = fromIndex + ((toIndex - fromIndex) >> 1);
                //分而治之
                SumTask left = new SumTask(fromIndex,mid,arr);
                SumTask right = new SumTask(mid+1,toIndex,arr);
                invokeAll(left,right);
                return left.join() + right.join(); //合并结果
            }
        }
    }

    public static void main(String[] args) {
        ForkJoinPool pool = new ForkJoinPool();
        int[] arr = MakeArray.makeArr();
        SumTask sumTask = new SumTask(0,arr.length- 1,arr);
        long start  = System.currentTimeMillis();
        pool.invoke(sumTask); //同步执行
//        pool.submit(sumTask);//异步执行
//        pool.execute(sumTask); //异步执行
        long end  = System.currentTimeMillis();

        System.out.println("sumTask is runing....");
        System.out.println("sum time:" + (end-start) + "ms ");


        //测试不用并行框架求数组之和
       /* int[] ints = MakeArray.makeArr();
        long start  = System.currentTimeMillis();

        int count = 0;
        for (int i = 0; i < ints.length; i++) {
            try {
                TimeUnit.MILLISECONDS.sleep(1);
            } catch (InterruptedException e) {
            }
            count = count + ints[i];
        }
        long end  = System.currentTimeMillis();
        System.out.println("sum time:" + (end-start) + "ms ");*/
    }
}

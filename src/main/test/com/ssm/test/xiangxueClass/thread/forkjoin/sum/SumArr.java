package com.ssm.test.xiangxueClass.thread.forkjoin.sum;

import com.ssm.test.xiangxueClass.thread.SleepTools;

import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.RecursiveTask;

public class SumArr {
     private static final int THROLD = MakeArr.DEFAULT_INITIAL_CAPACITY;
     public static class SumTask extends RecursiveTask<Integer> {
        private int fromIndex;
        private int toIndex;
        private int src[];
         public SumTask(int fromIndex, int toIndex, int src[]) {
             this.fromIndex = fromIndex;
             this.toIndex = toIndex;
             this.src = src;
         }

         @Override
        protected Integer compute() {
             if(toIndex-fromIndex < THROLD){
                 int count = 0;
                 //如果没有达到 400
                 for (int i = fromIndex; i <= toIndex; i++) {
                     SleepTools.ms(1);
                    count =count + src[i];
                 }
                 return count;
             }else {
                 int mid = fromIndex + (toIndex - fromIndex)/2 ;
                 SumTask left = new SumTask(fromIndex,mid,src);
                 SumTask right = new SumTask(mid+1,toIndex,src);
                 invokeAll(left,right);
                 return left.fromIndex + right.join();
             }
        }
    }

    public static void main(String[] args) {
        ForkJoinPool pool = new ForkJoinPool();
        int[] array = MakeArr.makeArray();
        SumTask sumTask = new SumTask(0,array.length-1,array);
        long start = System.currentTimeMillis();
        pool.invoke(sumTask);
        long end = System.currentTimeMillis();
        System.out.println("Task is Running.....");
        System.out.println("The count is "+sumTask.join()
                +" spend time:"+(end-start)+"ms");


    }
}

package com.ssm.test.xiangxueClass.thread.leson_08.mythreadPool;


import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

/**
 *
 * 自己实现线程池
 */
public class MythreadPool {

    //默认工作线程数
    private static int WORK_NUM = 5;
    //默认工作任务数
    private static int TASK_COUNT = 100;
    // 工作线程组
    private WorkThread[] workThreads;
    // 任务队列，作为一个缓冲
    private BlockingQueue<Runnable> taskQueue;
    private int worker_num; //用户在构造这个池，希望的启动的线程数

    // 创建具有默认线程个数的线程池
    public MythreadPool() {
        this(WORK_NUM,TASK_COUNT);
    }


    // 创建线程池,worker_num为线程池中工作线程的个数
    public MythreadPool(int workerNum,int taskCount) {
        if (workerNum<=0) workerNum = WORK_NUM;
        if(taskCount<=0) taskCount = TASK_COUNT;
        this.worker_num = workerNum;
        taskQueue = new ArrayBlockingQueue<>(taskCount);
        workThreads = new WorkThread[worker_num];
        for(int i=0;i<worker_num;i++) {
            workThreads[i] = new WorkThread();
            workThreads[i].start();
        }
        Runtime.getRuntime().availableProcessors();
    }

    /**
     * 执行任务 把任务加入到队列中去 ，什么时候执行由线程次池管理器来决定
     * @param runnable
     */
    public void executePool(Runnable runnable){
        try {
            taskQueue.put(runnable);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
    // 销毁线程池,该方法保证在所有任务都完成的情况下才销毁所有线程，否则等待任务完成才销毁
    public void destroy() {
        // 工作线程停止工作，且置为null
        System.out.println("ready close pool.....");
        for(int i=0;i<worker_num;i++) {
            workThreads[i].stopThread();
            workThreads[i] = null;//help gc
        }
        taskQueue.clear();// 清空任务队列
    }
    // 覆盖toString方法，返回线程池信息：工作线程个数和已完成任务个数
    @Override
    public String toString() {
        return "WorkTask number:" + worker_num
                + "  wait task number:" + taskQueue.size();
    }
    private class WorkThread extends Thread{
        @Override
        public void run() {
            Runnable r = null;
            try {
                while (!isInterrupted()){
                    r = taskQueue.take();
                    if(r != null){
                        System.out.println(getId()+" ready exec :"+r);
                        r.run();
                    }
                    r = null;//help gc;
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        public void  stopThread(){
            interrupt();
        }
    }

    public static void main(String[] args) {
        System.out.println(t());;
    }
    public static boolean t(){
        try{
            System.out.println("try ");
            return true;
        }catch (Exception e){

        }finally {
            System.out.println("finally");
            return false;
        }
    }



}

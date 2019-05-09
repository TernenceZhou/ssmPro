package com.ssm.test.xiangxueClass.thread.forkJoinTest;

import java.io.File;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.RecursiveAction;

/**
 * forkJoin求磁盘下的文件
 * 说明：遍历指定目录（含子目录）找寻指定类型文件
 * 无返回值
 * 和普通单线程遍历的两倍
 */
public class FindDirFile extends RecursiveAction {
    File path;

    public FindDirFile(File path) {
        this.path = path;
    }

    @Override
    protected void compute() {
        List<FindDirFile> subTask = new ArrayList<>();
        File[] files = path.listFiles();
        if(files != null){
            for(File file:files){
                if(file.isDirectory()){
                    subTask.add(new FindDirFile(file));
                }else {
                    //不是目录 检查格式
                    if(file.getAbsolutePath().endsWith("txt")){
                        System.out.println("文件："+file.getAbsolutePath());
                    }
                }
            }
            if(!subTask.isEmpty()){
                Collection<FindDirFile> findDirFiles = invokeAll(subTask);
                for(FindDirFile findDirFile:findDirFiles){
                    findDirFile.join(); //等待子任务完成
                }
            }
        }
    }

    public static void main(String[] args) {
        //用forkjoin进行实例调度总任务
        ForkJoinPool pool = new ForkJoinPool();
        FindDirFile dirTask = new FindDirFile(new File("C://"));
        long start  = System.currentTimeMillis();
        pool.execute(dirTask); //异步调用submit同理
        System.out.println("Task is Running. submit.....");
//        try {
//            Thread.sleep(1);
//        } catch (InterruptedException e) {
//            e.printStackTrace();
//        }
//        int otherWork = 0;
//        for (int i = 0; i < 100; i++) {
//            otherWork = otherWork + 1;
//        }
//        System.out.println("Main Thread done sth......,otherWork="+otherWork);
        dirTask.join();//阻塞的方法
        long end  = System.currentTimeMillis();
        System.out.println(end - start +"ms");
        System.out.println("Task end"); //43442ms 不用otherWork22356ms

    }

}

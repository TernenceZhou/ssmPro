package com.ssm.xiangxueClass.thread.forkJoinTest;

import org.junit.Test;

import java.io.File;
import java.util.stream.LongStream;

/**
 * forkJoin求磁盘下的文件
 * 说明：遍历指定目录（含子目录）找寻指定类型文件
 * 无返回值
 */
public class FindDirFile2{

    public static void main(String[] args) {

        File fileF = new File("C://");
        long start2  = System.currentTimeMillis();
//        try {
//            Thread.sleep(1);
//        } catch (InterruptedException e) {
//            e.printStackTrace();
//        }
        listFile(fileF);
        long end2  = System.currentTimeMillis();
        System.out.println(end2 - start2 +"ms"); //41764ms
    }

    public static void listFile(File dir){
        //获取指定目录下当前的所有文件或文件夹对像
        File[] files = dir.listFiles();
        if (files == null)
            return;
        for (File file : files){
            if(file.getAbsolutePath().endsWith("txt")){
                System.out.println("文件："+file.getAbsolutePath());
            }
            if (file.isDirectory()){
                listFile(file); //递归调用
            } else {
                if(file.getAbsolutePath().endsWith("txt")){
                    System.out.println("文件："+file.getAbsolutePath());
                }
            }
        }
    }

    @Test
    public void test3(){
        //Java 8 并行流的实现
        long l = System.currentTimeMillis();
        long reduce = LongStream.rangeClosed(0, 10000000000L).parallel().reduce(0, Long::sum);
        long l1 = System.currentTimeMillis();
        System.out.println("invoke = " + reduce+"  time: " + (l1-l));
        //invoke = -5340232216128654848  time: 15531
    }
}

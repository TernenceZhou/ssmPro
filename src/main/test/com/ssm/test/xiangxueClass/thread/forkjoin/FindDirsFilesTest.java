package com.ssm.test.xiangxueClass.thread.forkjoin;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.RecursiveAction;

/**
 *通过forkjoin并行框架二分查找内容
 *类说明：遍历指定目录（含子目录）找寻指定类型文件
 */
public class FindDirsFilesTest extends RecursiveAction{


    public FindDirsFilesTest(){

    }

    @Override
    protected void compute() {

    }
}

package com.ssm.xiangxueClass.thread;

import java.lang.management.ManagementFactory;
import java.lang.management.ThreadInfo;
import java.lang.management.ThreadMXBean;

/**
 *
 */
public class Demo01_thread01 {

    public static void main(String[] args) {
        /**
         * 查看在这个main方法中 会产生多少线程
         */
        ThreadMXBean threadMXBean = ManagementFactory.getThreadMXBean();
        ThreadInfo[] threadInfos = threadMXBean.dumpAllThreads(false
                , false);
        for (ThreadInfo threadInfo : threadInfos) { 
            System.out.println("["+threadInfo.getThreadId()+"]"+"-----"+threadInfo.getThreadName());
        }

    }
}

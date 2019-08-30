package com.ssm.test.xiangxueClass.thread.leson_08.schedulePoolExecutors;

import java.util.Random;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

public class ScheduleWork implements Runnable{

    private String workName;
    Random r = new Random();

    public ScheduleWork(String workName) {
        this.workName = workName;
    }

    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName()+"   这是ScheduleWork " + r.nextInt(500)*5);
    }

    public static void main(String[] args) {
         ScheduledThreadPoolExecutor schedule = new ScheduledThreadPoolExecutor(1);
         //任务间隔6秒
         schedule.scheduleAtFixedRate(new ScheduleWork("123"),
                 0, 2000, TimeUnit.MILLISECONDS);
    }
}

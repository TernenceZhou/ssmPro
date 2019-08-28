package com.ssm.test.xiangxueClass.thread.leson_08.schedulePoolExecutors;

import java.util.Random;

public class ScheduleWork implements Runnable{

    private String workName;
    Random r = new Random();

    public ScheduleWork(String workName) {
        this.workName = workName;
    }

    @Override
    public void run() {

    }
}

package com.ssm.test.xiangxueClass.thread.leson_08.completeService;

import java.util.Random;
import java.util.concurrent.Callable;

public class WorkTask implements Callable<Integer> {
    private String name;

    public WorkTask(String name) {
        this.name = name;
    }

    @Override
    public Integer call() {
       int  i = new Random().nextInt(2000);
        try {
            Thread.sleep(i);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return i;
    }
}

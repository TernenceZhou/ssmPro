package com.ssm.test.xiangxueClass.thread.lesson_10;


import com.ssm.xiangxueClass.thread.SleepTools;
import com.ssm.xiangxueClass.thread.lesson_10.ITaskProcess;
import com.ssm.xiangxueClass.thread.lesson_10.TaskResult;
import com.ssm.xiangxueClass.thread.lesson_10.TaskResultType;

import java.util.Random;

/**
 * 任务实现类
 */
public class MyTask implements ITaskProcess<Integer,Integer> {

    @Override
    public TaskResult<Integer> taskExecute(Integer data) {
        Random r = new Random();
        int nextInt = r.nextInt(500);
        SleepTools.ms(nextInt);
        if(nextInt <= 300){
            int returnValue = nextInt + data.intValue();
            return new TaskResult<Integer>(TaskResultType.SUCCESS,returnValue);
        }else if(nextInt >301 && nextInt <= 400 ){
            return new TaskResult<Integer>(TaskResultType.FAITURE,-1,"Failure");
        }else { // 发生异常的情况
            try {
                throw new RuntimeException("发生异常了");
            } catch (Exception e) {
                return new TaskResult<>(TaskResultType.FAITURE,-1,e.getMessage());
            } finally {
                System.out.println();
            }
        }
    }
}

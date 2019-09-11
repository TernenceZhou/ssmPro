package com.ssm.test.xiangxueClass.thread.lesson_10;

import com.ssm.test.xiangxueClass.thread.lesson07_ConcurrentHash.ConcurrentContainer.delayQueue.ItemVo;

import java.util.concurrent.DelayQueue;

/**
 * @author
 * @description
 * 定期检查任务，为了释放资源节约内存，定期移除任务
 * @date 2019/9/11
 */
public class CheckJobProcesser {


    private DelayQueue<ItemVo<String>> delayQueue = new DelayQueue<>();

    //放入队列，指定时间之后清除队列
    public void putJob(String jobName,long expireTime) {
        ItemVo<String> itemVo = new ItemVo(expireTime,jobName);
        delayQueue.offer(itemVo);
        System.out.println("Job["+jobName+"已经放入了过期检查缓存，过期时长："+expireTime);
    }

}

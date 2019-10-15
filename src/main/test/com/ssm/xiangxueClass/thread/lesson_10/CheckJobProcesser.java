package com.ssm.xiangxueClass.thread.lesson_10;

import com.ssm.xiangxueClass.thread.lesson07_ConcurrentHash.ConcurrentContainer.delayQueue.ItemVo;

import java.util.concurrent.DelayQueue;

/**
 * @author
 * @description
 * 定期检查任务，为了释放资源节约内存，定期移除任务
 * @date 2019/9/11
 */
public class CheckJobProcesser {

    private static DelayQueue<ItemVo<String>> delayQueue = new DelayQueue<>();

    // ---------------单例模式
    private CheckJobProcesser(){}

    private static class ProcesserHolder{
        public static CheckJobProcesser checkJobProcesser =
                new CheckJobProcesser();
    }

    public static CheckJobProcesser getInstance(){
        return ProcesserHolder.checkJobProcesser;
    }
    // ---------------

    //处理队列中到期任务的实行
    public static class FetchJob implements Runnable{
        @Override
        public void run() {
            while (true){
                try {
                    //拿到过期数据
                    ItemVo<String> item = delayQueue.take();
                    String jobName =  item.getDate();
                    PendingJobPool.getMap().remove(jobName);
                }catch (Exception e){

                }
            }
        }
    }

    //放入队列，指定时间之后清除队列
    public void putJob(String jobName,long expireTime) {
        ItemVo<String> itemVo = new ItemVo(expireTime,jobName);
        delayQueue.offer(itemVo);
        System.out.println("Job["+jobName+"已经放入了过期检查缓存，过期时长："+expireTime);
    }

    //初始化
    static {
        Thread thread = new Thread(new FetchJob());
        thread.setDaemon(true);
        thread.start();
        System.out.println("开启任务过期检查守护线程............");
    }
}

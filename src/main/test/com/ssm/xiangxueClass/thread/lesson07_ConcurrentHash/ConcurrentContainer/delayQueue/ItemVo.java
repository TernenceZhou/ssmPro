package com.ssm.xiangxueClass.thread.lesson07_ConcurrentHash.ConcurrentContainer.delayQueue;

import java.util.concurrent.Delayed;
import java.util.concurrent.TimeUnit;

/**
 * 延时订单
 * @param <T>
 */
public class ItemVo<T> implements Delayed {

    private long activeTime;
    private T date;

    public T getDate() {
        return date;
    }

    public ItemVo(long activeTime, T date) {
        this.activeTime = TimeUnit.MILLISECONDS.convert(activeTime,TimeUnit.MILLISECONDS)
        +System.nanoTime();
        this.date = date;
    }

    public static void main(String[] args) {
        System.out.println(System.nanoTime());
    }
    //返回元素的剩余时间
    @Override
    public long getDelay(TimeUnit unit) {

        long d = unit.convert(this.activeTime - (System.nanoTime()),TimeUnit.NANOSECONDS);
        return d;
    }
    //按照剩余时间排序
    @Override
    public int compareTo(Delayed o) {
        long d = getDelay(TimeUnit.NANOSECONDS) - o.getDelay(TimeUnit.NANOSECONDS);
        return (d == 0) ? 0: ((d > 0) ? 1 : -1);
    }
}

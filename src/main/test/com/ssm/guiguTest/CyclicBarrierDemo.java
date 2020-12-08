package com.ssm.guiguTest;

import java.util.concurrent.CyclicBarrier;

/**
 * @author
 * @description
 * @date 2020/12/8
 */
public class CyclicBarrierDemo {

    public static void main(String[] args) {
        CyclicBarrier barrier = new CyclicBarrier(7);
        new Thread(()-> {
            //barrier.await();
        });
    }
}

package com.ssm.msb.juc;/**
 * @author
 */

import java.util.concurrent.CyclicBarrier;

/**
 *@author
 *@description
 *@date 2021/7/5
 */
public class Cyclicbarrier_001 {

    public static void main(String[] args) {

        final CyclicBarrier barrier = new CyclicBarrier(7);
        try {
            barrier.await();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            barrier.reset();
        }



    }
}

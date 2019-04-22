package com.ssm.test;

import org.junit.Test;

import java.util.Date;
import java.util.Map;
import java.util.TreeMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;


public class Collection {

    @Test
    public void testTreeMap(){
        TreeMap<String,Object> tm = new TreeMap();
        tm.put("1","a");
        tm.put("2","b");
        tm.put("3","c");
        for (Map.Entry<String,Object> entiry : tm.entrySet()) {
            System.out.println(entiry.getValue());
        }
    }
    final static int MAX_QPS = 10;

    final static Semaphore semaphore = new Semaphore(MAX_QPS);

    public static void main (String ... args) throws Exception {

        Executors.newScheduledThreadPool(1).scheduleAtFixedRate(new Runnable() {

            @Override

            public void run() {

                semaphore.release(MAX_QPS/2);

            }

        }, 1000, 500, TimeUnit.MILLISECONDS);

        //lots of concurrent calls:100 * 1000
        ExecutorService pool = Executors.newFixedThreadPool(100);

        for (int i=100;i>0;i--) {

            final int x = i;

            pool.submit(new Runnable() {

                @Override

                public void run() {

                    for (int j=1000;j>0;j--) {

                        semaphore.acquireUninterruptibly(1);
                        remoteCall(x, j);

                    }

                }

            });

        }

        pool.shutdown();

        pool.awaitTermination(1, TimeUnit.HOURS);

        System.out.println("DONE");
    }

    private static void remoteCall(int i, int j) {
        System.out.println(String.format("%s - %s: %d %d",new Date(),
                Thread.currentThread(), i, j));
    }

}

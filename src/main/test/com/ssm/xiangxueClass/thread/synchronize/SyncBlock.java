package com.ssm.xiangxueClass.thread.synchronize;/**
 * @author
 */

/**
 * @author
 * @description
 * @date 2021/3/31
 */
public class SyncBlock {

    private Object o1 = new Object();

    public SyncBlock(Object o1) {
        this.o1 = o1;
    }

        public static void main(String[] args) {
            SyncBlock syncBlock = new SyncBlock("");
//            syncBlock.synObj();
            syncBlock.synShili();

        }

    //sync the code block
    private void synObj() {
        synchronized (o1) {
            System.out.println("this is sync o1");
        }
    }

    private synchronized void synShili() {
        System.out.println("this is sync shili fangfa");
    }

    private synchronized static void syncClass() {
        System.out.println("this is sync class");
        /**
         * synchronized (SyncBlock.class) {
         *             System.out.println("this is sync class");
         *         }
         */
    }

}

package com.ssm.xiangxueClass.thread.synchronize;

/**
 * @author
 * @description
 * @date 2021/3/31
 * sync(this|obj)都是针对的代码块 底层是现实moniter
 */
public class SyncBlock {

    private Object o1 = new Object();

    public SyncBlock(Object o1) {
        this.o1 = o1;
    }

        public static void main(String[] args) {
            Object o1 = new Object();
            SyncBlock syncBlock = new SyncBlock(o1);
//            syncBlock.synObj();
//            syncBlock.synShili();
            //syncBlock.synthis();
            syncBlock.synObj();

        }

    //sync the code block
    private void synObj() {
        synchronized (o1) {
            System.out.println("this is sync o1");
        }
    }

    private void synthis() {
        synchronized (this) {
            System.out.println("this is sync o1");
        }
    }

    private synchronized void synStatic() {
        synchronized (SyncBlock.class) {
            System.out.println("this is sync class");
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

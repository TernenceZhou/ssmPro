package com.ssm.xiangxueClass.thread.lesson_09.transfer;

import com.ssm.xiangxueClass.thread.lesson_09.transfer.service.ITransfer;
import com.ssm.xiangxueClass.thread.lesson_09.transfer.service.ITransferImpl_safe01;
import com.ssm.xiangxueClass.thread.lesson_09.transfer.service.ITransferImpl_safe02;

/**
 * @author
 * @description
 * @date 2019/9/10
 */
public class PayCompany {

    private static class TransferThread extends Thread{

        private String name;//账户名 线程名
        private long balance;
        private UserAccount from;
        private UserAccount to;
        private ITransfer transfer;


        public TransferThread(UserAccount from,UserAccount to,ITransfer transfer,String name
        ,long balance){
            this.balance = balance;
            this.from = from;
            this.to = to;
            this.name = name;
            this.transfer = transfer;
        }


        @Override
        public void run() {
            Thread.currentThread().setName(name);
            try {
                transfer.transfer(from,to,balance);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    public static void main(String[] args) {
        UserAccount from = new UserAccount("欧文",10000);
        UserAccount to = new UserAccount("老詹",12000);
        ITransfer safe02 = new ITransferImpl_safe02();
        ITransfer safe01 = new ITransferImpl_safe01();
        for (int i = 0; i < 10; i++) {
            TransferThread thread = new TransferThread(from, to, safe01, "欧文to老詹", 2000);
            TransferThread thread2 = new TransferThread(to, from, safe01, "老詹to欧文", 3000);
            thread.start();
            thread2.start();
            System.out.println();
        }

    }
}

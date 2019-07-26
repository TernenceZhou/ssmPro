package com.ssm.test.xiangxueClass.thread.volatileExam;

/**
 * @author
 * @description
 * @date 2019/6/17
 */
public class VolatileExample {
    int x = 0;
    boolean v = false;

    public void writer() {
        x = 42;
        v = true;
    }

    public  void reader() {
        if (v == true) {       // 这里 x 会是多少呢？
            System.out.println(x);
        }
    }

    public static void main(String[] args) {
        VolatileExample example = new VolatileExample();
        for (int i = 0; i < 100; i++) {
            new Thread(new Runnable() {
                @Override
                public void run() {
                example.writer();
                    try {
                        Thread.sleep(2000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    example.reader();
                }
            });
        }

    }
}

package com.ssm.xiangxueClass.thread;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * @author
 * @description
 * @date 2020/1/20
 */
public class ThreadLocalDemo {

    ThreadLocal<SimpleDateFormat> threadLocal = new InheritableThreadLocal<SimpleDateFormat>(){
        @Override
        protected SimpleDateFormat initialValue() {
            return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        }
    };

    public String formate(Date date){
        return threadLocal.get().format(date);
    }

    public static void main(String[] args) {
        ThreadLocalDemo demo =  new ThreadLocalDemo();
        Date date = new Date();
        System.out.println(date);
        String formate = demo.formate(date);
        System.out.println(formate);
    }


}

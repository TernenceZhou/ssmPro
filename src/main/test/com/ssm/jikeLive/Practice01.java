package com.ssm.jikeLive;


import org.junit.Test;

import java.util.HashSet;
import java.util.Set;

/**
 * @author
 * @description
 * @date 2019/7/26
 */
public class Practice01 {

    private int count = 0;
    public void add(){
        int idx = 0;
        while(count< 10000) {
            count+=1;
        }
    }

    @org.junit.Test
    public void prac(){
            final Test test = new Test();
            try {
                // 创建两个线程，执行 add() 操作
                Thread th1 = new Thread(()->{
                    test.add10K();
                });
                Thread th2 = new Thread(()->{
                    test.add10K();
                });
                // 启动两个线程
                th1.start();
                th2.start();
                // 等待两个线程执行结束
                th1.join();
                th2.join();
            }catch (Exception e){

            }

        System.out.println(test.count);
    }

    public static class Test {
        private static long count = 0;
        private void add10K() {
            int idx = 0;
            while(idx++ < 10000) {
                count += 1;
            }
        }
        public static long calc() {
            final Test test = new Test();
            try {
                // 创建两个线程，执行 add() 操作
                Thread th1 = new Thread(()->{
                    test.add10K();
                });
                System.out.println("");
                Thread th2 = new Thread(()->{
                    test.add10K();
                });
                // 启动两个线程
                th1.start();
                th2.start();
                // 等待两个线程执行结束
                th1.join();
                th2.join();
            }catch (Exception e){

            }

            return count;
        }
    }

    public static void main(String[] args) {
        Test test = new Test();
        long calc = test.calc();
        System.out.println(calc);
    }

    @org.junit.Test
    public void test(){
        int i;
        Integer a1 = Integer.valueOf(1);
        Integer a2 = Integer.valueOf(1);

        System.out.println(a1.equals(a2));
        int count =strLength("aabbcc");
        System.out.println(count);
    }

    public int strLength(String s){
        int length = s.length();
        Set<Character> set = new HashSet<>();
        int count = 0; int i = 0; int j = 0;
        while (i < length && j <length){
            if(!set.contains(s.charAt(j))){
                set.add(s.charAt(j++));
                count = Math.max(count,j-i);
            }else {
                set.remove(s.charAt(i++));
            }
        }
        return count;
    }
}

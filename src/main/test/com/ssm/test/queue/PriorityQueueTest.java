package com.ssm.test.queue;

import java.util.PriorityQueue;

/**
 * @author
 * @description 优先级队列PriorityQueue 案例
 * @date 2019/6/6
 */
public class PriorityQueueTest {


    /*public static void main(String[] args) {
        PriorityQueue<Student2> priorityQueue = new PriorityQueue<>();
        Student2 A = new Student2(98,"A");
        Student2 B = new Student2(48,"B");
        Student2 C= new Student2(88,"C");
        Student2 D = new Student2(99,"D");
        priorityQueue.add(A);
        priorityQueue.offer(B);
        priorityQueue.offer(C);
        priorityQueue.offer(D);
        for (Student2 Student2 : priorityQueue) {
            System.out.println(Student2.toString());
        }
        System.out.println("优先级队列之后：");
        while (!priorityQueue.isEmpty()){
            Student2 poll = priorityQueue.poll();
            System.out.println(poll);
        }
    }*/
    public static void main(String[] args) {
        //student需要 implements Comparable
        PriorityQueue<Student> priorityQueue = new PriorityQueue<>();
        Student A = new Student(98,"A");
        Student B = new Student(48,"B");
        Student C= new Student(88,"C");
        Student D = new Student(99,"D");
        priorityQueue.add(A);
        priorityQueue.offer(B);
        priorityQueue.offer(C);
        priorityQueue.offer(D);
        for (Student Student2 : priorityQueue) {
            System.out.println(Student2.toString());
        }
        System.out.println("优先级队列之后：");
        while (!priorityQueue.isEmpty()){
            Student poll = priorityQueue.poll();
            System.out.println(poll);
        }
    }
}


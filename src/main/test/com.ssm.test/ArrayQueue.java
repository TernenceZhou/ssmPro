package com.ssm.test;

/**
 *
 * 队列
 */
public class ArrayQueue {
    private String items[];
    private int n = 0; // 数组大小
    private int head = 0; // 队头下标
    private int trail = 0; // 队尾下标
    public ArrayQueue(int capacity){
        items = new String[capacity];
        n = capacity;
    }
    // 入队
    public boolean inqueue(String item) {
        if(trail == n){ // trail == n 队列已满
            return false;
        }else {
            items[trail] = item;
            ++trail;
            return true;
        }
    }
    // 出队
    public boolean outqueue() {
        if(head == trail){
            return false;
        }else {
            String rest = items[head];
            ++head;
            return true;
        }
    }
}

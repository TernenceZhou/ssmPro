package com.ssm.test.stack;

/**
 * @author
 * @description 数组模拟入栈出栈
 * @date 2019/5/15
 */
public class JavaArrayStack {

    private int count;//栈的元素个数
    private int n; //栈的大小
    private String items[];

    public JavaArrayStack(int n) {
        this.n = n;
        this.items = new String[n];
        this.count = 0;
    }

    public boolean push(String data){
        // n == count 栈装满了 直接返回false
        if(n == count) return false;
        if(count < n){
            items[count] = data;
            ++count;
        }
        return true;
    }

    public String pop(){
        if(count == 0){return null;}
        String tmp = items[count-1];
        --count;
        return tmp;
    }

    public static void main(String[] args) {
        JavaArrayStack stack = new JavaArrayStack(5);
        stack.push("2");
        stack.push("3");
        System.out.println(stack.pop());
    }
}

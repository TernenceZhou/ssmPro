package com.ssm.test.stack;

import java.util.Stack;

/**
 * @author
 * @description
 * 设计一个支持 push，pop，top 操作，并能在常数时间内检索到最小元素的栈。
 * push(x) -- 将元素 x 推入栈中。
 * pop() -- 删除栈顶的元素。
 * top() -- 获取栈顶元素。
 * getMin() -- 检索栈中的最小元素。
 * @date 2019/5/16
 */
public class LeeCode155 {

    //使用long防止int溢出
    private Stack<Long> stack;
    private Long min;
    /** initialize your data structure here. */
    public LeeCode155() {
        stack = new Stack<Long>();
    }

    public void push(int x) {
        if(stack.isEmpty()){
            //首次push，min=x，所以x-min=0，所以首个元素一定是0
            min = (long)x;
            stack.push(0L);
        }else{
            stack.push((long)x-min);
            if(x<min)
                //如果新的值小于min，需要更新min值
                min = (long)x;
        }
    }

    public void pop() {
        if(stack.isEmpty())
            return;
        long v = stack.pop();
        if(v<0)
            //min(上一次的x)-lastMin=v(这一次的v)
            //推算上一个min值：lastMin = min-v;
            min = min-v;
    }

    public int top() {
        Long top = stack.peek();
        if(top<0)
            return Math.toIntExact(min);
        return Math.toIntExact(top+min);
    }

    public int getMin() {
        return  Math.toIntExact(min);
    }

    public static void main(String[] args) {
        LeeCode155 minStack = new LeeCode155();
        minStack.push(-2);
        minStack.push(0);
        minStack.push(-3);
        int min = minStack.getMin();//--> 返回 -3.
        minStack.pop();
        int top = minStack.top();// --> 返回 0.
        int min2 =  minStack.getMin();   //--> 返回 -2.

        System.out.println("min:>>>>>>>>>"+min);
        System.out.println("top:>>>>>>>>>"+top);
        System.out.println("min2:>>>>>>>>>"+min2);

    }



}

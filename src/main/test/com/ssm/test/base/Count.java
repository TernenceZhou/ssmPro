package com.ssm.test.base;

import org.junit.Test;

/**
 * @author
 * @description
 * 面试题
 * @date 2019/8/15
 */
public class Count {
    private int count = 0;
    public int cal(int i){
        count += 1;
        return count;
    }

    public static void main(String[] args) {
        //每次都是一个新对象 所以都是1
        System.out.println(new Count().cal(1));
        System.out.println(new Count().cal(1));

        // ---------------------------分割线--------------------------
        //同一个对象调用 结果多次调用就是2
        Count c1 = new Count();
        System.out.println(c1.cal(1));
        System.out.println(c1.cal(1));

    }

    @Test
    public void a(){
        int arr[]= {1,2,3,4};
        int i =0;
        while (i<3){
            System.out.println(arr[++i]);
        }
        //i++ 先用i去计算 然后才加1
        while (i<3){
            System.out.println(arr[i++]);
        }
    }
}

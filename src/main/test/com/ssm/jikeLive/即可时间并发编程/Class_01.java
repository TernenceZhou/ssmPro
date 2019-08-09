package com.ssm.jikeLive.即可时间并发编程;

import org.junit.Test;

/**
 * @author
 * @description
 * @date 2019/7/26
 */
public class Class_01 {


    @Test
    public void calc(){

    }
    public void bouble(int arr[]){
     int tmp =0;
        for (int i = 0; i < arr.length; i++) {
            for (int j = 0; j < arr.length - i -1; j++) {
                if(arr[j] > arr[j+1]){
                    tmp = arr[j];
                    arr[j] = arr[j+1] ;
                    arr[j+1] = tmp;
                }
            }
        }
    }
}

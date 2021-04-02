package com.ssm.interview;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.junit.Test;

/**
 * @author
 * @description
 * @date 2021/3/24
 */
public class practice01 {

    public static void main(String[] args) {
        int arr2[] = {5,2,8,3};
        int arr[] = {5,1,2,3};
        for (int i = 1; i < arr.length; i++) {
            boolean flag = true;
            for (int j = 0; j < arr.length -i; j++) {
                if (arr[j] > arr[j+1]) {
                    System.out.println("flag" + flag);
                    int tmp = arr[j];
                    arr[j] = arr[j+1];
                    arr[j+1] = tmp;
                    flag = false;
                }
            }
            if (flag) {
                //现在flag为true 说明没有进入到位置交换 后面也不需要循环了
                break;
            }
        }
        System.out.println(Arrays.toString(arr));
    }
    @Test
    public void erfen() {
        int arr[] = {1,2,3,4,5,6,7,8,9,10};
        Integer arr2[] = {1,2,3,4,5,6,7,8,9,10};
        List<Integer> integers = new ArrayList<>();
        for (int i = 0; i < arr2.length; i++) {
            Integer integer = arr2[i];
            integers.add(integer);
        }
        List<Integer> ints = Arrays.asList(arr2);

        ints.add(1);

        Object[] objects = ints.toArray();
        Object[] toArray = integers.toArray();

        System.out.println(objects.getClass() == Object[].class);
        System.out.println(toArray.getClass() == Object[].class);

    }

    public int execute(int arr[],int start,int end ,int value) {
        int low = 0;
        int high = arr.length - 1;
        while (low <= high) {
            int mid = (start + end )/2;
            if (arr[mid] == value) {
                return mid;
            } else if (arr[mid] > value) {
                execute(arr,start,mid-1,value);
            } else if (arr[mid] < value) {
                execute(arr,mid+1,end,value);
            }
        }
        return 0;
    }
}

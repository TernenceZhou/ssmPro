package com.ssm.test.paixu;

import org.springframework.beans.BeanUtils;

/**
 * 插入排序
 */
public class InsertionSort {


    public static void main(String[] args) {
        int arr[] = {8,1,2,6,3,7};
//        insertion(arr,arr.length);
        int[] ints = sort(arr,arr.length);
        for (int i = 0; i < ints.length; i++) {
            System.out.println(ints[i]);

        }
    }


    /**
     *
     * @param arr 排序数组
     * @param n  数组大小
     */
    public static void insertion(int arr[],int n){
        if(n <= 1){
            return;
        }
        for (int i = 1; i < n; i++) {
            int value = arr[i];
            int j = i - 1;
            for ( ; j >= 0; j--) {
                if(arr[j] >value ){
                    arr[j+1] = arr[j];//交换位置
                }else {
                    break;
                }
            }
            arr[j+1] = value; // 插入数据  小数据往前移动
        }
        for (int i = 0; i < arr.length; i++) {
            System.out.println(arr[i]+"     ");
        }
    }
    //lianxi 测试
    public static int[] sort(int arr[],int n){
        for (int i = 1; i < n; i++) {
            int j = i - 1;
            int value = arr[i];
            for (; j >= 0; --j) {
                if(arr[j] > value){//如果前一位大于当前比较元素
                    arr[j+1] = arr[j]; //数据移动（已排序大的往后挪）
                }else {
                    break;
                }
            }
            arr[j+1] = value; //插入到前面指定 位置
        }
        return arr;
    }


}

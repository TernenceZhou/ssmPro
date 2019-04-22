package com.ssm.test.paixu;

/**
 * 冒泡排序
 */
public class BubbleSort {

    public static void main(String[] args) {
        int arr[] = {1,8,2,6,3};
        sort(arr);
    }

    public static void sort(int arr[]){
        if(arr.length <1){return;}

        int tmp = 0;
        for (int i = 0; i < arr.length; i++) {
            boolean flag = false; //位置交换的标识
            for (int j = 0; j < arr.length - i - 1; j++) {
                if(arr[j] > arr[j+1]){
                    tmp = arr[j];
                    arr[j] =arr[j+1];
                    arr[j+1] = tmp;
                    flag = true; //需要交换位置
                }
            }
            if(!flag){
                break;
            }
        }

        for (int i = 0; i < arr.length; i++) {
            System.out.println(arr[i]);
        }
    }

    public static void sort2(int arr[]){
        int  len = arr.length;
        int tmp = 0;
        for (int i = 0; i < len; i++) {
            boolean flg  = false;
            for (int j = 0; j < len - i -1; j++) {
                if(arr[j] >arr[j+1]){//后一个大于前者
                    tmp = arr[j];
                    arr[j] = arr[j+1];
                    arr[j+1] = tmp;
                    flg = true;
                }
            }
            if(!flg){break;}
        }
    }
}

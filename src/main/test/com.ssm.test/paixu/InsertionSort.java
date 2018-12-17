package com.ssm.test.paixu;

/**
 * 插入排序
 */
public class InsertionSort {


    public static void main(String[] args) {
        int arr[] = {8,1,2,6,3,7};
        insertion(arr,arr.length);
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

    public synchronized void add(){

    }
}

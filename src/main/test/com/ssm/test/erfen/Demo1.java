package com.ssm.test.erfen;

public class Demo1 {

    public static void main(String[] args) {
        int arr[] = {1,2,3,4,5,6,7,8};
        int i = calcu(arr,arr.length,8);
        System.out.println(i);
    }
    /**
     *
     * @param arr
     * @param len
     * @param num
     * @return
     */
    public static int calcu(int arr[],int len,int value){
        int low = 0;
        int high = len - 1;
        while (low <= high){
            int mid = (low+high) /2 ;
            if(arr[mid] == value){
                return mid;
            }else if(value > arr[mid]){
                low = mid +1;
            }else {
                high = mid - 1;
            }
        }

        return -1;
    }
}

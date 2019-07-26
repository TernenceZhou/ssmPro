package com.ssm.test.erfen;

import org.junit.Test;

public class Demo1 {


    /**
     * 非递归二分法
     */
    @Test
    public void tsetErfen(){
        int arr[] = {1,2,3,4,5,6,7,8};
        int i = calcu(arr,arr.length,8);
        System.out.println(2 & 4);

        System.out.println((2^4));
        System.out.println(((2^4)>>1));
        int mid = (2&4)+((2^4)>>1);

        System.out.println(mid);
        System.out.println(i);
    }
    /**
     *
     * @param arr
     * @param len
     * @param value
     * @return
     */
    public static int calcu(int arr[],int len,int value){
        int low = 0;
        int high = len - 1;
        while (low <= high){
            int a = low + ((high-low)>> 1 );
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

    /**
     * 递归二分法
     */
    @Test
    public void diguiErfen(){
        int arr[] = {1,3,5,6,7,8};
        int i = binarySearch(arr, 0, arr.length - 1, 3);
        System.out.println(i);

    }

    public static int binarySearch(int arr[],int low,int high,int key){
        if(low>high){return -1;}
        int  mid= (low+high)/2;
        if(key==arr[mid]){
            return mid;
        }else if(key<arr[mid]){
            high=mid-1;
            return binarySearch(arr,low,high,key);
        }else{
            low=mid+1;
            return binarySearch(arr,low,high,key);
        }
    }
}

package com.ssm.test.paixu;

/**
 * @author
 * @description
 * @date 2021/8/19
 */
public class Test_BubbleSort {

    public static void main(String[] args) {
//        int arr[] = { 1, 5, 3, 2, 8 };
        int arr[] = { 1, 2, 3, 4, 5, 6 };
        int tmp = 0;
        int l = arr.length;
        for (int i = 0; i < l; i++) {
            boolean flg = false;
            for (int j = i + 1; j < l; j++) {
                if (arr[i] > arr[j]) {
                    tmp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = tmp;
                    flg = true;
                }
            }

            while (!flg) {
                break;
            }

        }

        for (int i = 0; i < arr.length; i++) {
            int i1 = arr[i];
            System.out.println(i1);
        }

    }

}

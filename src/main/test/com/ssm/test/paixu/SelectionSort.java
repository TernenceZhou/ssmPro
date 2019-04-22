package com.ssm.test.paixu;

/**
 * 选择排序
 */
public class SelectionSort {
    public static void main(String[] args) {
        int arr[] = {8, 1, 2, 6, 3, 7};
        int[] selectionSort = selectionSort(arr, arr.length);
        for (int i = 0; i < selectionSort.length; i++) {
            System.out.println(arr[i] + "    ----   ");
        }
    }

    // 选择排序，a表示数组，n表示数组大小
    public static int[] selectionSort(int[] a, int n) {
        if (n <= 1) return a;

        for (int i = 0; i < n - 1; ++i) {
            // 查找最小值
            int minIndex = i;
            for (int j = i + 1; j < n; ++j) {
                if (a[j] < a[minIndex]) {
                    minIndex = j;
                }
            }

            // 交换
            int tmp = a[i];
            a[i] = a[minIndex];
            a[minIndex] = tmp;
        }
        return a;
    }


}

package com.ssm.LeetCode_Practice;

import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

/**
 * @author
 * @description
 * 给定一个数组和一个目标和，从数组中找两个数字相加等于目标和，输出这两个数字的下标。
 * 给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那 两个 整数，并返回他们的数组下标。
 * 你可以假设每种输入只会对应一个答案。但是，你不能重复利用这个数组中同样的元素。
 * 来源：力扣（LeetCode）
 * 链接：https://leetcode-cn.com/problems/two-sum
 * @date 2019/7/25
 */
public class Num01 {

    @Test
    public void test(){
        int[] ints = cal(new int[]{3,1, 2, 5}, 3);
        System.out.println(ints[0]+"   "+ints[1]);
    }

    /**
     * 解法1
     * 时间复杂度 O（n²） 空间复杂度O（n）
     * @param arr
     * @param target
     * @return
     */
    public int[] cal(int arr[],int target){
        int length = arr.length;
        int index[] = new int[2];
        for (int i = 0; i < length; i++) {
            for (int j = (i+1); j < length; j++) {
                if(target == (arr[i]+arr[j])){
                    index[0] = i;
                    index[1] = j;
                }
            }
        }
        return index;
    }

    @Test
    public void test2(){
        int[] ints = cal2(new int[]{3,1, 2, 5}, 3);
        System.out.println(ints[0]+"   "+ints[1]);
    }
    /**
     * 解法2
     * 空间换时间 时间复杂度O（n）,空间复杂度O（n）
     * @param arr
     * @param target
     * @return
     */
    public int[] cal2(int arr[],int target) {
        Map<Integer,Integer> map = new HashMap();
        for (int i = 0; i < arr.length; i++) {
            map.put(arr[i],i);
            int sub = target - arr[i];
            if(map.containsKey(sub) && map.get(sub) != i ){//!=i 元素只能用一次
                return new int[]{i,map.get(sub)};
            }
        }
        throw new IllegalArgumentException("No two sum solution");
    }

    }

package com.ssm.LeetCode_Practice;

import org.junit.Test;

import java.util.HashSet;
import java.util.Set;

/**
 * @author
 * @description
 * 给定一个字符串，请你找出其中不含有重复字符的 最长子串 的长度。
 * 输入: "abcabcbb"
 * 输出: 3
 * 解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
 * @date 2019/7/29
 */
public class Num03 {

    @Test
    public void test(){
        int strLength = lengthOfLongestSubstring("pwwkew");
        System.out.println(strLength);
    }

    /**
     * 思路：把字符串看成一个滑动窗口
     * 发现了有重复的终移除不重复的然后继续遍历
     * @param s
     * @return
     */

        public int lengthOfLongestSubstring(String s) {
            int len = s.length();
            Set<Character> set = new HashSet<>();
            int count = 0; int i = 0; int j = 0;
            while ( i <len && j < len){
                if(!set.contains(s.charAt(j))){

                    set.add(s.charAt(j++));
                    //返回两个数值较大的
                    count = Math.max(count,j-i);
                }else {
                    set.remove(s.charAt(i++));
                }
            }
            return count;
        }




}

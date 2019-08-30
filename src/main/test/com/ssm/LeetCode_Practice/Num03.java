package com.ssm.LeetCode_Practice;

import org.junit.Test;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
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

        @Test
        public void date(){
         /*   DateTimeParser[] parsers = {
                    DateTimeFormatter.forPattern( "yyyy-MM-dd HH" ).getParser(),
                    DateTimeFormatter.forPattern( "yyyy-MM-dd" ).getParser() };
            DateTimeFormatter formatter = new DateTimeFormatterBuilder().append( null, parsers ).toFormatter();

            DateTime date1 = formatter.parseDateTime( "2010-01-01" );
            DateTime date2 = formatter.parseDateTime( "2010-01-01 01" );*/
        }

        @Test
    public void date2() throws ScriptException, ParseException {
            ScriptEngineManager manager = new ScriptEngineManager();
            ScriptEngine engine = manager.getEngineByName("js");
            String[] dateStrings = new String[] {
                    "2015-10-14T16:41:42.000Z",
                    "2015-10-14T19:01:53.100+01:00",
                    "2015-10-14 05:20:29" };

            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
            for (String d : dateStrings) {
                String script = "new Date('" + d + "')";
                Object eval = engine.eval(script);
                Date parsed = sdf.parse(eval.toString().replace("[Date ", "").replace("]", ""));
                System.out.println(eval + " -> " + parsed);

            }
        }

}

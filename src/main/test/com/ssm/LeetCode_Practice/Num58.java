package com.ssm.LeetCode_Practice;

/**
 * @author zhoubq
 * @description 最后一个单词的长度
 * 给定一个仅包含大小写字母和空格 ' ' 的字符串，返回其最后一个单词的长度。
 * 如果不存在最后一个单词，请返回 0 。
 * 说明：一个单词是指由字母组成，但不包含任何空格的字符串。
 * 示例:
 * 输入: "Hello World"
 * 输出: 5
 * 来源：力扣（LeetCode）
 * 链接：https://leetcode-cn.com/problems/length-of-last-word
 * 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
 * @date 2019/6/20
 */
public class Num58 {

    public static void main(String[] args) {
        String str = "Wor ld";
        String repStr = str.replace(" ",",");
        String[] split = repStr.split(",");
        System.out.println(str.charAt(0));
        int i = lengOfLastWord2(str);
        System.out.println("字符串长度为："+i);
        System.out.println(split[split.length - 1]);
        System.out.println(str.length());
        System.out.println(str.replace(" ",","));
    }
    public static int lengOfLastWord(String str){

        String repStr = str.replace(" ",",");
        boolean contains = repStr.contains(",");
        if(contains){
            String[] split = repStr.split(",");
            return split[split.length - 1].length();
        }else {
            return 0;
        }
    }

    /**
     * 反转字符串 遍历去空格
     * @param str
     * @return
     */
    public static int lengOfLastWord2(String str){
        int start  = -1;
        int end = -1;
        String str2 = "Hello World";

        for (int i = str.length() - 1; i >= 0; i--) {
            if((str.charAt(i) != ' ') && (end == -1)){
                start = i;
                end = i;
            }else if((str.charAt(i) == ' ') && (end != -1)) {
                start = i+1; //后往前遍历 有空字符 终止
                break;
            }else if((str.charAt(i) != ' ') && (end != -1)) {
                //移位
                start = i;
            }
        }
        if(end == -1){
            return 0;
        }
        return end - start + 1;
    }
}

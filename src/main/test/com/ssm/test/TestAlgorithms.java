package com.ssm.test;

import java.util.Arrays;
import java.util.List;

import org.apache.commons.lang.ArrayUtils;
import org.junit.Test;

public class TestAlgorithms {
    /*给定一个整数数组和一个目标值，找出数组中和为目标值的两个数。

    你可以假设每个输入只对应一种答案，且同样的元素不能被重复利用。

    示例:

    给定 nums = [2, 7, 11, 15], target = 9

    因为 nums[0] + nums[1] = 2 + 7 = 9
    所以返回 [0, 1]*/
    public static void main(String[] args) {
        String parseStr = String.valueOf("123");
        System.out.println(parseStr.charAt(2));
        int nums[] = {11,2, 7, 15};
       int target = 9;
        int[] ints = twoSum(nums, target);
        System.out.println(ints[0]+"___"+ints[1]);

        System.out.println(getSumI(10));
    }
    public static int[] twoSum(int[] nums, int target) {
        for(int i = 0;i<nums.length;i++){
            for(int j=i+1;j<nums.length;j++){
                if(nums[i]== target-nums[j]){
                     return new int[]{i,j};
                }
            }
        }
        throw new IllegalArgumentException("No two sum solution");
    }

    public static int getSumI(int i){
        String a = "abc";
        String t = "";
        String parseStr = String.valueOf(i);
        int c = Integer.valueOf(parseStr);
        int sum=0;
        for (int j = 1; j <= i; ++j) {
            sum = sum + j;
        }
        return sum;


    }

    /**
     * 数组转换asList
     */
    @Test
    public void test(){
        String s[]={"aa","bb","cc"};
        List<String> sList=Arrays.asList(s);
        for(String str:sList){//能遍历出各个元素
            System.out.println(str);
        }
        System.out.println(sList.size());//为3

        System.out.println("- - - - - - - - - - -");

        int i[]={11,22,33};
        List intList=Arrays.asList(i);  //intList中就有一个Integer数组类型的对象，整个数组作为一个元素存进去的
        for(Object o:intList){//就一个元素,源码中要求为包装类才能正常装换为集合
            System.out.println(o.toString());
        }
        System.out.println("- - - - - - - - - - -");
        /**通过ArrayUtils.toObject(i) 可以把基本数据类型的数组转换为其包装类的数组**/
        List<Integer> integerList = Arrays.asList(ArrayUtils.toObject(i));
        for(Object o:integerList){//就一个元素,源码中要求为包装类才能正常装换为集合
            System.out.println(o.toString());
        }

        System.out.println("- - - - - - - - - - -");

        Integer ob[]={11,22,33};
        List<Integer> objList= Arrays.asList(ob);  //数组里的每一个元素都是作为list中的一个元素
        for(int a:objList){
            System.out.println(a);
        }

        System.out.println("- - - - - - - - - - -");
          /**坑点。**/
        objList.remove(0);//asList()返回的是arrays中私有的终极ArrayList类型，它有set,get，contains方法，但没有增加和删除元素的方法，所以大小固定,会报错
        objList.add(0);//由于asList返回的list的实现类中无add方法，所以会报错
    }
/*
    public static void main(String[] args) throws Exception{
       *//* String filePath = "C:\\Users\\Onpu\\Desktop\\s1.txt";
        String txtStr = reader(filePath);
        if (txtStr != null) {
            List<Map<String, Object>> maps = process(txtStr);
            for (Map<String, Object> map : maps) {
                String itemcode = (String) map.get("itemcode");
                System.out.println(itemcode);
            }
        } else {
            System.out.println("Read the content is empty!");
        }
        System.out.println("--- end ---");*//*
        int i = reverse(646324351);
        System.out.println(i);
    }
    public static int reverse(int x) {
        long z = x;
        String str = String.valueOf(z);
        String res = "";
        if(z <= Math.pow(2,31) - 1 || z>= Integer.MAX_VALUE){
            for(int i=1;i <= str.length();i++){
                res = res + str.charAt(str.length()-i);

            }
            if("-".equals(String.valueOf(res.charAt(res.length()-1)))) {
                String splitRes = res.split("-")[0];
                int split = Integer.valueOf(splitRes);
                return -split;
            }

            int c = Integer.valueOf(res);
            return c;
        }
        return 0;
    }*/


}

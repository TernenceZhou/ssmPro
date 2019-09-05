package com.ssm.test.base.Immutable;

import org.junit.Test;

import java.util.HashSet;

/**
 * @author
 * @description
 * @date 2019/9/5
 */
public class ImmutableString {

    public static String appendStr(String str){
        str = str + "bbb";
        return str;
    }
    public static StringBuilder appendBuilder(StringBuilder str){
        StringBuilder res = str.append("bbb");
        return res;
    }

    @Test
    public void test(){
        String a = "aaa";
        String s = ImmutableString.appendStr(a);
        System.out.println(a);

        StringBuilder builder = new StringBuilder("aaa");
        StringBuilder appendBuilder = ImmutableString.appendBuilder(builder);
        System.out.println(builder.toString()); //结果是aaabbb 可以的类 发生了改变。会导致线程不安全

    }

    @Test
    public void test2(){
        /**
         *  这里的hs出现两个值一样的原因：以为stringBuilder没有不可变类的保护，
         *  所以改变了sb3 时 sb1也被改变了。破换了HashSet的键值唯一性
         *  因此HashMap HashSet等数据结构不要使用可变类作为泛型
         */
        HashSet<StringBuilder> hs = new HashSet<StringBuilder>();
        StringBuilder sb1 = new StringBuilder("aaa");
        StringBuilder sb2 = new StringBuilder("aaabbb");
        hs.add(sb1);
        hs.add(sb2);    //这时候HashSet里是{"aaa","aaabbb"}

        StringBuilder sb3 = sb1;
        sb3.append("bbb");//这时候HashSet里是{"aaabbb","aaabbb"}
        System.out.println(hs);



        HashSet<String> hstr = new HashSet<String>();
        String s1 = new String("aaa");
        String s2 = new String("aaabbb");
        s1.intern();
        hstr.add(s1);
        hstr.add(s2);    //这时候HashSet里是{"aaa","aaabbb"}

        String s3 = s1;
        s3 += "bbb";
        System.out.println(hstr);
    }
}

package com.ssm.test;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RegEx {
    public static void main(String[] args) {
        String pattern = "(\\d{6})(\\d{4})(\\d{2})(\\d{2})(\\d{3})([0-9]|X)（[\\u4e00-\\u9fa5]+）";
        Matcher matcher = Pattern.compile(pattern).matcher("十月三十号340602198902122819（张三）吧大撒大撒，340602198902122819（张三） 你你ih340602198902122819（张三）");
        while (matcher.find()){
            System.out.println(matcher.group());
        }
    }
}

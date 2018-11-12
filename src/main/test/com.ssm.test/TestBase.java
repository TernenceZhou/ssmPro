package com.ssm.test;

public final class TestBase {
    String a = "";
    int ii = 0;
    final int id = 1; // 基本类型，不可改变
    final Object obj = new Object(); // 则引用不可改变，但 obj里面的属性可以改变！
    public void i(){
        ii = 22;
        a.substring(1);
    }


}

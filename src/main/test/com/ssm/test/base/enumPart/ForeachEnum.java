package com.ssm.test.base.enumPart;

import org.junit.Test;

import java.util.EnumMap;

/**
 * @author
 * @description
 * @date 2020/1/8
 */
public class ForeachEnum {

    @Test
    public void test01(){
        InfoCode[] codes = InfoCode.values();
        String res = "";
        for (InfoCode code : codes) {
            if (!"0000".equals(code.getCode())) {
                continue;
            }
            res = code.getMsg();
        }
        System.out.println(res);

    }

    @Test
    public void test02(){
        InfoCode[] codes = InfoCode.values();
        String res = "";
        for (InfoCode code : codes) {
            System.out.println(code.getMsg());
            System.out.println(code.getCode());
        }
    }

    @Test
    public void test03(){
        InfoCode[] codes = InfoCode.values();
        String res = "";
        for (InfoCode code : codes) {
            System.out.println(code.getMsg());
            System.out.println(code.getCode());
        }
    }
}

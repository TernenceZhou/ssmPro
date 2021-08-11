package com.ssm.test.base.exception;

/**
 * @author
 * @description
 * @date 2021/7/20
 */
public class Try_Finally {

    public static void main(String[] args) {
        String te = te("A");
        System.out.println(te);
    }

    public static String te(String param) {
        String p = "";
        if ("A".equals(param)) {
            p =  "参数A";
            return p;
        }
        try {
            p = "success";
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            System.out.println(" finally "+ p);
            System.out.println("打印日志");
        }
        return p;
    }

}

package com.ssm.test.base.enumPart;

/**
 * @author
 * @description
 * 自定义一个枚举
 * @date 2019/9/9
 */
public enum InfoCode {
    SUCCESS("0000","SUCCESS"),FAILURE("0004","FAILURE");

    private String code;
    private String msg;

    InfoCode(String code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    public String getCode() {
        return code;
    }

    public String getMsg() {
        return msg;
    }

    public static void main(String[] args) {
        InfoCode failure = InfoCode.FAILURE;
        System.out.println(failure.getMsg());
    }
}

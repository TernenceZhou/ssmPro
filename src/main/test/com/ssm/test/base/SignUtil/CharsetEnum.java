package com.ssm.test.base.SignUtil;

public enum CharsetEnum {
    /**
     * UTF-8编码
     */
    UTF_8("UTF-8"),
    /**
     * GBK编码
     */
    GBK("GBK");

    public String code;

    CharsetEnum(String code) {
        this.code = code;
    }


}

package com.ssm.test.base.SignUtil;

public enum SignEnum {

    SIGN_ALGORITHMS("SHA1WithRSA"),
    SIGN_TYPE_RSA("RSA"),
    SIGNATURE_ALGORITHM("MD5withRSA");

    public String code;

    SignEnum(String code) {
        this.code = code;
    }

}

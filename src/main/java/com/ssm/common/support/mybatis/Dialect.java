package com.ssm.common.support.mybatis;

public interface Dialect {
    boolean supportsLimitOffset();

    boolean supportsLimit();

    String getLimitString(String var1, int var2, int var3);

    String getLimitString(String var1, int var2, String var3, int var4, String var5);
}

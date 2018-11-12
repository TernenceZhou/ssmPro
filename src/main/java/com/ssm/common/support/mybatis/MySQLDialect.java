package com.ssm.common.support.mybatis;

public class MySQLDialect implements Dialect{
    public MySQLDialect() {
    }

    public boolean supportsLimitOffset() {
        return true;
    }

    public boolean supportsLimit() {
        return true;
    }

    public String getLimitString(String sql, int offset, int limit) {
        return this.getLimitString(sql, offset, (String)null, limit, (String)null);
    }

    public String getLimitString(String sql, int offset, String offsetPlaceholder, int limit, String limitPlaceholder) {
        StringBuilder newSql = new StringBuilder();
        return offset >= 0 ? newSql.append(sql).append(" limit ").append(offset).append(",").append(limit).toString() : newSql.append(sql).append(" limit ").append(limitPlaceholder).toString();
    }
}

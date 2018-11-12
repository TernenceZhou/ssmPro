package com.ssm.common.support.mybatis;

import com.ssm.common.support.page.Page;
import org.apache.ibatis.executor.parameter.ParameterHandler;
import org.apache.ibatis.executor.statement.RoutingStatementHandler;
import org.apache.ibatis.executor.statement.StatementHandler;
import org.apache.ibatis.mapping.BoundSql;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.mapping.ParameterMapping;
import org.apache.ibatis.plugin.*;
import org.apache.ibatis.scripting.defaults.DefaultParameterHandler;

import java.lang.reflect.Field;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Properties;

@Intercepts({@Signature(
        type = StatementHandler.class,
        method = "prepare",
        args = {Connection.class,Integer.class}
)})
public class PageInterceptor implements Interceptor {
    public PageInterceptor() {
    }

    public Object intercept(Invocation invocation) throws Throwable {
        RoutingStatementHandler handler = (RoutingStatementHandler)invocation.getTarget();
        StatementHandler delegate = (StatementHandler)PageInterceptor.ReflectUtil.getFieldValue(handler, "delegate");
        BoundSql boundSql = delegate.getBoundSql();
        Object paramObj = boundSql.getParameterObject();
        if (paramObj instanceof Page) {
            Page<?> page = (Page)paramObj;
            MappedStatement mappedStatement = (MappedStatement)PageInterceptor.ReflectUtil.getFieldValue(delegate, "mappedStatement");
            Connection connection = (Connection)invocation.getArgs()[0];
            String sql = boundSql.getSql();
            page.setSql(sql);
            if (page.isNeedCountFlg()) {
                this.setTotalRecord(page, mappedStatement, connection);
            }

            String pageSql = this.getPageSql(page, sql);
            if (page.isCheckOverFlowMaxCntFlg() && page.getTotalRecord() > page.getOverFlowMaxNum()) {
                page.setOverFlowMaxCntFlg(true);
                throw new Exception();
            }

            PageInterceptor.ReflectUtil.setFieldValue(boundSql, "sql", pageSql);
        }

        return invocation.proceed();
    }

    private void setTotalRecord(Page<?> page, MappedStatement mappedStatement, Connection connection) {
        BoundSql boundSql = mappedStatement.getBoundSql(page);
        String sql = boundSql.getSql();
        String countSql = this.getCountSql(page, sql);
        List<ParameterMapping> parameterMappings = boundSql.getParameterMappings();
        BoundSql countBoundSql = new BoundSql(mappedStatement.getConfiguration(), countSql, parameterMappings, page);
        ParameterHandler parameterHandler = new DefaultParameterHandler(mappedStatement, page, countBoundSql);
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            pstmt = connection.prepareStatement(countSql);
            parameterHandler.setParameters(pstmt);
            rs = pstmt.executeQuery();

            int totalRecord;
            for(totalRecord = 0; rs.next(); totalRecord += rs.getInt(1)) {
                ;
            }

            page.setTotalRecord(totalRecord);
        } catch (SQLException var21) {
            var21.printStackTrace();
        } finally {
            try {
                if (rs != null) {
                    rs.close();
                }

                if (pstmt != null) {
                    pstmt.close();
                }
            } catch (SQLException var20) {
                var20.printStackTrace();
            }

        }

    }

    private String getCountSql(Page<?> page, String sql) {
        if (page.isComplicateFlg()) {
            sql = "select count(0) from (" + sql + ") pInter";
        } else {
            int indexSelect = sql.indexOf("select");

            for(int indexfrom = sql.indexOf("from"); indexSelect >= 0 && indexfrom >= 0; indexfrom = sql.indexOf(
                    "from", indexfrom + 1)) {
                sql = sql.substring(0, indexSelect + 6) + " count(*) " + sql.substring(indexfrom);
                indexSelect = sql.indexOf("select", indexSelect + 1);
            }

            int indexOrderBy = sql.indexOf("order by");
            if (indexOrderBy >= 0) {
                sql = sql.substring(0, indexOrderBy);
            }
        }

        return sql;
    }

    private String getPageSql(Page<?> page, String sql) {
        StringBuffer sqlBuffer = new StringBuffer(sql);
        if (page.isPageFlg()) {
            int offset = (page.getPageNo() - 1) * page.getPageSize();
            sqlBuffer.append(" limit ").append(offset).append(",").append(page.getPageSize());
        }

        return sqlBuffer.toString();
    }

    public Object plugin(Object target) {
        return Plugin.wrap(target, this);
    }

    public void setProperties(Properties properties) {
        /*//如果项目中分页的pageSize是统一的，也可以在这里统一配置和获取，这样就不用每次请求都传递pageSize参数了。
        参数是在配置拦截器时配置的。
        String limit1 = properties.getProperty("limit", "10");
        this.pageSize = Integer.valueOf(limit1);
        this.dbType = properties.getProperty("dbType", "mysql");*/
    }

    private static class ReflectUtil {
        private ReflectUtil() {
        }

        public static Object getFieldValue(Object obj, String fieldName) {
            Object result = null;
            Field field = getField(obj, fieldName);
            if (field != null) {
                field.setAccessible(true);

                try {
                    result = field.get(obj);
                } catch (IllegalArgumentException var5) {
                    var5.printStackTrace();
                } catch (IllegalAccessException var6) {
                    var6.printStackTrace();
                }
            }

            return result;
        }

        private static Field getField(Object obj, String fieldName) {
            Field field = null;
            Class clazz = obj.getClass();

            while(clazz != Object.class) {
                try {
                    field = clazz.getDeclaredField(fieldName);
                    break;
                } catch (NoSuchFieldException var5) {
                    clazz = clazz.getSuperclass();
                }
            }

            return field;
        }

        public static void setFieldValue(Object obj, String fieldName, String fieldValue) {
            Field field = getField(obj, fieldName);
            if (field != null) {
                field.setAccessible(true);

                try {
                    field.set(obj, fieldValue);
                } catch (IllegalArgumentException var5) {
                    var5.printStackTrace();
                } catch (IllegalAccessException var6) {
                    var6.printStackTrace();
                }
            }

        }
    }
}

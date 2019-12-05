package com.ssm.xiangxueClass;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * @author
 * @description
 * @date 2019/12/4
 */
public class JdbcDemo {

    private static final String URL = "";
    private static final String USER_NAME = "root";
    private static final String USER_PASSWORD = "123456";

    public static void main(String args[]){
        JdbcDemo inc = new JdbcDemo ();
        int i = 0;
        //inc.add(i);
        //i = i++;
//        i= i+1;
        i++;
//        System.out.println(i++);
        System.out.println(i);
    }

    /**
     * 获取连接
     * @return
     */
    private Connection getConnection(){
        Connection connection = null;
        try {
            //加载驱动
            Class<?> clazz = Class.forName("com.mysql.cj.jdbc.Driver");
            connection = DriverManager.getConnection(URL, USER_NAME, USER_PASSWORD);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return connection;
    }
}

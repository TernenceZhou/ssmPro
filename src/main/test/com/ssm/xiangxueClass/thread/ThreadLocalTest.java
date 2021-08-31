package com.ssm.xiangxueClass.thread;

import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

/**
 * @author
 * @description
 * @date 2020/1/20
 */
public class ThreadLocalTest {



    public static void main(String[] args) {
        ThreadLocal local = new ThreadLocal();
        local.set("123");
        InputStream inputStream = ClassLoader.getSystemResourceAsStream("xx");
        SqlSessionFactory factory = new SqlSessionFactoryBuilder().build(inputStream);
        SqlSession session = factory.openSession();
        session.selectList("");
    }


}

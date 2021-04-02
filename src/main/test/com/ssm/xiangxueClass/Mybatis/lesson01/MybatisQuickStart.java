package com.ssm.xiangxueClass.Mybatis.lesson01;

import com.ssm.dao.UserDao;
import com.ssm.model.UserInfo;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.Configuration;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.junit.After;
import org.junit.Before;
import sun.misc.Resource;

import java.io.IOException;
import java.io.InputStream;

/**
 * Mybatis快速使用类
 */
public class MybatisQuickStart {

    private SqlSessionFactory sqlSessionFactory;


    @Before
    public void init(){
        try {
            InputStream stream = Resources.getResourceAsStream("mybatis-config.xml");
            Configuration configuration = sqlSessionFactory.getConfiguration();
            //构造者模式
            sqlSessionFactory = new SqlSessionFactoryBuilder().build(stream);
            stream.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    @After
    public void start(){
        SqlSession sqlSession = sqlSessionFactory.openSession();
        UserDao userDao = sqlSession.getMapper(UserDao.class);
        sqlSession.selectOne("");
        UserInfo user = userDao.getUser();
        System.out.println(user.toString());
    }

}

package com.ssm.xiangxueClass.Mybatis.lesson01;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.Configuration;
import org.apache.ibatis.session.RowBounds;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import com.alibaba.fastjson.JSON;
import com.ssm.dao.UserDao;
import com.ssm.model.UserInfo;

/**
 * Mybatis快速使用类
 */
public class MybatisQuickStart {

    private SqlSessionFactory sqlSessionFactory;

    @Before
    public void init() {
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

    /**
     * 分页使用RowBounds对象 对ResultSet进行内存分页
     */
    @Test
    public void page() {
        //SqlSession sqlSession = MybatisUtil.getSession();
        SqlSession sqlSession = sqlSessionFactory.openSession();

        /*rowBounds需要的第一个参数就是从数据的哪个下标开始开始查，第二个就是你需要查询的条数*/
        RowBounds rowBounds = new RowBounds((1 - 1) * 8, 8);
        List<UserInfo> list = sqlSession.selectList("UserMapper.getAllRowBounds", null, rowBounds);
        sqlSession.close();
        System.out.println(JSON.toJSONString(list));
    }

    @After
    public void start() {
        SqlSession sqlSession = sqlSessionFactory.openSession();
        UserDao userDao = sqlSession.getMapper(UserDao.class);
        sqlSession.selectOne("");
        UserInfo user = userDao.getUser();
        System.out.println(user.toString());
    }

}

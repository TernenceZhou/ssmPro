package com.ssm.xiangxueClass.spring.class08.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Date;

/**
 * @author
 * @description
 * @date 2019/11/4
 */
@Repository
public class OrderDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void insert(){
        System.out.println("OrderDao ~~~");
        String sql = "INSERT INTO `orderinfo`( `orderTime`, `orderMoney`, `orderStatus`) VALUES (?,?,?)";
        jdbcTemplate.update(sql,new Date(),100,1);
        System.out.println("OrderDao 执行完成~");
    }
}

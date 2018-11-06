package com.ssm.service.impl;

import com.ssm.common.pojo.User;
import com.ssm.common.util.Page;
import com.ssm.dao.IUserDao;
import com.ssm.service.IUserService;
import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2016/6/22.
 */
@Service("iUserService")
public class IUserServiceImpl implements IUserService {
    @Autowired
    private IUserDao userDao;

    @Override
    public User getUserById(int userId) {
        return this.userDao.selectByPrimaryKey(userId);
    }

    @Override
    public int createUser(User user) {
        return this.userDao.insertSelective(user) ;
    }

    @Override
    public User findByLogin(User user) {
        return userDao.findByLogin(user) ;
    }

    /**
     * 分页查询
     */
    @Override
    public Page<User> findByParams(User u, int pageNo, int limit) {
        Page<User> page = new Page<User>();
        page.setPageNo(pageNo);
        page.setLimit(limit);

        int offset = page.getOffsets();
        RowBounds rowBound = new RowBounds(offset, limit);

        List<User> users = userDao.findByParams(u,rowBound);
        page.setRows(users);
        int total = userDao.findAllCount(u) ;
        page.setTotal(total) ;
        if(offset >= page.getTotal()){
            page.setPageNo(page.getTotalPages());
        }
        return page ;
    }

    @Override
    public int deleteByPrimaryKey(Integer id) {
        return userDao.deleteByPrimaryKey(id) ;
    }

    @Override
    public int updateByPrimaryKeySelective(User record) {
        return userDao.updateByPrimaryKeySelective(record);
    }

    @Override
    public int findAllCount(User u) {
        return userDao.findAllCount(u) ;
    }

    @Override
    public List<User> findHotUser() {
        return userDao.findHotUser();
    }

    @Override
    public List<User> findAllByQuery(User user) {
        return userDao.findAllByQuery(user);
    }

    @Override
    public List<User> list(Map<String, Object> map) {
        return userDao.list(map);
    }

    @Override
    public Long getTotal(Map<String, Object> map) {
        return userDao.getTotal(map);
    }

    @Override
    public User findUserByUsername(String username) {
        return userDao.findUserByUsername(username);
    }
}

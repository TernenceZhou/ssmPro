package com.ssm.xiangxueClass.spring.class02.cap06.config;

import com.ssm.xiangxueClass.spring.class02.cap06.bean.Tiger;
import org.springframework.beans.factory.FactoryBean;

/**
 * @author
 * @description
 * @date 2019/10/23
 */
public class MyBeanFactory implements FactoryBean<Tiger> {
    @Override
    public Tiger getObject() throws Exception {
        return new Tiger();
    }

    @Override
    public Class<?> getObjectType() {
        return Tiger.class;
    }

    @Override
    public boolean isSingleton() {
        return true;
    }
}

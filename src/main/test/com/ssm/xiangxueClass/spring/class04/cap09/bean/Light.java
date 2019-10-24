package com.ssm.xiangxueClass.spring.class04.cap09.bean;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.BeanNameAware;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.EmbeddedValueResolverAware;
import org.springframework.stereotype.Component;
import org.springframework.util.StringValueResolver;

/**
 * @author
 * @description
 * @date 2019/10/24
 */
@Component
public class Light implements ApplicationContextAware, BeanNameAware, EmbeddedValueResolverAware {

    private ApplicationContext  applicationContext;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        System.out.println("传入的 IOC:"+applicationContext);
        this.applicationContext = applicationContext;
    }

    @Override
    public void setBeanName(String beanName) {
        System.out.println("当前bean的名字："+ beanName);
    }

    @Override
    public void setEmbeddedValueResolver(StringValueResolver stringValueResolver) {
        //用来解析string值
        String stringValue = stringValueResolver.resolveStringValue("你好${os.name},计算#{3*8}");
        System.out.println("解析的字符串："+stringValue);
    }
}

package com.ssm.xiangxueClass.spring.class02.cap06.config;

import com.ssm.xiangxueClass.spring.class02.cap06.bean.Pig;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.beans.factory.support.RootBeanDefinition;
import org.springframework.context.annotation.ImportBeanDefinitionRegistrar;
import org.springframework.context.annotation.ImportSelector;
import org.springframework.core.type.AnnotationMetadata;

/**
 * @author
 * @description
 * @date 2019/10/22
 */
public class MyImportBeanDefinitionRegistrar implements ImportBeanDefinitionRegistrar {
    @Override
    public void registerBeanDefinitions(AnnotationMetadata annotationMetadata, BeanDefinitionRegistry beanDefinitionRegistry) {

        boolean catBean = beanDefinitionRegistry.containsBeanDefinition("com.ssm.xiangxueClass.spring.class02.cap06.aop.Cat");
        boolean dogBean = beanDefinitionRegistry.containsBeanDefinition("com.ssm.xiangxueClass.spring.class02.cap06.aop.Dog");
        if( catBean && dogBean){
            RootBeanDefinition beanDefinition = new RootBeanDefinition(Pig.class);
            //注册对象到IOc容器
            beanDefinitionRegistry.registerBeanDefinition("pig",beanDefinition);
        }
    }
}

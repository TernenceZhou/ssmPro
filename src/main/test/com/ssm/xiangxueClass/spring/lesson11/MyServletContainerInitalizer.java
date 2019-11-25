package com.ssm.xiangxueClass.spring.lesson11;

import com.ssm.xiangxueClass.spring.lesson11.service.JamesService;

import javax.servlet.ServletContainerInitializer;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.HandlesTypes;
import java.util.Set;

/**
 * 在 web容器启动时会做一些组件内的初始化工作
 */
@HandlesTypes(value = {JamesService.class})
public class MyServletContainerInitalizer implements ServletContainerInitializer {
    @Override
    public void onStartup(Set<Class<?>> set, ServletContext servletContext) throws ServletException {
        System.out.println("onStartUp........");
        for (Class<?> aClass : set) {
            System.out.println(aClass);
        }
    }
}

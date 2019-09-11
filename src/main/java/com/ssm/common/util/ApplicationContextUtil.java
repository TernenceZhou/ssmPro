package com.ssm.common.util;

import com.ssm.qo.BookQO;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

/**
 * @author
 * @description
 * @date 2019/9/10
 */
public class ApplicationContextUtil implements ApplicationContextAware {
    private static ApplicationContext ctx;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        ctx = applicationContext;
    }

    public static ApplicationContext getApplicationContext() {
        return ctx;
    }

    public static void main(String[] args) {
        BookQO bean = ApplicationContextUtil.getApplicationContext().getBean(BookQO.class);

        System.out.println();

    }
}

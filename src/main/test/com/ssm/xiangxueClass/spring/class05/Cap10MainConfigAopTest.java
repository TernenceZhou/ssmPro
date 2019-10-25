package com.ssm.xiangxueClass.spring.class05;

import com.ssm.xiangxueClass.spring.class04.cap09.config.Cap9MainConfig;
import com.ssm.xiangxueClass.spring.class04.cap09.dao.TestDao;
import com.ssm.xiangxueClass.spring.class04.cap09.service.TestService;
import com.ssm.xiangxueClass.spring.class05.aop.Calculator;
import com.ssm.xiangxueClass.spring.class05.config.Cap10MainAopConfig;
import org.junit.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

/**
 * @author
 * @description
 * @date 2019/10/22
 */
public class Cap10MainConfigAopTest {

    @Test
    public void test(){
        AnnotationConfigApplicationContext anno = new AnnotationConfigApplicationContext(Cap10MainAopConfig.class);
        Calculator calculator = anno.getBean(Calculator.class);
        System.out.println(calculator.div(2,1));
    }


}

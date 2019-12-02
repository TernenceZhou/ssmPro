package com.ssm.xiangxueClass.spring.class08;

import com.ssm.xiangxueClass.spring.class08.service.OrderService;
import org.junit.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * @author
 * @description
 * @date 2019/11/4
 */

public class Cap11MainConfigTest {

        @Test
        public void test(){
            new ClassPathXmlApplicationContext("");
            AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(Cap11MainConfig.class);
            OrderService service = context.getBean(OrderService.class);
            service.insert();
            context.close();
        }
}

package com.ssm.xiangxueClass.spring.lesson14_mvc.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @author
 * @description
 * @date 2019/12/3
 */
@Target({ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME) //能通过反射获取到字节码文件class
@Documented
//@Inherited//表示能被子类继承的注解
public @interface MyRequestParam {
    String value() default "";
}

package com.ssm.xiangxueClass.spring.lesson14_mvc.annotation;

import com.ssm.xiangxueClass.spring.lesson14_mvc.servlet.MyDispatcherServlet;
import org.junit.Test;

import java.lang.reflect.Field;
import java.lang.reflect.Method;

/**
 * @author
 * @description
 * @date 2020/1/7
 */
public class AnnotationTest {

    /**
     * 获取类方法使用的接口
     */
    @Test
    public void test1(){
        Class<MyDispatcherServlet> aClass = MyDispatcherServlet.class;
        //所有public的方法 包含父类的所有方法
        Method[] methods = aClass.getMethods();
        for(Method method:methods) {
            // isAnnotationPresent 针对注解的保留范围必须是RententionPolicy.RUNTIME
            //否则一直返回false
            /**
             * @RententionPolicy.SOURCE 注解保留在源文件 编译程序处理完注解信息后丢弃 比如Override在编译过程就会检测到
             * CLASS  ：保留在class文件中,但是当jvm加载class时被遗弃 （默认）
             * RUNTIME：不仅保留在class文件也保留在jvm加载class时
             */
            boolean b = method.isAnnotationPresent(Test.class);
            if (b) {
                System.out.println(method.getName());
            }
        }
    }
    /**
     * 获取类中使用的接口
     */
    @Test
    public void test2() throws IllegalAccessException {
        /**
         * init
         * instance
         * t
         * beanToMap
         * ioc
         * doGet
         * handlerMapping
         * doScanPackage
         * doPost
         */
        Class<MyDispatcherServlet> aClass = MyDispatcherServlet.class;

        Method[] declaredMethods = aClass.getDeclaredMethods();//当前类中自己定义的所有方法 包含private、public
        for (Method declaredMethod : declaredMethods) {
            //System.out.println(declaredMethod.getName());
        }

        Field[] fields = aClass.getDeclaredFields();
        for (Field field : fields) {
            System.out.println(field);
            String name = field.getName();
            Object value = field.get(name);
            System.out.println((String.format("name:%s,value:%s",name,value)));
        }
    }

}

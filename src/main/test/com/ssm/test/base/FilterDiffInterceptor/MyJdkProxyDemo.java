package com.ssm.test.base.FilterDiffInterceptor;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

/**
 *@author
 * 动态代理
 * 实现一个 InvocationHandler 接口
 */
public class MyJdkProxyDemo {

    static interface Car {
        void run();
    }

    static class Bus implements Car {

        @Override
        public void run() {
            System.out.println(" this is my bus");
        }
    }
    static class Taxi implements Car {

        @Override
        public void run() {
            System.out.println(" this is my Taxi");
        }
    }

    //JDK proxy Class
    static class MyJdkProxyClass implements InvocationHandler {

        //代理对象
        private Object object;

        //获取代理对象
        private Object getInstance(Object target) {
            this.object = target;
            return Proxy.newProxyInstance(target.getClass().getClassLoader(),target.getClass().getInterfaces(),this);
        }
       /**
        * 执行代理方法
        * @param proxy  代理对象
        * @param method 代理方法
        * @param args   方法的参数
        * @return
        * @throws InvocationTargetException
        * @throws IllegalAccessException
        */
        @Override
        public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
            System.out.println("动态代理执行之前业务");

            Object invoke = method.invoke(object, args); // 执行调用方法（此方法执行前后，可以进行相关业务处理）

            System.out.println("动态代理执行 after 业务");

            return invoke;
        }
    }

    public static void main(String[] args) {
        MyJdkProxyClass proxyClass = new MyJdkProxyClass();
        Car car = (Car) proxyClass.getInstance(new Taxi());
        car.run();
    }
}

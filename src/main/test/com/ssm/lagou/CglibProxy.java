package com.ssm.lagou;

import java.lang.reflect.Method;

import lombok.Data;
import net.sf.cglib.proxy.Enhancer;
import net.sf.cglib.proxy.MethodInterceptor;
import net.sf.cglib.proxy.MethodProxy;

/**
 * CGlib效率更高
 * 和jdk动态代理不同的是
 *  在初始化时 cglib 使用 被代理类为子类的方式，所以被代理类不能被final修饰
 */
@Data
public class CglibProxy {

    public static void main(String[] args) {
        //创建CGlib 代理类
        CGLibProxy cglibProxy = new CGLibProxy();
        //获取实例
        Car car = (Car) cglibProxy.getInstance(new Car());
        car.running();
    }

    static class Car {
        public void running() {
            System.out.println("The car is running.");
        }
    }

    static class CGLibProxy implements MethodInterceptor {

        private Object object;


        public Object getInstance(Object target) {
            this.object = target;
            Enhancer enhancer = new Enhancer();
            //设置父类为实例类
            enhancer.setSuperclass(this.object.getClass());
            //设置回调函数
            enhancer.setCallback(this);
            // 创建代理对象
            Object o = enhancer.create();
            return o;
        }

        @Override
        public Object intercept(Object o, Method method, Object[] objects, MethodProxy methodProxy) throws Throwable {
            System.out.println("方法调用前业务处理.");
            Object invoke = methodProxy.invokeSuper(o, objects);
            return invoke;
        }
    }



}

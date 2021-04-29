package com.ssm.test.base.FilterDiffInterceptor;/**
 * @author
 */

import java.lang.reflect.Method;

import org.aopalliance.intercept.MethodInvocation;
import org.springframework.cglib.proxy.Enhancer;
import org.springframework.cglib.proxy.MethodInterceptor;
import org.springframework.cglib.proxy.MethodProxy;

/**
 * 需要引入第三方包
 * 基于ASM字节码技术实现
 */
public class MyCGLibExample {

    static class Car {
         public void run() {
             System.out.println("The car is running");
         }
    }

    static class CarCGlib implements MethodInterceptor {

        private Object object;

        public Object getInstance(Object target) {
            this.object = target;
            Enhancer enhancer = new Enhancer();
            enhancer.setSuperclass(target.getClass());
            enhancer.setCallback(this);
            return enhancer.create();
        }

        @Override
        public Object intercept(Object o, Method method, Object[] objects, MethodProxy methodProxy) throws Throwable {
            System.out.println("方法调用前业务处理.");
            Object result = methodProxy.invokeSuper(o, objects);// 执行方法调用
            return result;
        }
    }

    public static void main(String[] args) {
        CarCGlib carCGlib = new CarCGlib();
        Car car = (Car) carCGlib.getInstance(new Car());
        car.run();
    }
}

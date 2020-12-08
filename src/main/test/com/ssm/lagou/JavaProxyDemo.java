package com.ssm.lagou;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

/**
 *  动态代理
 *  动态代理：程序运行期间能动态的构建代理对象 和 动态的调用代理方法的一种 机制
 *
 *  1.jdk的动态代理 （Jdk Proxy 动态代理）
 *      常使用java 反射 使用
 *  2.Cglib 通过ASM （java 字节码框架）
 *      实现动态代理 非反射
 *
 * 动态代理是行为方式，而反射和ASM 是其中的实现方式
 *
 *  二、LomBok是不是用的动态代理？
 *      不是。通过编译期自定义注解处理器来实现的
 *  三、动态代理的使用场景
 *      RPC框架、AOP 面向切面编程、 JDBC 连接
 *
 *  Spring 框架中同时使用了两种动态代理 JDK Proxy 和 CGLib
 *  当 Bean 实现了接口时，Spring 就会使用 JDK Proxy，在没有实现接口时就会使用 CGLib，我们也可以在配置中指定强制使用 CGLib，
 *  只需要在 Spring 配置中添加 <aop:aspectj-autoproxy proxy-target-class="true"/> 即可。
 *
 *   JDK Proxy 和Cglib 区别：
 *   JDK Proxy 是 java 语言自带的功能，无需通过加载第三方类实现；
 *   JDK Proxy 是通过反射和拦截器实现的
 *   JDK proxy 只能代理 继承接口的类
 *
 *     Cglib 是第三方提供的工具，基于ASM  执行效率更高
 *     Cglib 无需要通过实现接口，通过实现子类的方式完成调用
 *
 *
 */
public class JavaProxyDemo {

    public static void main(String[] args) {
        JDKProxy proxy = new JDKProxy();
        Car carInstance = (Car) proxy.getInstance(new Taxi());
        //carInstance.runing();

        Bus bus = new Bus();
        Runnable runnable = bus::runing;
        Car car =  bus::runing;
        car.runing();

        new Thread(runnable).start();

        //car.runing();
    }

    static class JDKProxy implements InvocationHandler {

        private Object object;

        public Object getInstance(Object target) {
            this.object = target;
            //取得代理对象
            final Object instance = Proxy.newProxyInstance(target.getClass().getClassLoader(), target.getClass().getInterfaces(), this);
            return instance;

        }

        @Override
        public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
            System.out.println("执行动态代理之前的业务......");
            Object invoke = method.invoke(object, args);
            return invoke;
        }

    }

    static interface Car {
        void runing();
    }

    static class Bus implements Car {
        @Override
        public void runing() {
            System.out.println("公交车 runing ~~~~~~~~~~~");
        }
    }

    static class Taxi implements Car {
        @Override
        public void runing() {
            System.out.println("出租车 runing ~~~~~~~~~~~");
        }
    }
}

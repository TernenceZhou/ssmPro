package com.ssm.test.design;

import org.springframework.cglib.proxy.InvocationHandler;
import org.springframework.cglib.proxy.Proxy;

import java.lang.reflect.Method;

public class DynamicProxy implements InvocationHandler {

    private Object source;

    public DynamicProxy(Object source) {
        super();
        this.source = source;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        //method.invoke(source,args);
        System.out.println("before");

        Method sourceMethod = source.getClass().getDeclaredMethod(method.getName(), method.getParameterTypes());
        sourceMethod.setAccessible(true);
        Object invoke = sourceMethod.invoke(source, args);
        System.out.println("after");

        return invoke;
    }

    /**
     * 如果TestClass 不去实现TestInteface 如果要调用TestClass的方法 需要用过反射的方式去执行
     *
     * @param args
     */
    public static void main(String[] args) {
        TestInterface testInterface = (TestInterface) Proxy.newProxyInstance(ClassLoader.getSystemClassLoader(), new Class[]{TestInterface.class},
                new DynamicProxy(new TestClass()));
        testInterface.method1();
        testInterface.method2();
        testInterface.method3();


    }
}

package com.ssm.test.design;

import org.springframework.cglib.proxy.InvocationHandler;
import org.springframework.cglib.proxy.Proxy;

import java.lang.reflect.Method;

public class DynamicProxy2 implements InvocationHandler {

    private Object source;

    public DynamicProxy2(Object source) {
        super();
        this.source = source;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        method.invoke(source,args);
        return null;
    }

    public static void main(String[] args) {
        TestInterface testInterface = (TestInterface) Proxy.newProxyInstance(ClassLoader.getSystemClassLoader(), new Class[]{TestInterface.class},
                new DynamicProxy2(new TestClass2()));
        testInterface.method1();
        testInterface.method2();
        testInterface.method3();
    }
}

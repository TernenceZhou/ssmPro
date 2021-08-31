package com.ssm.test.rpc;

/**
 * @author
 * @description
 * @date 2021/8/13
 */
public class HelloServiceImpl implements HelloService {
    @Override
    public String hello(String name) {
        return "Hello " + name;
    }
}

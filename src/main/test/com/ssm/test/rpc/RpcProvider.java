package com.ssm.test.rpc;

/**
 * @author
 * @description
 * @date 2021/8/13
 */
public class RpcProvider {

    public static void main(String[] args) throws Exception {
        HelloService service = new HelloServiceImpl();
        RpcFramework.export(service, 1234);
    }
}

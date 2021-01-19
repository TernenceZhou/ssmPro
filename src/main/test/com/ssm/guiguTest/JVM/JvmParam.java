package com.ssm.guiguTest.JVM;

/**
 *
 * 查看GC详情
 * -XX"+PrintGCDetails
 * -XX:+PrintCommandLineFlags  查看程序使用的默认JVM参数
 * -XX: +PrintFlagsFinal 打印最终值，如果某个默认值被新值覆盖，显示新值
 * java -jar -Xms10m -Xmx10m -Xss512
 */
public class JvmParam {

    public static void main(String[] args) throws InterruptedException {

        byte[] bytes = new byte[50* 1024 * 1024];
        System.out.println("hello GC");
        Thread.sleep(Integer.MAX_VALUE);

    }
}

package com.ssm.guiguTest.JVM;

import org.junit.Test;

/**
 *
 * 查看GC详情
 * -XX"+PrintGCDetails
 * -XX:+PrintCommandLineFlags  查看程序使用的默认JVM参数
 * -XX: +PrintFlagsFinal 打印最终值，如果某个默认值被新值覆盖，显示新值
 * java -jar -Xms10m -Xmx10m -Xss512
 * -Xmn
 * -XX:newRatio 新生代老年代大小
 */
public class JvmParam {

    public static void main(String[] args) throws InterruptedException {

        byte[] bytes = new byte[50* 1024 * 1024];
        System.out.println("hello GC");
        Thread.sleep(Integer.MAX_VALUE);

    }

    /**
     * 逃逸方法 对象在方法内部创建 但是返回值是该对象 这里属于栈上分配 逃逸对象
     */
    @Test
    public StringBuilder doescape() {
        StringBuilder builder = new StringBuilder();
        builder.append("a");
        builder.append("b");
        //强制终止 相当于kill -9
        Runtime.getRuntime().halt(9);
        //关闭的钩子

        Runtime.getRuntime().addShutdownHook(new Thread());


        return builder;
    }
}

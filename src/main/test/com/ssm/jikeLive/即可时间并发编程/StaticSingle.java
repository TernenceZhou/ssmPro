package com.ssm.jikeLive.即可时间并发编程;

/**
 * @author
 * @description
 * 通过静态内部类的 实现单例模式
 * @date 2019/7/29
 */
public class StaticSingle {

    /**
     * 内部类
     */
    private static class MySingleHandler{
        private static StaticSingle single = new StaticSingle();
    }

    private StaticSingle(){

    }

    public static StaticSingle getInstance(){
        return MySingleHandler.single;
    }
}

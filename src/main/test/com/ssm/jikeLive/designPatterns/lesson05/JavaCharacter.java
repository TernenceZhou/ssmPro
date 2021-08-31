package com.ssm.jikeLive.designPatterns.lesson05;

/**
 *
 * java的特性
 * 封装
 * 抽象
 * 继承
 * 多态
 * @author
 * @description
 * @date 2021/8/30
 */
public class JavaCharacter implements Inter01,Inter02{

    @Override
    public String jump() {
        return null;
    }

    @Override
    public void run() {

    }
}

class JavaCharacter02 extends Extend01 {

}

interface Inter01{
    String jump();

    default void run(){
        System.out.println("Inter01 run");
    }
}

interface Inter02{
    String jump();

    default void run(){
        System.out.println("Inter02 run");
    }
}

class Extend01 {
    public void swimming() {
        System.out.println("Extend01 swimming");
    }
}

class Extend02 {
    public void swimming() {
        System.out.println("Extend02 swimming");
    }
}
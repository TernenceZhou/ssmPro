package com.ssm.xiangxueClass.spring.class05.bean;

/**
 * @author
 * @description
 * 日志切面类
 * @date 2019/10/24
 */
public class LogAspect {
    private void logStart(){
        System.out.println("div 运行参数：{}......");
    }
    private void logEnd(){
        System.out.println("div 运行结束.......");

    }
    private void logReturn(){
        System.out.println("div 正常返回，运行结果是：{}......");

    }

    private void logException(){
        System.out.println("div 异常，异常信息是：{}.......");

    }

}

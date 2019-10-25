package com.ssm.xiangxueClass.spring.class05.aop;

import org.apache.commons.lang.builder.HashCodeBuilder;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.Signature;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;

import java.lang.reflect.Array;
import java.util.Arrays;

/**
 * @author
 * @description
 * 日志切面类
 * @date 2019/10/24
 */
@Aspect
public class LogAspect {


    //我们发现在每个注解中的表达式太冗余于是我们需要抽离公共部分出来

    /**
     * 抽取公共切入点表达式
     * 如果是在此类中直接使用：@Before("pointCut()")
     */
    @Pointcut("execution(* com.ssm.xiangxueClass.spring.class05.aop.Calculator.*(..))")
    public void pointCut(){

    }

    /**
     * 环绕通知
     * @param joinPoint
     * @return
     * @throws Throwable
     */
    @Around("pointCut()")
    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
        System.out.println("@Around....执行方法之前：");
        Object proceed = joinPoint.proceed();//通过反射执行方法
        System.out.println("@Around....执行方法之后：");

        Signature signature = joinPoint.getSignature();
        System.out.println("方法名称:"+signature.getName());
        Object[] args = joinPoint.getArgs();
        System.out.println("参数列表 args:"+ Arrays.asList(args));
        return proceed;
    }

    //在目标方法之前切入
    //切面表达式 *代表任意类或者参数等泛指 public int com.ssm.xiangxueClass.spring.class05.aop.Calculator.div(int ,int)
    //@Before("execution(* com.ssm.xiangxueClass.spring.class05.aop.Calculator.*(..))")
    @Before("pointCut()")
    private void logStart(){
        System.out.println("div 运行参数：{}......");
    }

    //不管执行成功异常都会执行
    //@After("execution(* com.ssm.xiangxueClass.spring.class05.aop.Calculator.*(..))")
    @After("pointCut()")
    private void logEnd(){
        System.out.println("div 运行结束.......");
    }

    @AfterReturning(value = "pointCut()",returning = "result")
    private void logReturn(Object result){
        System.out.println("div 正常返回，运行结果是：{}......"+result);

    }

    @AfterThrowing(value = "pointCut()",throwing = "exception")
    private void logException(Exception exception){
        System.out.println("div 异常，异常信息是：{}......."+exception);
    }

}

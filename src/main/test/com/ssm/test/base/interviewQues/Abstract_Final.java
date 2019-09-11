package com.ssm.test.base.interviewQues;

/**
 * @author
 * @description
 * abstract能用final修饰吗？final abstract
 * 答案是不能
 * 因为abstract本身是提供给人继承的
 * 而final修饰后类没法其他类的继承。所以双方冲突
 * @date 2019/9/10
 */
public abstract class Abstract_Final {
    private static  final int COUNT = 0;

    public void add(int a) {
        this.submit();
    }

    abstract void submit();

}

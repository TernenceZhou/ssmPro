package com.ssm.xiangxueClass.thread.lesson_09.safeClass;


/**
 * 类说明：不可变的类
 *
 * 使用final修饰变量 它的引用不变
 * 不能改变类的变量，只有通过构造器初始化传递值
 *  类不提供set方法
 *
 *  常见的不可变类：String
 *  还有基本类型的包装类都是不可变类
 */
public class ImmutableFinal {
    private final int a;
    private final int b;

    public ImmutableFinal(int a, int b) {
        this.a = a;
        this.b = b;
    }

    public int getA() {
        return a;
    }

    public int getB() {
        return b;
    }

    public static void main(String[] args) {
        ImmutableFinal immutableFinal = new ImmutableFinal(1,2);
        System.out.println(
                immutableFinal.getA()
                +"  "
                +immutableFinal.getB()
        );
        //以下表达式不成立 ，所以当前类是一个不可变的类
        //immutableFinal.a = 1;
    }
}

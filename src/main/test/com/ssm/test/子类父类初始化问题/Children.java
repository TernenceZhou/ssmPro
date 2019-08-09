package com.ssm.test.子类父类初始化问题;

import org.junit.Test;

/**
 * @author
 * @description
 * @date 2019/8/1
 */
public class Children extends PeoPle{
    PeoPle father;
    public Children(){
        System.out.println(3);
    }
    public Children(String name){
        System.out.println(4);
        this.name = name;
        father = new PeoPle(name);
       //PeoPle father = new PeoPle(name);

    }

    /**
     * 结果 1 4 2
     * 继承父类后 会默认的调用父类的无参构造方法
     * @param args
     */
    public static void main(String[] args) {
        new Children("abc");
//        new PeoPle("123");
    }
}

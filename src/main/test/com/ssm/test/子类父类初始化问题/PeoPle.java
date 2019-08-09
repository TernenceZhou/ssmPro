package com.ssm.test.子类父类初始化问题;

import org.junit.Test;

/**
 * @author
 * @description
 * @date 2019/8/1
 */
public class PeoPle {
    String name;

    public PeoPle(){
        System.out.println("1");
    }
    public PeoPle(String name){
        System.out.println("2");
        this.name = name;
    }


}

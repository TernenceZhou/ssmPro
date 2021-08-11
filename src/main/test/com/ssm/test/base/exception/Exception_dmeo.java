package com.ssm.test.base.exception;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @author
 * @description
 * @date 2021/7/30
 */
public class Exception_dmeo {
    class A {
        private int a;
        public int getA() {
            return a;
        }
    }

    class B <T> {
        public void methodB(A a){
            a.getA();
        }
    }

    /**
     * 以下不通过
     * @param <A>
     */
    class BB<A> {
        public void methodB(A a){
            //a.getA();     //直接异常 编译不通过
        }
    }

    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        add(list, new Date());
        System.out.println(list.get(0));
    }

    public static void add(List list,Object object) {
        list.add(object);
    }
}

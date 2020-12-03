package com.ssm.test.base.interviewQues;

/**
 * @author
 * @description
 * @date 2019/9/11
 */
public class IntegerCompare {

    /*@Test
    public void compare(){

        Integer a = new Integer(3);
        Integer b = 3;
        int c = 3;
        Integer d = 3;
        //----------

        Integer e = new Integer(2);;
        Integer f = new Integer(2);;
        //----------

        System.out.println(a == b);
        System.out.println(a == c );
        System.out.println(b == d);
        System.out.println(e == f);

    }*/
    public static void main(String[] args) {
        /*****************************/
        /*Integer a = new Integer(3);
        Integer b = 3;
        int c = 3;
        Integer d = 3;
        //----------

        Integer e = new Integer(2);
        Integer f = new Integer(2);
        //----------

        System.out.println(a == b);
        System.out.println(a == c );
        System.out.println(b == d);
        System.out.println(e == f);*/
        /*****************************/


        Integer a = 1;
        Integer b = 2;
        Integer c = 3;
        Integer d = 3;
        Integer e = 321;
        Integer f = 321;
        Long g = 3L;
        Long h = 2L;
        System.out.println(c == d);
        System.out.println(e == f);
        System.out.println(c == (a + b));// (a+b)、== 过程发生了自动拆箱intValue()
        System.out.println(c.equals((a+b)));//equals是比较两个对象内容 对象之间比较 (a+b)整体是装箱，想加是拆箱
        System.out.println(g == (a+b));//g.longValue()
        System.out.println(g.equals(a+b));
        System.out.println(g.equals(a+h));
        //原文链接：https://blog.csdn.net/teacher_lee_zzsxt/article/details/79230501

        /**
         * 编译结果
         *  public static void main(String args[])
         *     {
         *         Integer integer = Integer.valueOf(1);
         *         Integer integer1 = Integer.valueOf(2);
         *         Integer integer2 = Integer.valueOf(3);
         *         Integer integer3 = Integer.valueOf(3);
         *         Integer integer4 = Integer.valueOf(321);
         *         Integer integer5 = Integer.valueOf(321);
         *         Long long1 = Long.valueOf(3L);
         *         Long long2 = Long.valueOf(2L);
         *         System.out.println(integer2 == integer3);
         *         System.out.println(integer4 == integer5);
         *         System.out.println(integer2.intValue() == integer.intValue() + integer1.intValue());
         *         System.out.println(integer2.equals(Integer.valueOf(integer.intValue() + integer1.intValue())));
         *         System.out.println(long1.longValue() == (long)(integer.intValue() + integer1.intValue()));
         *         System.out.println(long1.equals(Integer.valueOf(integer.intValue() + integer1.intValue())));
         *         System.out.println(long1.equals(Long.valueOf((long)integer.intValue() + long2.longValue())));
         *     }
         */
    }
}

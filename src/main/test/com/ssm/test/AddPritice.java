package com.ssm.test;

/**
 * @author
 * @description
 * @date 2020/12/3
 */
public class AddPritice {

    public static void main(String[] args) {
//        int b = 100;
//        b += (++b);// i  =  i +  (++i)   201
//        System.out.println(b);
//
//        int i = 100;
//        i += (i++);// i  =  i +  (i++)   200
//        System.out.println(i);

        int i = 100;
        i = i++ + i;
        System.out.println(i);
        int j = 100;
        j += j++;
        System.out.println(j);
    }
}

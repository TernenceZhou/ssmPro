package com.ssm.test.HashCode_and_equals;

import com.google.common.collect.Lists;
import org.junit.Test;

import java.util.*;

public class TestEqAndHash {

    @Test
    public void test(){
        LinkedList list = new LinkedList();
        Set<Student> set = new HashSet<>();
        Student s1 = new Student(1,"stu1");
        Student s2 = new Student(1,"stu1");
        list.add(s1);
        list.add(s2);
        set.add(s1);
        set.add(s2);
        System.out.println("s1.equals(s2) :"+s1.equals(s2));
        System.out.println("s1 == s2:"+(s1 == s2));
        System.out.println("list.size():"+list.size());
        System.out.println("set.size() "+set.size());
        System.out.println("s1.hashCode() == s2.hashCode() "+(s1.hashCode() == s2.hashCode()));
        //如果要样s1.equals(s2) 为true  需要自定义重写equals 和hashcode
        //通过静态类Collections创建线程安全的list集合
        List list1 = Collections.synchronizedList(list);

    }
}

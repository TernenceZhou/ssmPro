package com.ssm.test;

import org.apache.commons.lang.ArrayUtils;

import java.util.Arrays;
import java.util.List;

public class DeepCopy implements Cloneable{
    String id;
    String name;
    Child child;

    @Override
    protected Object clone() throws CloneNotSupportedException {

        return super.clone();
    }

    public static void main(String[] args) throws CloneNotSupportedException{
        DeepCopy d = new DeepCopy();
        d.id = "123";
        d.name = "234";
        d.child = new Child();
        d.child.id  = "id";
        d.child.name = "name";

        DeepCopy clone = (DeepCopy)d.clone();
        System.out.println(" d == clone: "+(d == clone));
        System.out.println(" d.id == clone.id: "+(d.id == clone.id));
        System.out.println(" d.hashCode() == clone.hashCode() "+(d.child.hashCode() == clone.child.hashCode()));
        System.out.println(d.child == clone.child);
        System.out.println("=====================================");

        System.out.println(" d.child == clone.child "+(d.child == clone.child));
        System.out.println(" d.hashCode() == clone.hashCode() "+(d.child.hashCode() == clone.child.hashCode()));
        Integer[] ints = ArrayUtils.toObject(new int[]{1, 2});
        List<Integer> asList = Arrays.asList(ints);
    }
}

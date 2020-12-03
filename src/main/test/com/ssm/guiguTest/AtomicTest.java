package com.ssm.guiguTest;

import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;
import java.util.concurrent.atomic.AtomicStampedReference;

/**
 * @author
 * @description
 * @date 2020/11/30
 */
public class AtomicTest {

    public static void main(String[] args) {

        //atomicReferenceAndAtomicInteger();

        atomicStampedReference();
    }

    /**
     *
     * AtomicStampedReference 解决cas中的 ABA 问题.
     */
    private static void atomicStampedReference() {
        AtomicInteger ato = new AtomicInteger(5);
        int stamp = 1;
        AtomicStampedReference asr = new AtomicStampedReference(ato, stamp);

        AtomicInteger newReference1 = new AtomicInteger(6);
        asr.compareAndSet(ato, newReference1, stamp, stamp + 1);
        System.out.println(asr.getReference() + "-----" + asr.getStamp());

        AtomicInteger newReference2 = new AtomicInteger(7);
        asr.compareAndSet(newReference1, newReference2, 2, stamp + 1);
        System.out.println(asr.getReference() + "-----" + asr.getStamp());
    }

    /**
     * AtomicReference 原子的操作对象 ，泛型可以为任何对象 Object
     * AtomicInteger 只能是Integer 整数的封装
     */
    private static void atomicReferenceAndAtomicInteger() {

        AtomicReference<Integer> ar = new AtomicReference<>();
        Integer a3 = new Integer(3);
        ar.set(a3);
        ar.compareAndSet(a3, new Integer(5));
        System.out.println(ar.get());   // 5

        int a = 1;
        AtomicInteger at = new AtomicInteger(a);
        at.compareAndSet(1, 4);
        System.out.println(at.get());
    }
}

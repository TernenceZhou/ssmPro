package com.ssm.jikeLive.designPatterns.lesson05;

import java.util.Iterator;
import java.util.function.Consumer;

import com.ssm.jikeLive.designPatterns.lesson08.MockInteface;

/**
 * 用接口来实现多态的特性.
 */
public class Polymorphism {

    public static void main(String[] args) {
        Iterator arrayIterator = new MyArray();
        print(arrayIterator);

        Iterator linkedIterator = new MyLinkedList();
        print(linkedIterator);


    }


    static public void print(Iterator iterator) {
        if (iterator.hasNext()) {
            Object next = iterator.next();
            System.out.println(next);
        }
    }

    static class MyArray implements Iterator {

        @Override
        public boolean hasNext() {
            return true;
        }

        @Override
        public Object next() {
            return "MyArray";
        }

        @Override
        public void remove() {

        }

        @Override
        public void forEachRemaining(Consumer action) {

        }
    }
    static class MyLinkedList implements Iterator {

        @Override
        public boolean hasNext() {
            return true;
        }

        @Override
        public Object next() {
            return "MyLinkedList";
        }

        @Override
        public void remove() {

        }

        @Override
        public void forEachRemaining(Consumer action) {

        }
    }

}

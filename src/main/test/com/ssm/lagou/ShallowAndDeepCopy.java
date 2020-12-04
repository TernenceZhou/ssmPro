package com.ssm.lagou;

import lombok.Data;

/**
 * 深拷贝和浅拷贝实现.
 * 1.什么是深拷贝
 *   深拷贝：
 * 2.什么是浅拷贝
 */
public class ShallowAndDeepCopy {

    public static void main(String[] args) {

    }

    @Data
    static class User {
        private String name;
        private int age;
        private Address address;
    }

    @Data
    static class Address {

        private String cityId;
        private String cityName;

    }
}



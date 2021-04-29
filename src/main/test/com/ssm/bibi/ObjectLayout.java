package com.ssm.bibi;

import org.openjdk.jol.info.ClassLayout;

/**
 * @author
 * @description
 * @date 2021/4/21
 */
public class ObjectLayout {

    public static void main(String[] args) {
        User user = new User();
        user.setAge(12);
        String s = ClassLayout.parseInstance(user).toPrintable();
        System.out.println(s);
    }

    static class User {
        private String name;
        private int age;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public int getAge() {
            return age;
        }

        public void setAge(int age) {
            this.age = age;
        }
    }
}

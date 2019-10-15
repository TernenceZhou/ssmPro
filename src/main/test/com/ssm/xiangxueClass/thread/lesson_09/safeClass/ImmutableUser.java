package com.ssm.xiangxueClass.thread.lesson_09.safeClass;

/**
 * 类说明：看起来不可变的类，实际是可变的
 */
public class ImmutableUser {
    private final int a;
    private final int b;
    private final User user = new User(20);//这里类就不是线程安全的了

    public ImmutableUser(int a, int b) {
        super();
        this.a = a;
        this.b = b;
    }

    public int getA() {
        return a;
    }

    public int getB() {
        return b;
    }

    private static class User{
        private int age;

        public User(int age) {
            this.age = age;
        }

        public int getAge() {
            return age;
        }

        public void setAge(int age) {
            this.age = age;
        }
    }

    public static void main(String[] args) {

    }
}

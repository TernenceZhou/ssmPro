package com.ssm.xiangxueClass.thread.lesson_09.safeClass;

import org.junit.Test;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;

/**
 * @author
 * @description
 * 深拷贝、 浅拷贝
 * 深拷贝浅拷贝都是对已有的对象的操作
 *  //浅拷贝 对基本数据类型进行值传递，对象是引用传递
 *  //深拷貝 对基本数据类型进行值传递，引用类型的数据 ,新建，并把 值 赋值给新建立对象
 *  1、使用序列化,把对象通过序列化加入到IO流中，然后再通过反序列化从流读出来
 *  2/或者实现Cloneable接口实现clone方法
 *
 * https://www.cnblogs.com/plokmju/p/7357205.html
 * @date 2019/9/5
 */
public class DeepCopy  {
    private static class User implements Serializable{
        private String name;
        private UserChild child;

        public User(String name) {
            this.name = name;
        }

        public User(String name, UserChild child) {
            this.name = name;
            this.child = child;
        }

        public String getName() {
            return name;
        }

        public User deep() {
            //放进流里面
            ByteArrayOutputStream os = new ByteArrayOutputStream();
            try {

                ObjectOutputStream oos = new ObjectOutputStream(os);
                oos.writeObject(this);
                //流读出来
                ByteArrayInputStream bis = new ByteArrayInputStream(os.toByteArray());
                ObjectInputStream ois = new ObjectInputStream(bis);
                return (User) ois.readObject();

            } catch (IOException | ClassNotFoundException e) {
                e.printStackTrace();
            }
            return null;

        }

        @Override
        public String toString() {
            return "重写";
        }
    }

    private static class UserChild extends User{

        public UserChild(String name) {
            super(name);
        }
    }

    private static class User2 implements Cloneable{
        private String name;
        private UserChild2 child;

        public User2(String name) {
            this.name = name;
        }

        public User2(String name, UserChild2 child) {
            this.name = name;
            this.child = child;
        }

        public String getName() {
            return name;
        }

        @Override
        protected Object clone() throws CloneNotSupportedException {
            //浅拷贝
             //return super.clone();
            //深拷贝：子类和父类都要实现cloneable接口，调用clone方法
            User2 user2 = (User2)super.clone();
            //user2.child = (UserChild2) this.child.clone();
            user2.child = new UserChild2("child2");
            return user2;
        }

        @Override
        public String toString() {
            return "重写";
        }
    }
    private static class UserChild2 extends User implements Cloneable{
        @Override
        protected Object clone() throws CloneNotSupportedException {
            return super.clone();
        }

        public UserChild2(String name) {
            super(name);
        }
    }

    /**
     * 测试用序列化实现深拷贝测试
     */
    @Test
    public void test(){
        User user = new User("user",new UserChild("child"));
        System.out.println(user.hashCode());
        System.out.println(user.getName());

        User userCopy = user.deep();

        //deep.name = "b";
        System.out.println(userCopy.hashCode());
        System.out.println(userCopy.getName());

        //System.out.println(deep.toString());
        System.out.println(user.child.getName()+" "+userCopy.child.getName());
        System.out.println("user.child == userCopy.child :" + (user.child == userCopy.child));
        //hashcode不同了，已经是经过深拷贝。拷贝的是新的对象
        System.out.println("user.child.hashCode() == userCopy.child.hashCode() :  "+(user.child.hashCode() == userCopy.child.hashCode()));
    }

    /**
     * 测试实现
     */
    @Test
    public void test2() throws CloneNotSupportedException {
        User2 user = new User2("user2",new UserChild2("child2"));
        System.out.println(user.hashCode());
        System.out.println(user.getName());

        //clone后的对象
        User2 userClone = (User2)user.clone();

        System.out.println("user clone后的对象："+userClone.hashCode());
        System.out.println("user clone后的对象："+userClone.getName());
        //如果是浅拷贝 hashcode是一样的，证明浅拷贝没有对类中的child对象进行拷贝
        //如果是深拷贝 hashcode是不一样的，证明拷贝的对象是新建的
        System.out.println("user.child.hashCode() == userCopy.child.hashCode() :  "+(user.child.hashCode() == userClone.child.hashCode()));


    }
}

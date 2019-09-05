package com.ssm.test.xiangxueClass.thread.lesson_09.safeClass;

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
        System.out.println("user.child.hashCode() == userCopy.child.hashCode() :  "+(user.child.hashCode() == userCopy.child.hashCode()));

    }
}

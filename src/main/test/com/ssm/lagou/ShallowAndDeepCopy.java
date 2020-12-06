package com.ssm.lagou;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.ssm.lagou.深浅克隆.Address;
import com.ssm.lagou.深浅克隆.MyUser;
import com.sun.xml.internal.messaging.saaj.client.p2p.HttpSOAPConnectionFactory;
import org.apache.commons.lang.SerializationUtils;

import java.io.*;

/**
 * 深拷贝和浅拷贝实现.
 * 1.什么是深拷贝
 * 深拷贝：
 * 2.什么是浅拷贝
 */
public class ShallowAndDeepCopy {

    public static void main(String[] args) throws CloneNotSupportedException {

        /**
         * method 1 : 对象都实现 cloneAble接口
         * 实现clone方法
         *
         * method 2: 使用构造方法 也是 effective 推荐的方法
         *
         * method 3 : 通过字节流 序列化 反序列化 实现深拷贝
         *  先写到内存中 ，然后通过字节流读取出来
         *  通过字节流序列化实现的深克隆，因此每个对象必须能被序列化，
         *  必须实现 Serializable 接口，标识自己可以被序列化，否则会抛出异常 (java.io.NotSerializableException)。
         *
         * method 4 : 第三方工具实现深克隆 Apache Commons Lang
         *
         * method 5 : 使用fastJson
         *
         *
         *
         */
        //objectClone();

        //contructClone();

        //serialableClone();


        //SerialutilsClone();


        PersonAddr address = new PersonAddr(111, "城市1");
        Person p1 = new Person(33, "我爱地方", address);
        JSONObject json = new JSONObject();
        String s = JSON.toJSONString(p1);
        JSON.parseObject(s,Person.class);

    }

    private static void SerialutilsClone() {
        /**
         * 底层使用的字节流 序列化 ，相比自己手动 提供现成操作方法
         */
        PersonAddr address = new PersonAddr(111, "城市1");
        Person p1 = new Person(33, "我爱地方", address);

        Person p2 = (Person) SerializationUtils.clone(p1);
        p1.getAddress().setCityName("城市2");

        System.out.println(
                "p1: " + p1.getAddress().getCityName()
                        + "\n" +
                        "p2: " + p2.getAddress().getCityName()
        );
    }

    private static void serialableClone() {
        PersonAddr address = new PersonAddr(111, "城市1");
        Person p1 = new Person(33, "我爱地方", address);

        Person p2 = StreamObject.cloneObj(p1);

        p1.getAddress().setCityName("城市2");

        System.out.println(
                "p1: " + p1.getAddress().getCityName()
                        + "\n" +
                        "p2: " + p2.getAddress().getCityName()
        );
    }


    private static void contructClone() {
        PersonAddr address = new PersonAddr(111, "城市1");
        Person p1 = new Person(33, "我爱地方", address);

        Person p2 = new Person(p1.getAge(), p1.getName(), new PersonAddr(address.getCityId(), address.getCityName()));

        p1.getAddress().setCityName("上海");

        System.out.println(
                "p1: " + p1.getAddress().getCityName()
                        + "\n" +
                        "p2: " + p2.getAddress().getCityName()
        );
    }

    private static void objectClone() throws CloneNotSupportedException {
        //-------------method 1--------------------------
        Address ad = new Address("111", "重庆");

        MyUser u1 = new MyUser("zs", 14, ad);
        MyUser u2 = u1.clone();

        //修改u1
        u1.getAddress().setCityId("222");

        //对象实现cloneAble接口 实现深拷贝
        System.out.println(" u1 age:  " + u1.getAddress().getCityId());
        System.out.println(" u2 age:  " + u2.getAddress().getCityId());

        /**
         * 通过结果发现： 在我们修改原型对象的引用类型对象属性值后 克隆对象并没有被修改
         */
        //-------------method 2--------------------------
    }


    static class Person implements Serializable{
        private int age;
        private String name;
        private PersonAddr address;

        public Person(int age, String name, PersonAddr address) {
            this.age = age;
            this.name = name;
            this.address = address;
        }

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

        public PersonAddr getAddress() {
            return address;
        }

        public void setAddress(PersonAddr address) {
            this.address = address;
        }
    }

    static class PersonAddr implements Serializable{
        private Integer cityId;
        private String cityName;


        public PersonAddr(Integer cityId, String cityName) {
            this.cityId = cityId;
            this.cityName = cityName;
        }

        public Integer getCityId() {
            return cityId;
        }

        public void setCityId(Integer cityId) {
            this.cityId = cityId;
        }

        public String getCityName() {
            return cityName;
        }

        public void setCityName(String cityName) {
            this.cityName = cityName;
        }
    }


    /**
     * 克隆对象工具类.
     */
    static class StreamObject {

        private static <T extends  Serializable> T cloneObj(T obj) {
            T cloneObj = null;
            ObjectOutputStream os = null;
            ObjectInputStream ois = null;
            try {
                ByteArrayOutputStream bao = new ByteArrayOutputStream();
                os = new ObjectOutputStream(bao);
                os.writeObject(obj);
                //read Object
                ByteArrayInputStream bi = new ByteArrayInputStream(bao.toByteArray());
                ois = new ObjectInputStream(bi);
                cloneObj = (T) ois.readObject();
                return cloneObj;
            } catch (IOException e) {
                e.printStackTrace();
            } catch (ClassNotFoundException e) {
                e.printStackTrace();
            } finally {
                try {
                    if (ois != null)
                        ois.close();
                    if (os != null)
                        os.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            return cloneObj;
        }
    }
}



package com.ssm.test.serializeAble;

import java.io.*;

/**
 *
 */
public class SerializableDemo {

    public static void main(String[] args) {
        //序列化对象到文件中
        objectOut();
        //反序列化对象
        Person o = (Person)objectInput();
        System.out.println(o.getName() +"   "+o.getSex() +"  "+o.getAge());
    }

    /**
     * 通过对象输出流把序列输出到指定的流到文件中
     */
    public static void objectOut(){
        Person person = new Person();
        person.setAge(12);
        person.setName("abc");
        person.setSex("男");
        ObjectOutputStream oos = null;
        FileOutputStream fos = null;
        File file =null;
        try{
            file = new File("D:\\person.txt");
            fos  = new FileOutputStream(file);
            oos = new ObjectOutputStream(fos);
            oos.writeObject(person);
        }catch (IOException e){

        }finally {
            try {
                oos.close();
                fos.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public static Object objectInput(){
        ObjectInputStream ois = null;
        FileInputStream fis = null;
        File file =null;
        Object object = null;

        try{
            file = new File("D:\\person.txt");
            fis  = new FileInputStream(file);
            ois = new ObjectInputStream(fis);
            object = ois.readObject();

        }catch (IOException e){

        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } finally {
            try {
                ois.close();
                fis.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return object;
    }
}

package com.ssm.xiangxueClass.thread.lesson_09.safeClass;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;

/**
 * @author
 * @description
 * 序列化和反序列化的使用
 * @date 2019/11/29
 */
public class SerializableClass {


    public static void main(String[] args) {
        writeObjct();
    }
    //序列化对象到文件中
    public static void writeObjct(){
        //对象输出流 可以用writeObect把字节序列写到目标输出流中
        Person person = new Person();
        person.setAge(12);
        person.setName("name");
        person.setSex("23");
        File f = null;
        FileOutputStream fos = null;
        ObjectOutputStream outputStream= null;
        try {
            f =  new File("D:\\person.txt");
            fos = new FileOutputStream(f);
            outputStream = new ObjectOutputStream(fos);
            outputStream.writeObject(person);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}

package com.ssm.test.fileWriteOrRead.excel;

import org.apache.commons.io.input.ReaderInputStream;
import org.junit.Test;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.ObjectInputStream;
import java.io.Reader;

/**
 * @author
 * @description
 * @date 2019/12/6
 */
public class Demo01 {
    @Test
    public void start() throws IOException {
        Resource resource = new ClassPathResource("");
        File file = resource.getFile();
        File f = new File("E:\\read.txt");
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        ByteArrayInputStream bis = new ByteArrayInputStream(bos.toByteArray());
        ObjectInputStream oi = new ObjectInputStream(new FileInputStream(f));
        int tempByte;
        while ( -1 != (tempByte = oi.read())){
            System.out.println((char) tempByte);
        }

        BufferedReader reader = null;
        FileReader fileReader = new FileReader(new File("E:\\read.txt")); //
        InputStreamReader inputStreamReader = new InputStreamReader(new FileInputStream(
                new File("E:\\read.txt")),"UTF-8");
        reader = new BufferedReader(inputStreamReader);

        //一次读取一个字符
        int singleChar = 0;
        while ((singleChar = reader.read()) != -1){
            System.out.println("一次读取一个字符："+ (char)singleChar);
        }

        //一行一行读取
        String line;
        while ((line = (reader.readLine())) != null ){
            System.out.println(
                    line
                    //new String(line.getBytes("GBK"),"UTF-8")
            );
        }
        //一次读取多个字符
        int charread = 0;
        char[] tempchars = new char[30];
        while ((charread = (reader.read(tempchars))) != -1){
            System.out.println(tempchars);
        }
    }
}

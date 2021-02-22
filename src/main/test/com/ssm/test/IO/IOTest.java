package com.ssm.test.IO;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.nio.charset.Charset;

import org.junit.Test;

/**
 * 字符流直接流相互转换.
 */
public class IOTest {

    @Test
    public void byteToChar() throws IOException {
        try (InputStreamReader ir = new InputStreamReader(new FileInputStream(new File("D:\\a.txt")), Charset.forName("UTF-8"))) {
            char c[] = new char[1024];
            int len = ir.read(c);
            String s = new String(c, 0, len);
            System.out.println(s);
        }
    }

    @Test
    public void charToByte() throws IOException {
        //字符流  to 字节
        File file = new File("D:\\a.txt");
        OutputStreamWriter ow = new OutputStreamWriter(new FileOutputStream(file), "UTF-8");
        ow.write("我是字符流转换成字节流输出的");
        ow.close();
    }

    @Test
    public void Test19() throws Exception {
        InputStream in = new FileInputStream("D:\\a.txt");// 读取文件的数据,注意文件编码为UTF-8,防止读取乱码
        // 将输入的字节流  ------转换成---->  字符流
        InputStreamReader isr = new InputStreamReader(in, "UTF-8");// 读取
        char[] data = new char[1024];
        int len = isr.read(data);//读取字符流中的数据，用char[]数组一次性接收
        System.err.println(new String(data, 0, len));
        isr.close();
    }



    @Test
    public void byteArrayInput() {
        String hello = "hello world";
        byte[] bytes = hello.getBytes();

        try (final ByteArrayInputStream inputStream = new ByteArrayInputStream(bytes)) {
            int c;
            inputStream.read();
            while ((c = inputStream.read()) != -1) {
                System.out.print((char) c);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

}

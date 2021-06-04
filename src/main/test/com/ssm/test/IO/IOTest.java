package com.ssm.test.IO;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
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

    /**
     * 传统方式 读写文件.
     * 时间20+ ms
     */
    @Test
    public void NoBufferInputStream() {
        long begin = System.currentTimeMillis();
        try (FileInputStream input = new FileInputStream("E:/a.png"); FileOutputStream output = new FileOutputStream("E:/aa.png")) {
            byte[] bytes = new byte[1024];
            int i;
            while ((i = input.read(bytes)) != -1) {
                output.write(bytes, 0, i);
            }
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("复制文件发生异常");
        }
        System.out.println("常规流读写，总共耗时ms：" + (System.currentTimeMillis() - begin));
    }

    /**
     * 用缓冲流去复制  减少IO次数，提高读写效率。
     * 只有个位数的ms
     * 不带缓冲流 当读取到一个字符或一个字节的时候 就会直接输出数据了
     * 而缓冲流 当达到了缓冲区的最大值 才会一次性输出数据
     */
    @Test
    public void bufferIoCopy() {
        long start = System.currentTimeMillis();
        try {
            FileInputStream fi = new FileInputStream("E:/a.png");
            FileOutputStream fo = new FileOutputStream("E:/aaa.png");
            BufferedInputStream bis = new BufferedInputStream(fi);
            BufferedOutputStream bos = new BufferedOutputStream(fo);
            byte b[] = new byte[1024];
            int i;
            while ((i = bis.read(b)) != -1) {
                bos.write(b,0,i);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println("常规流读写，总共耗时ms：" + (System.currentTimeMillis() - start));

    }
}

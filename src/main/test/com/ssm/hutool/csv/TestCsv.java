package com.ssm.hutool.csv;

import cn.hutool.core.text.csv.CsvUtil;
import cn.hutool.core.text.csv.CsvWriter;
import cn.hutool.core.util.CharsetUtil;
import org.junit.Test;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;

/**
 * @author
 * @description
 * @date 2020/8/27
 */
public class TestCsv {

    @Test
    public void csvT(){
        //指定路径和编码
        CsvWriter writer = CsvUtil.getWriter("D:\\files\\estWrite.csv", CharsetUtil.CHARSET_UTF_8);
        //按行写出
        for (int i = 0; i < 200000; i++) {
            writer.write(
                    new String[] {"a1", "b1", "c1"},
                    new String[] {"a2", "b2", "c2"},
                    new String[] {"a3", "b3", "c3"}
            );
        }

    }

    @Test
    public void csv() {

        FileInputStream fi = null;
        File file = new File("d:\\a.csv");
        OutputStreamWriter ow =null;
        FileOutputStream fo = null;

        try{

            ow = new OutputStreamWriter(fo);
            ow.write("123");

        }catch (Exception  e) {

        }


    }
}

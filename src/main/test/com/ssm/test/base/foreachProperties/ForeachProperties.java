package com.ssm.test.base.foreachProperties;

import org.junit.Test;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

/**
 * @author
 * @description
 * @date 2020/1/8
 */
public class ForeachProperties {

    /**
     * 遍历资源文件内容
     * @throws IOException
     */
    @Test
    private void test01() throws IOException {
        Properties prop = new Properties();
        prop.load(
                //YZTCardChange.class.getClassLoader().getResourceAsStream("messages.properties")
                new FileInputStream("D:\\java\\intellij_workSpace_2018_2.7\\cango-kf\\webapp\\src\\main\\resources\\messages.properties")
        );
        Map<String,String> map = new HashMap<>();
        //遍历方式1：
        prop.forEach((k,v)->{
            System.out.println(k);
            System.out.println(v);
        });
        //遍历方式2: 遍历后加入到一个map中
        Enumeration<?> propertyNames = prop.propertyNames();
        while (propertyNames.hasMoreElements()) {
            String key = (String) propertyNames.nextElement();
            String value = (String) prop.get(key);
            map.put(key,value);
        }
        map.forEach((k,v)->{
            System.out.println("key:"+k);
            System.out.println("value:"+v);
        });
    }
}

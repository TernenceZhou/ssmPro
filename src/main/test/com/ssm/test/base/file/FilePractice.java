package com.ssm.test.base.file;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Supplier;

import org.junit.Test;

import com.alibaba.fastjson.JSON;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * @author
 * @description
 * @date 2020/8/26 paths -->file
 * 关于文件相关的操作类
 */
public class FilePractice {



    @Test
    public void fileToPath(){
        File file = new File("D:\\tmp\\晋城抵押服务费2020-08-25.xlsx");
        Path path = file.toPath();
        System.out.println(path);

        Path path1 = Paths.get("D:\\tmp\\晋城抵押服务费2020-08-25.xlsx");
        File toFile = path1.toFile();
        System.out.println(toFile);
    }

    @Test
    public void mapToJson(){

        ObjectMapper mapper = new ObjectMapper();

        Map<String, String> map = new HashMap<>();
        map.put("name", "mkyong");
        map.put("age", "37");

        // method one
        System.out.println(JSON.toJSONString(map));
        try {

            // convert map to JSON string
            String json = mapper.writeValueAsString(map);

            System.out.println(json);   // compact-print

            json = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(map);

            System.out.println(json);   // pretty-print

        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

    }

    @Test
    public void jsonToMap(){
        ObjectMapper mapper = new ObjectMapper();
        String json = "{\"name\":\"mkyong\", \"age\":\"37\"}";

        try {

            // convert JSON string to Map method one
            Map<String, String> map = mapper.readValue(json, Map.class);
            //convert JSON string to Map method two
            Map map1 = JSON.parseObject(json, Map.class);
            System.out.println(map1);
            // it works
            //Map<String, String> map = mapper.readValue(json, new TypeReference<Map<String, String>>() {});

            System.out.println(map);

        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    @Test
    public void lambda(){
        List<String> list = Arrays.asList("node", "java", "python", "ruby");
        list.forEach(System.out::println);

        // lambda
        Supplier<Map> obj1 = () -> new HashMap();   // default HashMap() constructor
        Map map1 = obj1.get();

        Supplier<List> arr = ArrayList::new;

        String   a = "123";
        String substring = a.substring(-1);
        System.out.println(substring);

    }
}

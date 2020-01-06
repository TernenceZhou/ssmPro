package com.ssm.test.Json;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

/**
 * @author
 * @description
 * @date 2020/1/6
 * JSON相关小demo
 */
public class JsonTest {


    /**
     * 如果req实体中有集合类型的数据结构
     * 用数组的形式传递
     * 下面是如何构建json数组格式的方式
     * "xxx":[{"":""},{"":""}]
     */
    @Test
    public void test01() {

        JSONObject object = new JSONObject();
        OcrInfo or = new OcrInfo();
        or.setName("a");
        or.setAddress("address");
        or.setNation("01");
        OcrInfo or2 = new OcrInfo();
        or2.setName("b");
        or2.setAddress("address2");
        or2.setNation("02");
        List ocrs = new ArrayList();
        ocrs.add(or);
        ocrs.add(or2);

        object.put("orcss", ocrs);
        System.out.println(JSON.toJSONString(object));
        //array中放两个对象，构成数组
        JSONArray array = new JSONArray();
        array.add(or);
        array.add(or2);
        System.out.println(array.toJSONString());
    }
}

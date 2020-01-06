package com.ssm.test.base.base64ToPDF;

import com.alibaba.fastjson.JSONObject;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.List;
import java.util.Map;

/**
 * 将文件中的base64报文解密后  转换为pdf.
 */
public class Bae64ToPDFFromTxt{
    public static void main(String[] args) throws IOException {

        Path path = Paths.get("D:\\fininst6.txt");
        StringBuffer builder = new StringBuffer();
        Files.readAllLines(path).stream().forEach(t -> builder.append(t));
        JSONObject jsonObject = JSONObject.parseObject(builder.toString());
        List<Map<String, String>> list = (List) jsonObject.get("obj");
        //目标文件存放路径
        String des = "D:\\fininst6";
        list.forEach(p -> {
            String content = p.get("content");
            byte[] bytes = Base64.getDecoder().decode(content);
            String name = p.get("contractName");
            Path path1 = Paths.get(des + File.separator + name);
            if (!Files.exists(path1)) {
                try {
                    Files.createFile(path1);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            try {
                Files.write(path1, bytes);
            } catch (IOException e) {
                e.printStackTrace();
            }
        });

    }
}

package com.ssm.xiangxueClass.thread.lesson_09.safeClass;

import org.junit.Test;

import java.io.File;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author
 * @description
 * @date 2019/12/2
 */
public class RecursionDir {
    static List<String>  classNames = new ArrayList<String>();

    private static Map<String,Object> pathMap = new HashMap<>();
    private static String str = "com.ssm.xiangxueClass.thread.lesson_09.safeClass";
    public static void main(String[] args) {
        //scanPackage(str);
//        for (Map.Entry<String,Object> entry:pathMap.entrySet()){
//            System.out.println(entry.getKey()+ "  "+entry.getValue() );
//        }
        for (String className : classNames) {
            System.out.println(className);
        }
    }
    @Test
    public void test(){
        scanPackage("com.ssm.xiangxueClass.thread.lesson_09.safeClass");
        for (String className : classNames) {
            System.out.println(className);
        }
    }
    @Test
    public void compare(){
        System.out.println(999==999.00);
    }


    public String scanPackage(String basePackage) {
        String replaceAll = basePackage.replaceAll("\\.", "/");
        URL url = RecursionDir.class.getClass().getClassLoader().getResource("/"+ replaceAll);
        String fileStr = url.getFile();
        File file = new File(fileStr);
        //拿到所有文件夹
        String[] list = file.list();
        for (String path : list) {
            File f = new File(fileStr + path);
           if(f.isDirectory()){
               scanPackage(basePackage+"."+path);
           }else {
               System.out.println(path +"."+f.getName());
               classNames.add(path +"."+f.getName());
           }
        }
        return null;
    }
}

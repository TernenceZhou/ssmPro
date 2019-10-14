package com.ssm.xiangxueClass.thread.forkJoinTest;

import com.ssm.model.UserInfo;

import java.lang.reflect.Field;
import java.lang.reflect.Method;

public class Reclfct extends UserInfo {

    public static void main(String[] args) throws IllegalAccessException {
        getConstruct();
    }

    public static void getConstruct() throws IllegalAccessException{
        Class<UserInfo> reclfctClass = UserInfo.class;
        Method[] methods = reclfctClass.getMethods();
        Field[] fields = reclfctClass.getDeclaredFields();
        for (Field field : fields) {
            field.setAccessible(true);
            field.set("id",2);
            System.out.println(field);
        }
        for (Method method : methods) {
//            System.out.println(method);
        }
    }
}

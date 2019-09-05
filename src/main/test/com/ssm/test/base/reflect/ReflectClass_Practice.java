package com.ssm.test.base.reflect;

import com.ssm.model.UserInfo;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

/**
 * @author
 * @description
 * @date 2019/9/3
 */
public class ReflectClass_Practice {
    public static void main(String[] args) throws Exception{
        UserInfo info  = new UserInfo();
        info.setId("1");
        info.setName("userName");
        Map map = new HashMap();
        Field[] declaredFields = info.getClass().getDeclaredFields();

        for(Field field:declaredFields){

            String key = field.getName();
            field.setAccessible(true);
            map.put(key,field.get(info));
        }
        System.out.println(map);

        //通过class.forName获取类实例
        UserInfo carInfo = (UserInfo) Class.forName("com.ssm.model.UserInfo").newInstance();
        //反射执行指定的类方法
        Method method = carInfo.getClass().getDeclaredMethod("getId", null);
        method.setAccessible(true);
        method.invoke(carInfo,null);
    }
}

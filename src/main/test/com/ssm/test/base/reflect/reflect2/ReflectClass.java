package com.ssm.test.base.reflect.reflect2;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import org.apache.commons.collections.CollectionUtils;
import org.junit.Test;

/**
 * 反射读取类 查看类属性.
 */
public class ReflectClass {

    public static void main(String[] args) {
        UpdateCustomerInfoReq req = new UpdateCustomerInfoReq();
        Class<UpdateCustomerInfoReq> aClass = UpdateCustomerInfoReq.class;
        Field[] fields = aClass.getDeclaredFields();
        for (Field field : fields) {
            System.out.println(field);
        }
    }
    @Test
    public void test22(){

        UpdateFinInfoReq req = new UpdateFinInfoReq();
        Class<UpdateFinInfoReq> aClass = UpdateFinInfoReq.class;
        Field[] fields = aClass.getDeclaredFields();
        for (Field field : fields) {
            System.out.println(field);
        }
    }
    @Test
    public void  tt(){
        ArrayList arrayList = new ArrayList();
        Collection collection = CollectionUtils.unmodifiableCollection(arrayList);
        List list = Collections.unmodifiableList(arrayList);
//        list.add("1");
        arrayList.add("1");
    }
}

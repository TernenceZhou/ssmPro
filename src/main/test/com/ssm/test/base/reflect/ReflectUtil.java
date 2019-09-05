package com.ssm.test.base.reflect;

import com.ssm.dao.UserDao;
import com.ssm.model.UserInfo;
import com.ssm.qo.UserInfoQO;
import org.junit.Test;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

/**
 * 反射工具
 * 
 * @author zhengxueyi
 */
public class ReflectUtil {

    /**
     * 执行指定方法
     * 
     * @param obj
     *            执行对象
     * @param methodName
     *            方法名
     * @param param
     *            执行参数
     */
    public static void execute(Object obj, String methodName, Object param) {
        try {
            Method method = findDeclaredMethod(obj.getClass(), methodName, param.getClass());
            method.setAccessible(true);
            method.invoke(obj, param);
        } catch (NoSuchMethodException | SecurityException | IllegalAccessException | IllegalArgumentException | InvocationTargetException e) {
            e.printStackTrace();
        }
    }

    /**
     * 获取对象方法
     * 
     * @param obj
     *            执行对象
     * @param methodName
     *            方法名
     * @param param
     *            执行参数
     * @return 对象方法
     * @throws NoSuchMethodException
     */
    public static Method findDeclaredMethod(Class<?> classType, String methodName, Class<?> paramType) throws NoSuchMethodException {
        try {
            return classType.getDeclaredMethod(methodName, paramType);
        } catch (NoSuchMethodException | SecurityException e) {
            for (Class<?> interfaceType : paramType.getInterfaces()) {
                Method method = findDeclaredMethod(classType, methodName, interfaceType);
                if (method != null) {
                    return method;
                }
            }
            throw e;
        }
    }

    public static void main(String[] args) {
        int batchStep = 0;
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("qo",new UserInfoQO());
        ReflectUtil.execute(UserDao.class, "getUserList", paramMap);

    }

//    private void insertFileData(WebankImportFileInfo<F, D> fileInfo) {
//        int batchStep = 0;
//        do {
//            batchStep += INSERT_MAX;
//            Map<String, Object> paramMap = fileInfo.toParamMap();
//            paramMap.put("dataList", fileInfo.getDataList().subList(batchStep - INSERT_MAX, Math.min(fileInfo.getDataList().size(), batchStep)));
//            ReflectUtil.execute(this.tWebankFileImportDao, getFileDataInsertMethodName(), paramMap);
//        } while (fileInfo.getDataList().size() > batchStep);
//
//    }

    /**
     *测试用例：bean2Map
     */
    @Test
    public  void getSMG3InputParam() {
        Map<String, Object> inputMap = new HashMap<>();
        bean2Map(inputMap,UserInfo.class,new UserInfo());
        System.out.println(inputMap);
    }
    /**
     * 类对象 通过反射 封装到map中
     * @param desMap
     * @param c class对象
     * @param o Object类
     */
    private static void bean2Map(Map desMap,Class c,Object o){
        Field[] fields = c.getDeclaredFields();
        String key;
        Object value;
        for(Field field:fields){
            key = field.getName();
//            if(key.equals("erp_id")||key.equals("ID")){
//                continue;
//            }
            field.setAccessible(true);
            try {
                value = field.get(o);
                if(value==null){
                    if(field.getType().equals(Integer.class)){
                        value = -99;
                    }
                    else  if(field.getType().equals(String.class)){
                        value = "-99";
                    }else  if(field.getType().equals(Double.class)){
                        value = -99;
                    }
                }
                desMap.put(key,value);
            }catch (Exception e){
                e.printStackTrace();
                System.out.println(field.getName()+" wrong");
            }
        }
    }

}

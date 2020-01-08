package com.ssm.xiangxueClass.spring.lesson14_mvc.servlet;

import com.ssm.xiangxueClass.spring.lesson14_mvc.annotation.MyAutowired;
import com.ssm.xiangxueClass.spring.lesson14_mvc.annotation.MyController;
import com.ssm.xiangxueClass.spring.lesson14_mvc.annotation.MyRequestMapping;
import com.ssm.xiangxueClass.spring.lesson14_mvc.annotation.MyService;
import org.junit.Test;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author
 * @description 自定义springMvc的入口类
 * @date 2019/12/3
 */
@WebServlet(value = "/MyDispatcherServlet")
public class MyDispatcherServlet extends HttpServlet {

    List<String> classNames = new ArrayList<String>();
    Map<String, Object> beansMap = new HashMap<String, Object>();
    Map<String, Object> handlerMap = new HashMap<String, Object>();

    @Override
    public void init() throws ServletException {
        //tomcat启动时候把全类名加到map中
        doScanPackage("com.cango");
        for (String classname : classNames) {
            System.out.println(classname);
        }
        // 2、我们肯定是要把扫描出来的类进行实例化
        instance();
        for (Map.Entry<String, Object> entry : beansMap.entrySet()) {
            System.out.println(entry.getKey() + ":" + entry.getValue());
        }
        //依赖注入把实例注入到controller
        //因为当前自定义注解后类还未加载到我们的controller中来
        ioc();
        //建立一个path与method的映射关系
        handlerMapping();
    }

    @Test
    public void t(){
        Field[] declaredFields = this.getClass().getDeclaredFields();
        for (Field field : declaredFields) {
            System.out.println(field);
        }
    }
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        super.doPost(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        super.doPost(req, resp);
    }


    private void handlerMapping() {
        if (beansMap.isEmpty()) {
            System.out.println("类实例化失败.");
            return;
        }
        for (Map.Entry<String, Object> entry : beansMap.entrySet()) {
            Object instance = entry.getValue();
            Class<?> clazz = instance.getClass();
            if(clazz.isAnnotationPresent(MyController.class)){
                //获取到类中的mapping
                MyRequestMapping classReqMapping = clazz.getAnnotation(MyRequestMapping.class);
                String classPath = classReqMapping.value();
                //获取方法层面的注解
                Method[] methods = clazz.getMethods();
                for (Method method : methods) {
                    if(method.isAnnotationPresent(MyRequestMapping.class)){
                        //获取到方法上的mapping
                        MyRequestMapping methodReqMapping = method.getAnnotation(MyRequestMapping.class);
                        String methodPath = methodReqMapping.value();
                        //把方法上与路径建立映射关系( /james/query--->public void com.enjoy.james.controller.JamesController.query )
                        handlerMap.put(classPath + methodPath,method);
                    }
                }
            }
        }
    }

    private void ioc() {
        if (beansMap.isEmpty()) {
            System.out.println("类实例化失败.");
            return;
        }
        //遍历所有的实例对象
        for (Map.Entry<String, Object> entry : beansMap.entrySet()) {
            Object instance = entry.getValue();//获取到实例
            Class<?> clazz = instance.getClass();//获取类 主要判断控制类中使用了哪些注解
            if (clazz.isAnnotationPresent(MyController.class)) { // 查看是否使用了MyController注解
                //得到类中的所有属性
                Field[] fields = clazz.getDeclaredFields();
                for (Field field : fields) {
                    //属性中是否使用自动装配注解
                    if (field.isAnnotationPresent(MyAutowired.class)) {
                        MyAutowired myAutowired = field.getAnnotation(MyAutowired.class);
                        //获取到@Autowired注解中的value属性值
                        String value = myAutowired.value();
                        field.setAccessible(true);
                        try {
                            //从MAP容器中获取"MyServiceImpl"对应的bean,并注入实例控制层bean,解决依赖注入
                            field.set(instance, beansMap.get(value));
                        } catch (IllegalAccessException e) {
                            e.printStackTrace();
                        }
                    } else {
                        continue;
                    }
                }
            } else {
                continue;
            }
        }
    }

    /**
     * 通过扫描到的class对象，对加了注解的类通过反射获取实例
     *
     * @throws ClassNotFoundException
     * @throws IllegalAccessException
     * @throws InstantiationException
     */
    public void instance() {
        if (classNames.isEmpty()) {
            System.out.println("包扫描失败");
            return;
        }
        try {
            for (String className : classNames) {
                Class<?> clazz = Class.forName(className.replace(".class", ""));
                if (clazz.isAnnotationPresent(MyController.class)) {
                    MyController controller = clazz.getAnnotation(MyController.class);
                    Object instance = clazz.newInstance();
                    MyRequestMapping requestMapping = clazz.getAnnotation(MyRequestMapping.class);
                    String value = requestMapping.value();//得到请求路径
                    //通过requestMapping请求路径放入到map中
                    beansMap.put(value, instance);
                } else if (clazz.isAnnotationPresent(MyService.class)) {
                    MyService myService = clazz.getAnnotation(MyService.class);
                    Object serviceInstance = clazz.newInstance();
                    beansMap.put(myService.value(), serviceInstance);
                }
            }
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InstantiationException e) {
            e.printStackTrace();
        }
    }


    /**
     * 通过反射把bean放入到map容器中
     *
     * @param map
     * @param target
     * @return
     * @throws IllegalAccessException
     */
    private Object beanToMap(Map map, Object target) throws IllegalAccessException {
        Field[] fields = target.getClass().getDeclaredFields();
        Object value = null;
        String key = "";
        for (Field field : fields) {
            key = field.getName();
            field.setAccessible(true);
            value = field.get(target);
            Class<?> type = field.getType();
            if (value == null) {
                if (type.equals(String.class)) {
                    value = "-99";
                }
                if (type.equals(Double.class)) {
                    value = -99.00;
                }
                if (type.equals(Integer.class)) {
                    value = 99;
                }
            }
            map.put(key, value);
        }
        return map;
    }

    /**
     * 扫描目录下的所有类
     * @param classPath
     */
    private void doScanPackage(String classPath) {
        String s = classPath.replaceAll("\\.", "/");
        URL url = this.getClass().getClassLoader().getResource("/" + s);
        String fileStr = url.getFile();
        File file = new File(fileStr);
        String[] files = file.list();
        for (String path : files) {
            File file1 = new File(fileStr + path);
            if (file1.isDirectory()) {
                doScanPackage(classPath + "." + path);
            } else {
                classNames.add(classPath + "." + path);
            }
        }
    }
}

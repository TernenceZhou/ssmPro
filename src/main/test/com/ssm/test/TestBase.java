package com.ssm.test;

import com.ssm.model.UserInfo;
import org.junit.Test;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public final class TestBase {
    String a = "";
    int ii = 0;
    final int id = 1; // 基本类型，不可改变
    final Object obj = new Object(); // 则引用不可改变，但 obj里面的属性可以改变！
    public void i(){
        ii = 22;
        a.substring(1);
    }

    public static void main(String[] args) {
        String a = "123";
        System.out.println(a.substring(1));
        Map map = new HashMap<>();
        map.put("1", 11);
        map.put("2", 22);
        Iterator iterator = map.keySet().iterator();
        while (iterator.hasNext()) {
            Object key = iterator.next();
            Object value = map.get(key);
            System.out.println(value);

        }
        System.out.println("---------------");
        for (Object o : map.keySet()) {
            Object o1 = map.get(o);
            System.out.println(o1);
        }
        int aaa[] = new int[5];
        int aa[] = {};
        int aaaa[] = new int[]{23};

        int i = 11;
        System.out.println(i / 3);
        System.out.println(-8 >> 2);
        byte k = -2; //转为int,二进制码为：0000000000000000000000000000010
        System.out.println(k >> 2);// 右移2位，抛弃最后2位，负数补1,二进制吗为：11000000000000000000000000000
        System.out.println((-2 / 4));
        System.out.println();
        System.out.println(i>>=1);
        long start = System.currentTimeMillis();
        System.out.println("------------------");
        System.out.println(System.currentTimeMillis());
        ArrayList list = new ArrayList();
        for (int ii = 0;ii<100000;ii++){
            list.add(i);
        }
        if( i ==11 & i<=10){
            System.out.println("ttttt");
        }
        System.arraycopy(aa,2,aa,2,1);
        System.out.println(System.currentTimeMillis()-start);
        System.out.println("------------------");
    }

    @Test
    public void t1(){
        String a = "";
        String intern = a.intern();
    }

    @Test
    public void bigDecimal(){
        //传递double数值会发生精度丢失问题，建议double->字符串后传递
        //BigDecimal decimal = new BigDecimal(0.1);
        BigDecimal valueOf = BigDecimal.valueOf(0.1);
        BigDecimal decimal = new BigDecimal(String.valueOf(0.1));
        System.out.println(decimal);
        BigDecimal decimal12 = new BigDecimal("0.1");
        System.out.println(decimal12);

    }

    @Test
    public void lock(){
        Lock lock = new ReentrantLock();
       // Condition condition = lock.newCondition();
        boolean tryLock = lock.tryLock();
        if(tryLock){
            try {
                //do something
            }catch (Exception e){
                e.printStackTrace();
            }finally {
                lock.unlock();
            }
        }

        /*try {
            //lock.tryLock();
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            lock.unlock();
        }*/
    }


    /**
     * 换行（‘\n’）的另类写法System.getProperty("line.separator")
     */
    @Test
    public void testlineSeparator(){
        StringBuffer buffer  =new StringBuffer();
        buffer.append("123");
        buffer.append(System.getProperty("line.separator"));
        buffer.append("123");
        buffer.append(System.getProperty("line.separator"));
        buffer.append("123");
        buffer.append(("\n"));
        buffer.append("123");
        System.out.println(buffer.toString());
    }

    /**
     * 读取项目文件内容
     * @throws IOException
     */
    @Test
    public void load() throws IOException {
        String classpath = "";
        InputStream is = null;
        InputStreamReader isr = null;

        //is = TestBase.class.getClassLoader().getResourceAsStream("  RULE_CODE_CANGO_LOANEDT.ini");
        is = new FileInputStream("D:\\java\\intellij_workSpace_2018_2.7\\ssmPro\\src\\main\\test\\com\\ssm\\test\\RULE_CODE_CANGO_LOANEDT.ini");

        System.out.println(is);
        isr = new InputStreamReader(is,"UTF-8");

        BufferedReader br  = new BufferedReader(isr);
        String line = null;
        StringBuffer sb = new StringBuffer();

        while ((line = br.readLine()) != null) {
            line = line.trim();
            sb.append(line);
            sb.append(System.getProperty("line.separator"));

        }
        System.out.println(sb.toString());

    }

    @Test
    public void objectCompare(){
        UserInfo us = new UserInfo();
        UserInfo us2 = new UserInfo();
        System.out.println(us.equals(us2));
        System.out.println(us == us2);
    }

}

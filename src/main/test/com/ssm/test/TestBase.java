package com.ssm.test;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Scanner;
import java.util.Set;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import java.util.stream.Collectors;

import org.junit.Test;

import com.ssm.model.UserInfo;

import cn.hutool.core.date.DateField;
import cn.hutool.core.date.DateTime;
import cn.hutool.core.date.DateUtil;

public final class TestBase {
    String a = "";
    int ii = 0;
    final int id = 1; // 基本类型，不可改变
    final Object obj = new Object(); // 则引用不可改变，但 obj里面的属性可以改变！

    public void i() {
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
        int aaaa[] = new int[] { 23 };

        int i = 11;
        System.out.println(i / 3);
        System.out.println(-8 >> 2);
        byte k = -2; //转为int,二进制码为：0000000000000000000000000000010
        System.out.println(k >> 2);// 右移2位，抛弃最后2位，负数补1,二进制吗为：11000000000000000000000000000
        System.out.println((-2 / 4));
        System.out.println();
        System.out.println(i >>= 1);
        long start = System.currentTimeMillis();
        System.out.println("------------------");
        System.out.println(System.currentTimeMillis());
        ArrayList list = new ArrayList();
        for (int ii = 0; ii < 100000; ii++) {
            list.add(i);
        }
        if (i == 11 & i <= 10) {
            System.out.println("ttttt");
        }
        //System.arraycopy(aa, 2, aa, 2, 1);
        System.out.println(System.currentTimeMillis() - start);
        System.out.println("------------------");

        System.out.println("-------------------------");
        Scanner in = new Scanner(System.in);
        System.out.println("请输入数值：");
        int ii = in.nextInt();
        System.out.println("输入结果：" + ii);
    }

    @Test
    public void t1() {
        String a = "";
        String intern = a.intern();
    }

    @Test
    public void bigDecimal() {
        //传递double数值会发生精度丢失问题，建议double->字符串后传递
        //BigDecimal decimal = new BigDecimal(0.1);
        BigDecimal valueOf = BigDecimal.valueOf(0.1);
        BigDecimal decimal = new BigDecimal(String.valueOf(0.1));
        System.out.println(decimal);
        BigDecimal decimal12 = new BigDecimal("0.1");
        System.out.println(decimal12);

    }

    @Test
    public void lock() {
        Lock lock = new ReentrantLock();
        // Condition condition = lock.newCondition();
        boolean tryLock = lock.tryLock();
        if (tryLock) {
            try {
                //do something
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
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
    public void testlineSeparator() {
        StringBuffer buffer = new StringBuffer();
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
     *
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
        isr = new InputStreamReader(is, "UTF-8");

        BufferedReader br = new BufferedReader(isr);
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
    public void objectCompare() {
        UserInfo us = new UserInfo();
        UserInfo us2 = new UserInfo();
        System.out.println(us.equals(us2));
        System.out.println(us == us2);
    }

    @Test
    public void dateTest() throws ParseException {

        //判断某个日期是否在两个日期范围之内 20191216181054

        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date date1 = simpleDateFormat.parse("2019-06-20");
        Date date2 = simpleDateFormat.parse("2019-07-25");

        Date date3 = simpleDateFormat.parse("2019-07-25");
        System.out.println(date1.getTime() <= date3.getTime());
        System.out.println(date2.getTime() >= date3.getTime());
        //        if(date1.getTime()<=date3.getTime() && date2.getTime()>=date3.getTime()){
        //            System.out.println("date3在date1和date2日期范围内！");
        //        }
    }

    @Test
    public void dateTest2() throws ParseException {
        String format = "HH:mm:ss";
        Date nowTime = new SimpleDateFormat(format).parse("09:27:00");
        Date startTime = new SimpleDateFormat(format).parse("09:27:00");
        Date endTime = new SimpleDateFormat(format).parse("09:27:59");
        System.out.println(isEffectiveDate(nowTime, startTime, endTime));

    }

    @Test
    public void test33() {
        String str1 = "2015-02-08 20:20:20";
        String str2 = "2015-01-08 10:10:10";
        int res = str1.compareTo(str2);
        System.out.println(res);
        if (res > 0)
            System.out.println("str1>str2");
        else if (res == 0)
            System.out.println("str1=str2");
        else
            System.out.println("str1<str2");
    }

    @Test
    public void test44() {

        String dateStr = "2017-03-01 22:33:23";
        Date date = DateUtil.parse(dateStr);

        //结果：2017-03-03 22:33:23
        Date newDate = DateUtil.offset(date, DateField.DAY_OF_MONTH, 2);

        //常用偏移，结果：2017-03-04 22:33:23
        DateTime newDate2 = DateUtil.offsetDay(date, 3);

        //常用偏移，结果：2017-03-01 19:33:23
        DateTime newDate3 = DateUtil.offsetHour(date, -3);

        DateUtil.offsetHour(new Date(), 24);
    }

    @Test
    public void add() {
        String s = addDateMinut("2019-12-17 13:55:04", -24);
        System.out.println(s);
        System.out.println(DateField.DAY_OF_MONTH.getValue());
        System.out.println(DateField.DAY_OF_MONTH);
    }

    /**
     * 给时间加上几个小时
     *
     * @param day  当前时间 格式：yyyy-MM-dd HH:mm:ss
     * @param hour 需要加的时间
     * @return
     */
    public static String addDateMinut(String day, int hour) {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date = null;
        try {
            date = format.parse(day);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        if (date == null)
            return "";
        System.out.println("front:" + format.format(date)); //显示输入的日期
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.HOUR, hour);// 24小时制
        date = cal.getTime();
        System.out.println("after:" + format.format(date));  //显示更新后的日期
        cal = null;
        return format.format(date);

    }

    @Test
    public void testDDD() throws ParseException {
        String date = "2019-12-18 10:04:04";
        String from = "2019-12-16 09:51:37";
        String to = "2019-12-21 09:51:38";
        int toRes = date.compareTo(to);
        int fromRes = date.compareTo(from);
        System.out.println(toRes);
        System.out.println(fromRes);

        System.out.println(String.format("网商VID接口处理逻辑，未找到贷款申请，传入参数：%s", "123"));
        //挡板测试
        //        String resobj = "{\"body\":{\"mybank_credit_sceneprod_vid_get_response\":{\"code\":\"10000\",\"msg\":\"Success\"," +
        //                "\"verify_id\":\"componentVerify_a8e\",\"retry\":true,\"trace_id\":\"0b21b50615755184045104022e61d4\"},\"sign\":\"P4leuEsYiVf5BDjH8rF6wT9OnkT6x1mdPzVZbNIC2QhHOl+Kz66UYyKy2MGaezBT82eFTmGFclDEz8uLpXoIv21iNJs2Sy5PI1Xn30jxQzrOd4pb376gtAJ0Z+/jWbp3yp/GCVAMHXPPODiKg522sXLIP2lcCcEHJYR4sd2mGy5Rj395M62TMnGz/pylnH87Ahp4Y9DUhTd2qK7OrFcHJAMlUwADeCYJh1gnLlHfTimMNg6Cw38L1xoOP1xf8jbzBdQsUDmgzP/ElwqVTlFolGSfUM9NTLOk5C+gLhXveMScPkD+Z0GeZdyJbGocvav8lEXNfAqEEQdPlU6qcHukgA==\"},\"code\":\"10000\",\"errorCode\":\"10000\",\"verify_id\":\"componentVerify_a8e\",\"msg\":\"Success\",\"params\":{\"biz_content\":{\"alipayVersion\":\"4.7.12.ALL\",\"metaInfo\":\"默认内容\",\"orgCode\":\"CANGO\",\"site\":\"ALIPAY\",\"siteUserId\":\"20881234567890\",\"verifyType\":\"FACE\"}}," +
        //                "\"retry\":\"true\",\"success\":true,\"traceId\":\"0b21b50615755184045104022e61d4\"}";
        //        Result outResult =  new Result("0000","处理成功！！！", JSONObject.parseObject(resobj));
        String format = "yyyy-MM-dd HH:mm:ss";
        Date startTime = new SimpleDateFormat(format).parse(from);
        Date endTime = new SimpleDateFormat(format).parse(to);
        Date nowTime = new SimpleDateFormat(format).parse(date);
        System.out.println(nowTime.after(startTime));
        System.out.println(nowTime.before(endTime));

        boolean b = isEffectiveDate(nowTime, startTime, endTime);
        System.out.println(b);

    }

    /**
     * 判断当前时间是否在[startTime, endTime]区间，注意时间格式要一致
     *
     * @param nowTime   当前时间
     * @param startTime 开始时间
     * @param endTime   结束时间
     * @return
     * @author jqlin
     */
    public static boolean isEffectiveDate(Date nowTime, Date startTime, Date endTime) {
        if (nowTime.getTime() == startTime.getTime() || nowTime.getTime() == endTime.getTime()) {
            return true;
        }

        Calendar date = Calendar.getInstance();
        date.setTime(nowTime);

        Calendar begin = Calendar.getInstance();
        begin.setTime(startTime);

        Calendar end = Calendar.getInstance();
        end.setTime(endTime);

        if (date.after(begin) && date.before(end)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 当前时间在核身开始和失效时间内.
     *
     * @param date 当前日期（格式:yyyy-MM-dd HH:mm:ss）
     * @param from 起始日期（格式:yyyy-MM-dd HH:mm:ss）
     * @param to   截止日期（格式:yyyy-MM-dd HH:mm:ss）
     * @return 验证结果
     */
    private static boolean dateBetween(final String date, final String from, final String to) {
        int fromRes = date.compareTo(from);
        int toRes = date.compareTo(to);
        if (fromRes > 0 && toRes < 0) {
            return true;
        } else {
            return false;
        }
    }

    @Test
    public void atomit() {
        int i = 1;
        i = i++;
        i++;
        System.out.println(i);
        System.out.println(i);
        System.out.println(i++);
        System.out.println(i);
    }

    @Test
    public void printtangle() {
        for (int i = 1; i < 10; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.print("*");
            }
            System.out.println();
        }

    }

    @Test
    public void printtangle2() {
        for (int i = 1; i < 10; i++) {
            for (int j = 10; j > i; j--) {
                System.out.print("*");
            }
            System.out.println();
        }

    }

    @Test
    public void butto() {
        int arr[] = { 1, 3, 6, 2 };
        for (int i = 0; i < arr.length; i++) {
            for (int j = 0; j < arr.length - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int tmp = arr[j + 1];
                    arr[j + 1] = arr[j];
                    arr[j] = tmp;
                }
            }
            System.out.println(arr[i]);
        }

    }

    @Test
    public void lambdaTest() {
        List<UserInfo> list = new ArrayList<>();
        UserInfo u1 = new UserInfo();
        u1.setName("name");
        u1.setId("1");
        UserInfo u2 = new UserInfo();
        u1.setName("name2");
        u2.setId("2");
        UserInfo u3 = new UserInfo();
        u3.setName("name3");
        list.add(u1);
        list.add(u2);
        list.add(u3);

        Map<String, Object> map = new LinkedHashMap();
        map.put("1", "a");

        //lambda 过滤集合数据 并且返回对应的主键集合
        List<String> collect = list.stream().filter(o -> o.getId() != null).map(UserInfo::getId).collect(Collectors.toList());
        for (String s : collect) {
            System.out.println("id集合：" + s);
        }

        Set set = map.keySet();
        Iterator iterator = set.iterator();
        while (iterator.hasNext()) {
            Object next = iterator.next();
            System.out.println(next + "---" + map.get(next));
        }

        for (Map.Entry<String, Object> entry : map.entrySet()) {
            System.out.println(entry.getKey() + " -- " + entry.getValue());
        }

        map.forEach((k, v) -> {
            System.out.println(k + " ----  " + v);
        });
    }

    /**
     * String  源码 compareTo方法计算方式
     */
    @Test
    public void testStr() {
        char c1[] = { 'a', 'b', 'c' };
        char c2[] = { 'a', 'b', 'd' };
        //如果字符相同相减就是0 否则就是 -1 大于就是1
        System.out.println(c1[0] - c2[1]);

        System.out.println(c1[1] - c2[0]);// 1

        String a = "abc";

        a.compareTo("");
        a.equals("");

        String s1 = new String("a");
        String s2 = new String("a");
        String s3 = s1;
        System.out.println(a.equals(s2));
        System.out.println(s1 == s3);
        System.out.println(s1.compareTo(s2));
        //Assert.assertEquals(s1,s2);

        String aa = "java";
        String aaa = "java";
        System.out.println(aa == aaa);

        aaa = "javaa";
        String bbb = "javaa";
        System.out.println(aaa == bbb);
    }

    @Test
    public void lambda聚合计算() {
        //           List<ClaimDto> claimDto = new ArrayList<>();
        //           ClaimDto a = new ClaimDto();
        //           a.setClaimFlag("0806");
        //           a.setClaimNo("1111");
        //           ClaimDto b = new ClaimDto();
        //           b.setClaimFlag("0812");
        //           b.setClaimNo("11112");
        //
        //           ClaimDto c = new ClaimDto();
        //           c.setClaimFlag("0812");
        //           c.setClaimNo("11113");
        //
        //           ClaimDto d = new ClaimDto();
        //           d.setClaimFlag("0812");
        //           d.setClaimNo("11114");
        //           claimDto.add(a);
        //           claimDto.add(b);
        //           claimDto.add(c);
        //           claimDto.add(d);
        //           Map<String, Long> collect = claimDto.stream().collect(Collectors.groupingBy(x -> x.getClaimFlag(), Collectors.counting()));
        //
        //
        //
        //           Stream<ClaimDto> claimDtoStream = claimDto.stream().filter(x -> "0806".equals(x.getClaimFlag()));
        //           long count = claimDto.stream().filter(x -> "0806".equals(x.getClaimFlag())).count();
        //           Stream<ClaimDto> claimDtoStream2 = claimDto.stream().filter(x -> "0812".equals(x.getClaimFlag()));
        //           long count1 = claimDto.stream().filter(x -> "0812".equals(x.getClaimFlag())).count();
        //
        //           System.out.println(count);
        //           System.out.println(count1);

        List<UserInfo> users = new ArrayList<>();
        //按照分组后返回 key count
        Map<String, Long> collect = users.stream().collect(Collectors.groupingBy(x -> x.getName(), Collectors.counting()));

        users.stream().filter(x -> x.getName().equals("aaa")).count();

        users.stream().filter(x -> x.getId() == "123").findFirst().ifPresent(userInfo -> {

        });
        //非空
        Optional.ofNullable(users).orElse(new ArrayList<>()).forEach(userInfo -> {

        });

    }

    @Test
    public void hashMap() {

        boolean equals = Objects.equals("a", "a");
        System.out.println(equals);

    }

    /**
     * 做这个题目需要知道底层的i++是怎么操作的
     * 可以用反编译查看代码执行过程
     * javac xxx.java
     * 然后
     * jad xxx.class
     */
    @Test
    public void testPractice() {
        int b = 100;
        b += (++b);// i  =  i +  (++i)   201
        System.out.println(b);

        int i = 100;
        i += (i++);// i  =  i +  (i++)   200
        System.out.println(i);
    }

    /**
     * 把数组转换为集合时，用返回的集合类去add 等集合操作会报 UnSupportedOperationException
     */
    @Test
    public void testArrToList() {
        String arr[] = {"1","2","3"};
        List<String> list = Arrays.asList(arr);
        list.add("444");
    }

}

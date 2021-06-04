package com.ssm.common.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import org.apache.commons.lang.StringUtils;
import org.junit.Test;

import cn.hutool.core.date.DateField;
import cn.hutool.core.date.DateTime;

/**
 * 日期工具类.
 */
public class DateUtil extends DateUtilCango {

    public static final String YYYY_MM_DD = "yyyy-MM-dd";

    public static final String YYYYMMDD = "yyyyMMdd";

    public static final String YYYYMMDD_HHMMSS = "yyyy-MM-dd HH:mm:ss";

    /**
     * 转换日期到指定格式.
     *
     * @param date   日期
     * @param format 格式
     * @return string 转换后结果
     */
    public static String format(Date date, String format) {
        final SimpleDateFormat dateFormat = new SimpleDateFormat(format);
        return dateFormat.format(date);
    }

    /**
     * 日期转换为Date类型.
     */
    public static Date parse(String date, String format) {
        try {
            if (StringUtils.isBlank(date)) {
                return null;
            }
            final SimpleDateFormat dateFormat = new SimpleDateFormat(format);
            return dateFormat.parse(date);
        } catch (Exception e) {
            //            LogUtil.error("日期转换异常", e);
        }
        return null;
    }

    /**
     * 亚太返回时间转换.
     */
    public static Date parseYtDate(String date) {
        try {
            if (StringUtils.isBlank(date)) {
                return null;
            }
            final SimpleDateFormat dateFormat;
            if (date.length() > 10) {
                dateFormat = new SimpleDateFormat(YYYYMMDD_HHMMSS);
            } else {
                dateFormat = new SimpleDateFormat(YYYY_MM_DD);
            }
            return dateFormat.parse(date);
        } catch (Exception e) {
            //            LogUtil.error("日期转换异常", e);
        }
        return null;
    }

    /**
     * 转换日期到指定格式.
     *
     * @param date   日期
     * @param i      天数
     * @param format 格式
     * @return string 转换后结果
     */
    public static String getDayBeforeNDay(String date, int i, String format) {
        final SimpleDateFormat dateFormat = new SimpleDateFormat(format);
        final Calendar calendar = Calendar.getInstance();
        calendar.setTime(strToDate(date, format));
        calendar.add(Calendar.DATE, -i);
        final Date start = calendar.getTime();
        return dateFormat.format(start);
    }

    /**
     * 将时间格式化为指定格式的字符串.
     *
     * @param date    日期
     * @param pattern 格式
     */
    public static String dateToStr(Date date, String pattern) {
        final SimpleDateFormat sdf = new SimpleDateFormat(pattern);
        return sdf.format(date);
    }

    /**
     * 转换日期到指定格式.
     *
     * @param dateStr   日期
     * @param startDate 开始日期
     * @param endDate   结束日期
     * @param format    格式
     * @return string 转换后结果
     */
    public static Boolean getIsInThisDate(String dateStr, String startDate, String endDate, String format) throws ParseException {
        final SimpleDateFormat dateFormat = new SimpleDateFormat(format);
        final long date = dateFormat.parse(dateStr).getTime();
        final long startDateInfo = dateFormat.parse(startDate).getTime();
        final long endDateInfo = dateFormat.parse(endDate).getTime();
        return date >= startDateInfo && date <= endDateInfo;
    }

    /**
     * 获取系统时间后i天.
     *
     * @param i      天数
     * @param format 格式
     */
    public static String getDayAfterToday(String format, int i) {
        final SimpleDateFormat sdf = new SimpleDateFormat(format);
        final Date today = new Date();
        final Calendar theCa = Calendar.getInstance();
        theCa.setTime(today);
        theCa.add(Calendar.DATE, i);
        final Date start = theCa.getTime();
        return sdf.format(start);
    }

    /**
     * 判断时间是否大于今天.
     */
    public static Boolean dateAfterNow(String startDate, String format) throws ParseException {
        final SimpleDateFormat sdf = new SimpleDateFormat(format);
        //将字符串形式的时间转化为Date类型的时间
        final Date start = sdf.parse(startDate);
        final Date d = new Date();
        final String dateNowStr = sdf.format(d);
        final Date now = sdf.parse(dateNowStr);
        //Date类的一个方法，如果start早于end返回true，否则返回false  
        return start.after(now);
    }

    /**
     * 格式化今天日期.
     *
     * @param format 日期格式
     */
    public static String getToday(String format) {
        final Date date = new Date();
        return format(date, format);
    }

    /**
     * 获取N天前后的日期.
     *
     * @param date   当前时间
     * @param i      加减长度
     * @param format 格式
     * @return 结果
     */
    public static Date addDay(Date date, int i, String format) {
        final SimpleDateFormat dateFormat = new SimpleDateFormat(format);
        final Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.DATE, i);
        return calendar.getTime();
    }

    /**
     * 判断俩日期大小.
     *
     * @param dateStr1 日期
     * @param dateStr2 日期
     * @param format   格式
     * @return string 转换后结果
     */
    public static Boolean getCompareDate(String dateStr1, String dateStr2, String format) throws ParseException {
        final SimpleDateFormat dateFormat = new SimpleDateFormat(format);
        final long date1 = dateFormat.parse(dateStr1).getTime();
        final long date2 = dateFormat.parse(dateStr2).getTime();
        return date1 >= date2;
    }

    /**
     * 判断俩日期大小大于.
     *
     * @param dateStr1 日期
     * @param dateStr2 日期
     * @param format   格式
     * @return string 转换后结果
     */
    public static Boolean getCompareDateGt(String dateStr1, String dateStr2, String format) throws ParseException {
        final SimpleDateFormat dateFormat = new SimpleDateFormat(format);
        final long date1 = dateFormat.parse(dateStr1).getTime();
        final long date2 = dateFormat.parse(dateStr2).getTime();
        return date1 > date2;
    }

    /**
     * 日期 + N.
     *
     * @param date   日期
     * @param type   维度 年月日
     * @param amount N
     */
    public static Date dateAdd(Date date, int type, int amount) {
        final Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(type, amount);
        return calendar.getTime();
    }

    /**
     * date2比date1多的天数
     *
     * @param date1
     * @param date2
     * @return
     */
    public static int differentDays(Date date1, Date date2) {
        Calendar cal1 = Calendar.getInstance();
        cal1.setTime(date1);

        Calendar cal2 = Calendar.getInstance();
        cal2.setTime(date2);
        int day1 = cal1.get(Calendar.DAY_OF_YEAR);
        int day2 = cal2.get(Calendar.DAY_OF_YEAR);

        int year1 = cal1.get(Calendar.YEAR);
        int year2 = cal2.get(Calendar.YEAR);
        if (year1 != year2)   //不同一年
        {
            int timeDistance = 0;
            for (int i = year1; i < year2; i++) {
                if (i % 4 == 0 && i % 100 != 0 || i % 400 == 0)    //闰年
                {
                    timeDistance += 366;
                } else    //不是闰年
                {
                    timeDistance += 365;
                }
            }

            return timeDistance + (day2 - day1);
        } else    //同一年
        {
            System.out.println("判断day2 - day1 : " + (day2 - day1));
            return day2 - day1;
        }
    }

    public static int getAgeByBirth(Date birthday) {
        if (birthday == null) {
            return 0;
        }
        //Calendar：日历
        /*从Calendar对象中或得一个Date对象*/
        Calendar cal = Calendar.getInstance();
        /*把出生日期放入Calendar类型的bir对象中，进行Calendar和Date类型进行转换*/
        Calendar bir = Calendar.getInstance();
        bir.setTime(birthday);
        /*如果生日大于当前日期，则抛出异常：出生日期不能大于当前日期*/
        if (cal.before(birthday)) {
            return 0;
        }
        /*取出当前年月日*/
        int yearNow = cal.get(Calendar.YEAR);
        int monthNow = cal.get(Calendar.MONTH);
        int dayNow = cal.get(Calendar.DAY_OF_MONTH);
        /*取出出生年月日*/
        int yearBirth = bir.get(Calendar.YEAR);
        int monthBirth = bir.get(Calendar.MONTH);
        int dayBirth = bir.get(Calendar.DAY_OF_MONTH);
        /*大概年龄是当前年减去出生年*/
        int age = yearNow - yearBirth;
        /*如果出当前月小与出生月，或者当前月等于出生月但是当前日小于出生日，那么年龄age就减一岁*/
        if (monthNow < monthBirth || (monthNow == monthBirth && dayNow < dayBirth)) {
            age--;
        }
        return age;
    }

    /**
     * 20180524转为2018-05-24.
     */
    public static String dateConvertion(String str) {
        Date parse = null;
        String dateString = "";
        try {
            parse = new SimpleDateFormat(YYYYMMDD).parse(str);
            dateString = new SimpleDateFormat(YYYY_MM_DD).format(parse);
        } catch (ParseException e) {
            dateString = null;
        }

        return dateString;
    }

    /**
     * 20180524转为2018-05-24.
     */
    public static String dateConvertionStr(String str) {
        Date parse = null;
        String dateString = "";
        try {
            parse = new SimpleDateFormat(YYYYMMDD_HHMMSS).parse(str);
            dateString = new SimpleDateFormat(YYYY_MM_DD).format(parse);
        } catch (ParseException e) {
            dateString = null;
        }

        return dateString;
    }

    @Test
    public void testDiff() {
        int i = DateUtil.differentDays(DateUtil.strToDate("2021-05-01", DateUtil.YYYY_MM_DD), DateUtil.getCurrentDate());
        System.out.println(i);
    }

    public static void main(String[] args) throws ParseException {
        final Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.HOUR_OF_DAY, 2);

        String format = String.format("%s:%s", calendar.get(Calendar.HOUR_OF_DAY), "00");
        System.out.println(format);
        String currentDate = DateUtil.getCurrentDate(DateUtil.YYYY_MM_DD);
        System.out.println(currentDate + " " + format);
        System.out.println(DateUtil.getCurrentDate(DateUtil.YYYYMMDD_HHMMSS));
        String format1 = DateUtil.format(DateUtil.dateAdd(DateUtil.getCurrentDate(), Calendar.SECOND, -1), DateUtil.YYYY_MM_DD);
        String dayBeforeNDay = DateUtil.getDayBeforeNDay(format1, 1, DateUtil.YYYY_MM_DD);
        System.out.println(format1);
        System.out.println(dayBeforeNDay);

        String a = DateUtil.format(DateUtil.dateAdd(DateUtil.parse("2020-11-09 13:10:10", DateUtil.YYYY_MM_DD), Calendar.MONTH, 12), DateUtil.YYYY_MM_DD);
        String b = DateUtil.getDayBeforeNDay(a, 1, DateUtil.YYYY_MM_DD);
        //System.out.println( a + "\n" + b);

        Calendar cal = Calendar.getInstance();
        cal.setTime(DateUtil.strToDate("20201221000000", DateUtil.YYYYMMDDHHMMSS));
        cal.add(DateField.SECOND.getValue(), -1);
        DateTime dateTime1 = new DateTime(cal.getTime());

        DateTime dateTime = cn.hutool.core.date.DateUtil.offsetSecond(DateUtil.strToDate("20201221000000", DateUtil.YYYYMMDDHHMMSS), -1);
        System.out.println(dateTime);
    }

    public void dateT() {
        System.out.println(DateUtil.getCurrentDate(DateUtil.YYYYMMDDHHMMSS));
        String format = DateUtil.format(DateUtil.dateAdd(DateUtil.getCurrentDate(), Calendar.SECOND, -1), DateUtil.YYYYMMDDHHMMSS);
        System.out.println(format);

        final Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.HOUR_OF_DAY, 2);
        System.out.println(String.format("%s%s%s", calendar.get(Calendar.HOUR_OF_DAY), "00", "00"));
        //商业险投保日期：
        //非即时起保，结束时间是起保时间（00:00:00) +1年-1秒
        //即时起保，结束时间是起保时间对应日+1年 的23:59:59
        Date date = DateUtil.strToDate("20201212000000", DateUtil.YYYYMMDDHHMMSS);
        String format2 = DateUtil.format(DateUtil.dateAdd(date, Calendar.YEAR, 1), DateUtil.YYYYMMDDHHMMSS);
        String rest = DateUtil.format(DateUtil.dateAdd(DateUtil.dateAdd(date, Calendar.YEAR, 1), Calendar.SECOND, -1), DateUtil.YYYYMMDDHHMMSS);
        System.out.println(format2);
        System.out.println(rest);

        System.out.println(String.format("%s%s", DateUtil.format(DateUtil.dateAdd(DateUtil.getCurrentDate(), Calendar.WEEK_OF_YEAR, 1), DateUtil.YYYYMMDD), "235959"));

        String format1 = String.format("%s%s", DateUtil.dateToYYYMMDD(DateUtil.dateAdd(DateUtil.getCurrentDate(), Calendar.YEAR, 1)), "000000");
        System.out.println(format1);

        String format3 = DateUtil.format(DateUtil
            .dateAdd(DateUtil.strToDate(String.format("%s%s", DateUtil.dateToYYYMMDD(DateUtil.dateAdd(DateUtil.getCurrentDate(), Calendar.YEAR, 1)), "000000"), DateUtil.YYYYMMDDHHMMSS),
                Calendar.SECOND, -1), DateUtil.YYYYMMDDHHMMSS);
        System.out.println(format3);
    }
}

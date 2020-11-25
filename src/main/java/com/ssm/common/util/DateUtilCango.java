package com.ssm.common.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;

/**
 * @author
 * @description
 * @date 2020/11/9
 */
public class DateUtilCango {
    public static final String YYYY_MM_DD = "yyyy-MM-dd";
    public static final String YYYYMMDD = "yyyyMMdd";
    public static final String YYMMDDHHMMSS = "yyMMddHHmmss";
    public static final String YYYYMMDDHHMMSS = "yyyyMMddHHmmss";
    public static final String YYYYMMDD_HHMMSS = "yyyy-MM-dd HH:mm:ss";

    public DateUtilCango() {
    }

    public static List<String> allBetweenDate(String startDate, String endDate) {
        List<String> allDate = new ArrayList();
        SimpleDateFormat sfmt = new SimpleDateFormat("yyyy-MM-dd");

        try {
            Date dateStart = sfmt.parse(startDate);
            Date dateEnd = sfmt.parse(endDate);
            Calendar calStart = Calendar.getInstance();
            calStart.setTime(dateStart);
            Calendar calEnd = Calendar.getInstance();
            calEnd.setTime(dateEnd);
            calEnd.add(5, 1);
            String date = "";

            while(!calStart.equals(calEnd)) {
                date = "";
                date = calStart.get(1) + "-";
                if (calStart.get(2) + 1 < 10) {
                    date = date + "0";
                }

                date = date + (calStart.get(2) + 1) + "-";
                if (calStart.get(5) < 10) {
                    date = date + "0";
                }

                date = date + calStart.get(5);
                allDate.add(date);
                calStart.add(5, 1);
            }
        } catch (ParseException var9) {
            ;
        }

        return allDate;
    }

    public static Date strToDate(String dateStr, String pattern) {
        SimpleDateFormat dateFormat = new SimpleDateFormat(pattern);

        try {
            Date datetime = dateFormat.parse(dateStr);
            Calendar cal = Calendar.getInstance();
            cal.setTime(datetime);
            return cal.getTime();
        } catch (ParseException var5) {
            var5.printStackTrace();
            return null;
        }
    }

    public static String dateToStr(Date date, String pattern) {
        SimpleDateFormat sdf = new SimpleDateFormat(pattern);
        return sdf.format(date);
    }

    public static Date getCurrentDate() {
        return Calendar.getInstance().getTime();
    }

    public static Date getTime(int calendarType, int value) {
        Calendar calDay = Calendar.getInstance();
        calDay.add(calendarType, value);
        return calDay.getTime();
    }

    public static Date getTime(Date time, int calendarType, int value) {
        Calendar calDay = Calendar.getInstance();
        calDay.setTime(time);
        calDay.add(calendarType, value);
        return calDay.getTime();
    }

    public static String getCurrentDate(String formatType) {
        Date now = Calendar.getInstance().getTime();
        return dateToStr(now, formatType);
    }

    public static Date getMonthAfter(Date date, int month) {
        try {
            Calendar calendar = GregorianCalendar.getInstance();
            calendar.setTime(date);
            calendar.add(2, month);
            date = calendar.getTime();
            return date;
        } catch (Exception var3) {
            return null;
        }
    }

    public static long minutesBetween(Date date1, Date date2) {
        long date1Time = 0L;
        long date2Time = 0L;
        if (date1 != null) {
            date1Time = date1.getTime();
        }

        if (date2 != null) {
            date2Time = date2.getTime();
        }

        return (date2Time - date1Time) / 60000L;
    }

    public static String dateToYYYMMDD(Date date) {
        return dateToStr(date, "yyyyMMdd");
    }

    public static String dateToYYYYMMDDHHMMSS(Date date) {
        return dateToStr(date, "yyyyMMddHHmmss");
    }
}

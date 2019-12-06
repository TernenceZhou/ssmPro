package com.ssm.common.util;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 字符串工具类
 * @author
 *
 */
public class StringUtil {

    /**
     * 字符串是否为空，包括blank
     * @param str
     * @return
     */
    public static boolean isNullOrEmpty(String str){
        return null != str && 0 != str.trim().length() ? false : true;
    }

   /* *//**
     * 判断是否是空
     * @param str
     * @return
     *//*
    public static boolean isEmpty(String str){
        if(str==null||"".equals(str.trim())){
            return true;
        }else{
            return false;
        }
    }

    *//**
     * 判断是否不是空
     * @param str
     * @return
     *//*
    public static boolean isNotEmpty(String str){
        if((str!=null)&&!"".equals(str.trim())){
            return true;
        }else{
            return false;
        }
    }

    *//**
     * 格式化模糊查询
     * @param str
     * @return
     *//*
    public static String formatLike(String str){
        if(isNotEmpty(str)){
            return "%"+str+"%";
        }else{
            return null;
        }
    }*/
    public StringUtil() {
    }

    public static boolean isEmpty(String s) {
        return null == s || "".equals(s);
    }

    public static boolean isNotEmpty(String s) {
        return !isEmpty(s);
    }

    public static boolean isBlank(String s) {
        return null == s || "".equals(s) || "".equals(s.trim());
    }

    public static boolean isNotBlank(String s) {
        return !isBlank(s);
    }

    public static Integer lengthCheck(String s) {
        if (isEmpty(s)) {
            return null;
        } else {
            int valueLength = 0;
            String chinese = "[Α-￥]";

            for(int i = 0; i < s.length(); ++i) {
                String temp = s.substring(i, i + 1);
                if (temp.matches(chinese)) {
                    valueLength += 2;
                } else {
                    ++valueLength;
                }
            }

            return valueLength;
        }
    }

    public static Object objectTrim(Object obj) {
        Class<? extends Object> ownerClass = obj.getClass();
        Method[] methodArray = obj.getClass().getDeclaredMethods();

        try {
            for(int i = 0; i < methodArray.length; ++i) {
                String temp = null;
                String tempMethod = null;
                if ("get".equals(methodArray[i].getName().substring(0, 3))) {
                    temp = null;
                    tempMethod = methodArray[i].getName().substring(3);
                    if (methodArray[i].invoke(obj) instanceof String) {
                        temp = (String)methodArray[i].invoke(obj);
                    }

                    if (temp != null) {
                        temp = temp.trim();
                        ownerClass.getMethod("set".concat(tempMethod), String.class).invoke(obj, "".equals(temp) ? null : temp);
                    }
                }
            }
        } catch (Exception var6) {
            var6.printStackTrace();
        }

        return obj;
    }

    public static String objectToString(Object obj) {
        Field[] fields = obj.getClass().getDeclaredFields();
        String str = "";

        for(int i = 0; i < fields.length; ++i) {
            Field f = fields[i];
            if (f.getType().toString().indexOf("String") > 0) {
                str = str + toStringFieldValue(obj, f.getName());
            }
        }

        if (str.endsWith(",")) {
            str = str.substring(0, str.length() - 1);
        }

        return str;
    }

    private static String toStringFieldValue(Object owner, String fieldName) {
        String str = "";
        Class<? extends Object> ownerClass = owner.getClass();
        String methodName = fieldName.substring(0, 1).toUpperCase() + fieldName.substring(1);

        try {
            Method method = ownerClass.getMethod("get" + methodName);
            String tempStr = (String)method.invoke(owner);
            if (isNotBlank(tempStr)) {
                str = methodName + ":" + tempStr + ",";
            }
        } catch (Exception var7) {
            var7.printStackTrace();
        }

        return str;
    }

    public static String duplicateBlankToBlank(String str) {
        while(str.indexOf("\t") >= 0) {
            str = str.replace("\t", " ");
        }

        while(str.indexOf("　") >= 0) {
            str = str.replace("　", " ");
        }

        while(str.indexOf("  ") >= 0) {
            str = str.replace("  ", " ");
        }

        return str;
    }

    public static String appedPrefix(String prefix, int totalLength, String str) {
        StringBuffer buf = new StringBuffer(str);
        if (str.length() < totalLength) {
            for(int i = 0; i < totalLength - str.length(); ++i) {
                buf.insert(0, prefix);
            }
        }

        return buf.toString();
    }

    public static String trim(String str) {
        if (str != null) {
            str = str.replaceAll("(^[\\s　]*)|([\\s　]*$)", "");
        }

        return str;
    }

    public static String nullToEmpty(String str) {
        return str == null ? "" : str;
    }

    public static Integer parseInt(String str) {
        if (str == null) {
            return 0;
        } else {
            Integer temp = 0;

            try {
                temp = Integer.parseInt(str);
            } catch (Exception var3) {
                var3.printStackTrace();
            }

            return temp;
        }
    }

    public static Double parseDouble(String str) {
        if (str == null) {
            return 0.0D;
        } else {
            Double temp = 0.0D;

            try {
                temp = Double.parseDouble(str);
            } catch (Exception var3) {
                var3.printStackTrace();
            }

            return temp;
        }
    }

    public static String emptyToNull(String str) {
        return str != null && str.length() == 0 ? null : str;
    }

    public static String replaceBlank(String str) {
        Pattern p = Pattern.compile("\\s*|\t|\r|\n|\r\n");
        Matcher m = p.matcher(str);
        String after = m.replaceAll("");
        return after;
    }

    public static String objToStr(Object o) {
        return o == null ? null : o.toString();
    }

    public static String removeBrackets(String str) {
        if (str == null) {
            return "";
        } else if (str.contains("(B")) {
            return str.substring(0, str.lastIndexOf("(B"));
        } else if (str.contains("（B")) {
            return str.substring(0, str.lastIndexOf("（B"));
        } else if (str.contains("(W")) {
            return str.substring(0, str.lastIndexOf("(W"));
        } else if (str.contains("（W")) {
            return str.substring(0, str.lastIndexOf("（W"));
        } else if (str.contains("(J")) {
            return str.substring(0, str.lastIndexOf("(J"));
        } else if (str.contains("（J")) {
            return str.substring(0, str.lastIndexOf("（J"));
        } else if (str.contains("(A")) {
            return str.substring(0, str.lastIndexOf("(A"));
        } else {
            return str.contains("（A") ? str.substring(0, str.lastIndexOf("（A")) : str;
        }
    }

    public static <T> T strToNumObj(String str, Class<T> c) {
        if (isEmpty(str)) {
            return null;
        } else if (Integer.class.getName().equals(c.getName())) {
            return (T) Integer.valueOf(str);
        } else if (Float.class.getName().equals(c.getName())) {
            return (T) Float.valueOf(str);
        } else if (Double.class.getName().equals(c.getName())) {
            return (T) Double.valueOf(str);
        } else {
            return Long.class.getName().equals(c.getName()) ? (T) Long.valueOf(str) : null;
        }
    }

    public static String nullObjectToEmpty(Object str) {
        return str == null ? "" : str.toString();
    }

    public static String reverse(String str) {
        return str == null ? null : (new StringBuffer(str)).reverse().toString();
    }

    public static String countCharNum(String str, String a) {
        if (str == null) {
            return null;
        } else {
            int x = 0;

            for(int i = 0; i <= str.length() - 1; ++i) {
                String getstr = str.substring(i, i + 1);
                if (getstr.equals(a)) {
                    ++x;
                }
            }

            return x + "";
        }
    }

    public static Double nullDoubleToZero(Double dbl) {
        return dbl == null ? 0.0D : dbl;
    }

    public static String addZeroFunc(String origin, Integer length) throws Exception {
        if (origin != null && length != null) {
            int ori = Integer.parseInt(origin);
            return String.format("%011d", ori);
        } else {
            return origin;
        }
    }

    public static String removeDecimalZero(String str) {
        if (str != null) {
            if (str.contains(".00")) {
                str = str.replace(".00", "");
            } else if (str.length() > 2 && ".0".equals(str.substring(str.length() - 2))) {
                str = str.replace(".0", "");
            }
        }

        return str;
    }

    public static String getsubStringbyByte(String str, int length) {
        byte[] bytes = new byte[length];
        byte[] sb = str.getBytes();
        System.arraycopy(sb, 0, bytes, 0, sb.length > length ? length : sb.length);
        return (new String(bytes)).trim();
    }

    public static Double StringtoDouble(String dbl) {
        return dbl != null && !"".equals(dbl.trim()) ? Double.parseDouble(dbl) : 0.0D;
    }

    public static Double parseDouble2(String str) {
        Double temp = 0.0D;
        if (str == null) {
            temp = 0.0D;
        } else {
            temp = Double.parseDouble(str);
        }

        return temp;
    }

    public static boolean checkMobile(String mobile) {
        if (null != mobile && !"".equals(mobile.trim())) {
            String reg = "^1[3|4|5|7|8][0-9]{9}$";
            return mobile.matches(reg);
        } else {
            return true;
        }
    }

    private static boolean isMatch(String regex, String orginal) {
        if (orginal != null && !orginal.trim().equals("")) {
            Pattern pattern = Pattern.compile(regex);
            Matcher isNum = pattern.matcher(orginal);
            return isNum.matches();
        } else {
            return false;
        }
    }

    public static boolean isPositiveInteger(String orginal) {
        return isMatch("^\\+{0,1}[1-9]\\d*", orginal);
    }

    public static boolean isNegativeInteger(String orginal) {
        return isMatch("^-[1-9]\\d*", orginal);
    }

    public static boolean isWholeNumber(String orginal) {
        return isMatch("[+-]{0,1}0", orginal) || isPositiveInteger(orginal) || isNegativeInteger(orginal);
    }

    public static boolean isPositiveDecimal(String orginal) {
        return isMatch("\\+{0,1}[0]\\.[1-9]*|\\+{0,1}[1-9]\\d*\\.\\d*", orginal);
    }

    public static boolean isNegativeDecimal(String orginal) {
        return isMatch("^-[0]\\.[1-9]*|^-[1-9]\\d*\\.\\d*", orginal);
    }

    public static boolean isDecimal(String orginal) {
        return isMatch("[-+]{0,1}\\d+\\.\\d*|[-+]{0,1}\\d*\\.\\d+", orginal);
    }

    public static boolean isRealNumber(String orginal) {
        return isWholeNumber(orginal) || isDecimal(orginal);
    }
}

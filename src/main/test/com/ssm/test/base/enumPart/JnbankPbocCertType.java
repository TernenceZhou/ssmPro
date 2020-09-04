package com.ssm.test.base.enumPart;

/**
 * @author
 * @description
 * 江南行征信报告中证件类型转换.
 * @date 2019/9/20
 */
public class JnbankPbocCertType {
    /**
     * 证件类型枚举.
     */
    public enum CertTypeEnum {
        /**身份证.**/
        IDCARD("0", "身份证");

        /**code.**/
        private String code;
        /**value.**/
        private String value;

        /**
         * 构造方法.
         * @param code code.
         * @param value value.
         */
        CertTypeEnum(final String code, final String value) {
            this.code = code;
            this.value = value;
        }

        /**
         * 获取code.
         * @return code
         */
        public String getCode() {
            return code;
        }
        /**
         * 获取value.
         * @return vaule
         */
        public String getValue() {
            return value;
        }
    }

    /**
     *
     * @param code 枚举code.
     * @param enumClass enumClass
     * @param <T> T.
     * @return CertTypeEnum
     */
    public static <T extends CertTypeEnum> T getByCode(
            final String code, final Class<T> enumClass) {
        //通过反射取出Enum所有常量的属性值
        for (T each: enumClass.getEnumConstants()) {
            //利用code进行循环比较，获取对应的枚举
            if (code.equals(each.getCode())) {
                return each;
            }
        }
        return null;
    }
}

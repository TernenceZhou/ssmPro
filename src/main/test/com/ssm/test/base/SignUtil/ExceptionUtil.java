package com.ssm.test.base.SignUtil;

import org.apache.commons.lang3.ClassUtils;

public class ExceptionUtil {
	
	private ExceptionUtil(){
		
	}
	/**
	 * 获取异常的错误信息，对特定异常做特殊处理，比如空指针
	 * 
	 * @param e
	 * @return
	 */
	public static String getErrorMsg(Throwable e) {
		if (e == null) {
			return "";
		}

		if (e instanceof NullPointerException || e instanceof ArithmeticException) {
			final String clsName = ClassUtils.getShortClassName(e, null);

			StackTraceElement[] trace = e.getStackTrace();
			if (trace == null || trace.length == 0) {
				return clsName + ":" + e.getMessage();
			} else {
				return clsName + ":" + e.getMessage() == null ? "" : e.getMessage()+ " " +trace[0].toString();
			}
		}

		return e.getMessage();
	}
}

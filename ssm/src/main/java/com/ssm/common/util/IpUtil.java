package com.ssm.common.util;

import javax.servlet.http.HttpServletRequest;

public class IpUtil {

	/**
	 * 获取IP地址的方法
	 * 
	 * @param request
	 *            请求对象
	 * @return IP地址
	 */
	public static String getUserIpAddr(HttpServletRequest request) {

		// 获取经过代理的客户端的IP地址; 排除了request.getRemoteAddr() 方法
		// 在通过了Apache,Squid等反向代理软件就不能获取到客户端的真实IP地址了
		String ip = getIpAddr(request);
		/*if (ip != null && ip.indexOf(",") > 0) {
			String[] arr = ip.split(",");
			ip = arr[arr.length - 1].trim();// 有多个ip时取最后一个ip
		}*/
		return ip;
	}

	/**
	 * 获取IP地址的方法
	 * 
	 * @param request
	 *            请求对象
	 * @return IP地址
	 */
	private static String getIpAddr(HttpServletRequest request) {

		String ip = request.getHeader("x-forwarded-for");
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("WL-Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getRemoteAddr();
		}
		return ip;
	}
}

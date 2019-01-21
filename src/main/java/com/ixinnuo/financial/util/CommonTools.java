package com.ixinnuo.financial.util;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.ixinnuo.financial.util.strutil.StrUtil;

/**
 * 常用工具类
 * 
 * @author liqq
 *
 */
public class CommonTools {

	private static Logger log = LoggerFactory.getLogger(CommonTools.class);

	// 18位身份证匹配正则
	public static final String ID_CARD_18_REG = "(^[1-9]\\d{9}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$)";

	public static String getIp(HttpServletRequest request) {
		String ip = null;
		try {
			ip = request.getHeader("X-Forwarded-For");
			if (ip != null && ip.indexOf(",") > 0) {
				// 对于通过多个代理的情况，第一个IP为客户端真实IP,多个IP按照','分割
				ip = ip.substring(0, ip.indexOf(","));
			}
			if (StringUtils.isBlank(ip) || "unknown".equalsIgnoreCase(ip)) {
				ip = request.getHeader("Proxy-Client-IP");
			}
			if (StringUtils.isBlank(ip) || "unknown".equalsIgnoreCase(ip)) {
				ip = request.getHeader("WL-Proxy-Client-IP");
			}
			if (StringUtils.isBlank(ip) || "unknown".equalsIgnoreCase(ip)) {
				ip = request.getHeader("HTTP_CLIENT_IP");
			}
			if (StringUtils.isBlank(ip) || "unknown".equalsIgnoreCase(ip)) {
				ip = request.getHeader("HTTP_X_FORWARDED_FOR");
			}
			if (StringUtils.isBlank(ip) || "unknown".equalsIgnoreCase(ip)) {
				ip = request.getHeader("X-Real-IP");
			}
			if (StringUtils.isBlank(ip) || "unknown".equalsIgnoreCase(ip)) {
				ip = request.getRemoteAddr();
			}
		} catch (Exception e1) {
			log.error(e1.getMessage());
		}
		if (StringUtils.isBlank(ip) || "127.0.0.1".equals(ip) || "0:0:0:0:0:0:0:1".equals(ip)) {
			InetAddress inet = null;
			try { // 根据网卡取本机配置的IP
				inet = InetAddress.getLocalHost();
			} catch (UnknownHostException e) {
				log.error("获取ip失败", e);
			}
			ip = inet.getHostAddress();
		}
		return ip;
	}

	// 检查是否为18位身份证号码
	public static boolean checkIdCard18(String idnum) {
		// 正则表达式检查
		Pattern pattern = Pattern.compile(ID_CARD_18_REG);
		Matcher matcher = pattern.matcher(idnum);
		if (!matcher.matches())
			return false;

		// 9开头的18位号码为统一社会信用代码
		if ("9".equals(idnum.substring(0, 1)))
			return false;

		// 验证码验证
		String strFactor = "68947310526894731";
		String strMod = "10X98765432";

		int[] arrNum = new int[17];
		int[] arrFactor = new int[17];
		for (int i = 0; i < 17; i++) {
			arrNum[i] = Integer.parseInt(idnum.substring(i, i + 1));
			arrFactor[i] = Integer.parseInt(strFactor.substring(i, i + 1)) + 1;// 实际计算因子需要加1
		}

		int sum = 0;
		for (int i = 0; i < 17; i++)
			sum += arrNum[i] * arrFactor[i];

		int pos = sum % 11;
		String checkCode = strMod.substring(pos, pos + 1);
		if (checkCode != null && checkCode.equalsIgnoreCase(idnum.substring(17)))
			return true;

		return false;
	}

	/**
	 * 申请序列号,yyyyMMddHHmmss+产品id的md5值的前两个个字符+手机号后4位+统一社会信用代码后4位+1位随机数
	 * @param date
	 * @param mobile
	 * @param unionCode
	 * @param productId
	 * @return
	 */
	public static String createApplyNo(Date date, String mobile, String unionCode, Integer productId) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
		String str1 = sdf.format(date);
		String str2 = DigestUtils.md5Hex(productId.toString()).substring(0,2);
		String str3 = mobile.substring(mobile.length() - 4);
		String str4 = unionCode.substring(unionCode.length() - 4);
		String str5 = UUID.randomUUID().toString().substring(0,1);
		return str1 + str2 + str3 + str4 + str5;
	}
	
	/**
	 * 由字段名获取obj的字段值
	 * @param obj
	 * @param fieldName
	 * @return
	 */
	public static Object getObjValue(Object obj, String fieldName) {
		if (obj == null)
			return null;

		Method[] methods = obj.getClass().getDeclaredMethods();
		for (int i = 0; i < methods.length; i++) {
			try {
				if (("get" + StrUtil.capUpper(fieldName)).equals(methods[i].getName()))
					return methods[i].invoke(obj);
			} catch (IllegalAccessException e) {
				e.printStackTrace();
			} catch (IllegalArgumentException e) {
				e.printStackTrace();
			} catch (InvocationTargetException e) {
				e.printStackTrace();
			}
		}

		return null;
	}

}

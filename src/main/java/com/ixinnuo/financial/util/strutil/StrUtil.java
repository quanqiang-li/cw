package com.ixinnuo.financial.util.strutil;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringUtils;

import com.ixinnuo.financial.util.CommonTools;

/**
 * 字符串处理工具
 */
public class StrUtil {

	// 匹配${xxx}
	public final static String fieldNameReg = "\\$\\{.+?\\}";
	// 匹配${signDate}
	public final static String signDateReg = "\\$\\{signDate\\}";
	// 匹配###SIGNADDRESS###n(150,150)
	public final static String xnqSignReg = "###SIGNADDRESS###\\d+\\(150,150\\)";

	/**
	 * 按正则表达式查找匹配结果列表
	 * 
	 * @param strData
	 * @param strReg
	 * @return
	 */
	public static List<String> listRegResult(String strData, String strReg) {
		if (StringUtils.isNotEmpty(strData)) {
			List<String> list = new ArrayList<String>();

			Pattern pattern = Pattern.compile(strReg);
			Matcher matcher = pattern.matcher(strData);
			while (matcher.find()) {
				list.add(strData.substring(matcher.start(), matcher.end()));
			}
		}

		return null;
	}

	/**
	 * 按正则表达式替换匹配内容
	 * 
	 * @param strData
	 * @param strNew
	 * @param strReg
	 * @return
	 */
	public static String replaceStr(String strData, String strNew, String strReg) {
		if (StringUtils.isNotEmpty(strData)) {
			Pattern pattern = Pattern.compile(strReg);
			Matcher matcher = pattern.matcher(strData);
			while (matcher.find()) {
				strData = strData.substring(0, matcher.start()) + strNew + strData.substring(matcher.end());
				matcher = pattern.matcher(strData);
			}
		}

		return strData;
	}

	/**
	 * 按正则表达式查找匹配内容并在前后添加内容
	 * 
	 * @param strData
	 * @param strReg
	 * @param strPrefix
	 * @param strSuffix
	 * @return
	 */
	public static String wrapStr(String strData, String strReg, String strPrefix, String strSuffix) {
		if (StringUtils.isEmpty(strData))
			return strData;

		StringBuffer buffer = new StringBuffer();

		Pattern pattern = Pattern.compile(strReg);
		Matcher matcher = pattern.matcher(strData);
		while (matcher.find()) {
			buffer.append(strData.substring(0, matcher.start()));
			if (StringUtils.isNotEmpty(strPrefix))
				buffer.append(strPrefix);
			buffer.append(strData.substring(matcher.start(), matcher.end()));
			if (StringUtils.isNotEmpty(strSuffix))
				buffer.append(strSuffix);

			strData = strData.substring(matcher.end());
			matcher = pattern.matcher(strData);
		}
		buffer.append(strData);

		return buffer.toString();
	}

	/**
	 * 按正则表达式用obj字段值替换字符串匹配内容
	 * 
	 * @param strData
	 * @param strNew
	 * @param strReg
	 * @return
	 */
	public static String replaceFromObj(String strData, Object obj) {
		if (StringUtils.isNotEmpty(strData) && obj != null) {
			Pattern pattern = Pattern.compile(fieldNameReg);
			Matcher matcher = pattern.matcher(strData);
			while (matcher.find()) {
				StringBuffer buffer = new StringBuffer();
				buffer.append(strData.substring(0, matcher.start()));
				buffer.append(CommonTools.getObjValue(obj, strData.substring(matcher.start() + 2, matcher.end() - 1)));
				buffer.append(strData.substring(matcher.end()));

				strData = buffer.toString();
				matcher = pattern.matcher(strData);
			}
		}

		return strData;
	}

	/**
	 * 首字母大写
	 * 
	 * @param strData
	 * @return
	 */
	public static String capUpper(String strData) {
		if (StringUtils.isNotBlank(strData)) {
			return StringUtils.upperCase(strData.substring(0, 1)) + strData.substring(1);
		}

		return strData;
	}

	/**
	 * 首字母小写
	 * 
	 * @param strData
	 * @return
	 */
	public static String capLower(String strData) {
		if (StringUtils.isNotBlank(strData)) {
			return StringUtils.lowerCase(strData.substring(0, 1)) + strData.substring(1);
		}

		return strData;
	}

	public static void main(String[] args) {
		String strData = "<p>###SIGNADDRESS###1(150,150)<br></p>&nbsp;&nbsp;<br><p>###SIGNADDRESS###2(150,150)<br></p><p><br></p><p><br></p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ${etrName}<br></p>";
		System.out.println("strData:" + strData);
		String result = wrapStr(strData, xnqSignReg, "<span style=\"color:white;\">", "</span>");
		System.out.println("result:" + result);
	}

}

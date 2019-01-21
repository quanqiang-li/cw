package com.ixinnuo.financial.conf;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.lang.StringUtils;
import org.springframework.core.convert.converter.Converter;

/**
 * 日期转换器，解决在post请求中日期类型参数自动转Date类型
 *
 */
public class StringToDateConverter implements Converter<String, Date> {

	private static final String dateFormatFirst = "yyyy-MM-dd HH:mm:ss";
	private static final String dateFormatSecond = "yyyy-MM-dd";
	private static final String dateFormatThird = "yyyyMMdd";

	@Override
	public Date convert(String source) {
		if (StringUtils.isBlank(source)) {
			return null;
		}
		source = source.trim();
		SimpleDateFormat formatter;
		try {
			if(source.contains(":")){
				formatter = new SimpleDateFormat(dateFormatFirst);
			}else if(source.contains("-")){
				formatter = new SimpleDateFormat(dateFormatSecond);
			}else{
				formatter = new SimpleDateFormat(dateFormatThird);
			}
			Date dtDate = formatter.parse(source);
			return dtDate;
		} catch (Exception e) {
			throw new RuntimeException(String.format("parser %s to Date fail", source));
		}
	}

}

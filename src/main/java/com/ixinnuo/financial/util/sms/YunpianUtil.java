package com.ixinnuo.financial.util.sms;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.yunpian.sdk.YunpianClient;
import com.yunpian.sdk.model.Result;
import com.yunpian.sdk.model.SmsSingleSend;

public class YunpianUtil {
	
	private static Logger logger = LoggerFactory.getLogger(YunpianUtil.class);

	private static final String API_KEY = "85c81a2273f54df8da2a7bed83b0d974";
	private static final String SIGN = "【爱信诺征信】";

	/**
	 * 发送短信验证码
	 * @param mobile 手机号
	 * @param verifyCode 验证码
	 * @return 0成功
	 */
	public static Integer sendVerifyCode(String mobile,String verifyCode) {
		YunpianClient yunpianClient = new YunpianClient(API_KEY).init();
		// 发送短信API
		Map<String, String> param = yunpianClient.newParam(2);
		param.put(YunpianClient.MOBILE, mobile);
		String text = "验证码：#code#，3分钟内有效。请勿泄漏给他人使用，如非本人操作，请忽略本短信".replace("#code#", verifyCode);
		param.put(YunpianClient.TEXT, SIGN + text);
		Result<SmsSingleSend> r = yunpianClient.sms().single_send(param);
		//r.getData()={"code":0,"msg":"发送成功","count":1,"fee":0.048,"unit":"RMB","mobile":"15600231289","sid":30035830096}
		logger.info("发送短信验证码{}",r.getDetail());
		Integer code = r.getCode();
		yunpianClient.close();
		return code;
	}
	
	/**
	 * 发送短信通知
	 * @param mobile 手机号
	 * @param text 短信内容,符合云片网上的审核通过的模版
	 * @return 0成功
	 */
	public static Integer sendNotice(String mobile,String text) {
		YunpianClient yunpianClient = new YunpianClient(API_KEY).init();
		// 发送短信API
		Map<String, String> param = yunpianClient.newParam(2);
		param.put(YunpianClient.MOBILE, mobile);
		param.put(YunpianClient.TEXT, SIGN + text);
		Result<SmsSingleSend> r = yunpianClient.sms().single_send(param);
		//r.getData()={"code":0,"msg":"发送成功","count":1,"fee":0.048,"unit":"RMB","mobile":"15600231289","sid":30035830096}
		logger.info("发送短信验证码{}",r.getDetail());
		Integer code = r.getCode();
		yunpianClient.close();
		return code;
	}
	
	public static void main(String[] args) {
		sendVerifyCode("15600231289", "123456");
	}
}

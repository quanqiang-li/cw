package com.ixinnuo.financial.util.sms.emay;

public class SingleRequest {

	/**
	 * 手机号
	 */
	public String mobile;
	/**
	 * 短信内容,完整定义【航信金融】您的验证码是123
	 */
	public String content;
	/**
	 * 发送时间,单位毫秒
	 */
	public long requestTime;
	/**
	 * 过期时间单位秒,亿美在收到后验证requestTime+requestValidPeriod>接收到的时间
	 */
	public int requestValidPeriod;
}

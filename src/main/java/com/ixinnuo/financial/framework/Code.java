package com.ixinnuo.financial.framework;

/**
 * 错误信息枚举类型
 * 
 * @ClassName: Error
 * @Description: TODO
 *
 */
public enum Code {
	/**
	 * 成功
	 */
	OK(0, "成功"),
	/**
	 * 成功
	 */
	ERROR(1999, "成功"),
	/**
	 * 参数为空
	 */
	EMPTY_PARAMETER_ERROR(1001, "参数为空"), 
	NOT_LOGIN_ERROR(1002, "您还未登录,无法操作"),
	SMS_ERROR(1003,"短信发送失败"),

	;
	/**
	 * 错误代码
	 */
	private final int code;

	/**
	 * 错误信息
	 */
	private final String msg;

	private Code(int code, String msg) {
		this.code = code;
		this.msg = msg;
	}

	public int getCode() {
		return code;
	}

	public String getMsg() {
		return msg;
	}

}

package com.ixinnuo.financial.enumpackage;
/**
 * 常用枚举类,满足整数和字符串,按需设置
 * @author liqq
 *
 */
public enum CommonEnum {
	
	/**
	 * 默认分页大小
	 */
	PAGE_SIZE("",10),
	/**
	 * 默认起始页
	 */
	PAGE_NUM("",1),
	/**
	 * 默认分页大小
	 */
	LOGIN_SESSION_KEY("login:key",10);
	
	private final String string;
	
	private final Integer integer;
	
	private CommonEnum(String string,Integer integer) {
		this.string = string;
		this.integer = integer;
	}
	
	public Integer getInteger() {
		return integer;
	}
	public String getString() {
		return string;
	}
	
	public static void main(String[] args) {
		System.out.println(CommonEnum.PAGE_SIZE.getInteger());
	}
}

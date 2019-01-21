package com.ixinnuo.financial.util.bigdata;

import java.util.ArrayList;
import java.util.List;

import com.alibaba.fastjson.JSON;
/**
 * 大数据请求参数对象
 * @author liqq
 *
 */
public class BigDataQueryParam {
	
	/**
	 * 工商基本信息接口号
	 */
	public final static String INTERFACEID_02 = "IXNZX_INTERFACE_OUT_02";
	/**
	 * 发票签到
	 */
	public final static String INTERFACEID_17 = "IXNZX_INTERFACE_OUT_17";
	/**
	 * 发票采集
	 */
	public final static String INTERFACEID_24 = "IXNZX_INTERFACE_OUT_24";
	/**
	 * 爱税贷详细指标ver
	 */
	public final static String INTERFACEID_50 = "IXNZX_INTERFACE_OUT_50";
	/**
	 * 数据状态
	 */
	public final static String INTERFACEID_51 = "IXNZX_INTERFACE_OUT_51";

	/**
	 * 接口号
	 */
	public String INTERFACEID;
	/**
	 * 参数
	 */
	public Data DATA;
	
	
	/**
	 * 参数对象
	 * @author liqq
	 *
	 */
	public static class Data{
		/**
		 * 基本信息
		 */
		 public final static String LIST_BASIC = "BASIC";
		 /**
		  * 主要人员
		  */
		 public final static String LIST_PERINFO = "PERINFO";
		
		/**
		 * 企业名称或税号,建议税号
		 */
		public String qyxx;
		/**
		 * 企业名称,有的接口是指定字段的
		 */
		public String mc;
		/**
		 * 企业税号,有的接口是指定字段的
		 */
		public String sh;
		
		/**
		 * 查询的数据项,可选项,不设置默认所有数据项
		 */
		public List<String> list;
		
	}
	
	public static void main(String[] args) {
		BigDataQueryParam param = new BigDataQueryParam();
		param.INTERFACEID=BigDataQueryParam.INTERFACEID_02;
		Data data = new Data();
		param.DATA = data;
		data.qyxx="爱信诺征信有限公司";
		data.list = new ArrayList<>();
		data.list.add(Data.LIST_BASIC);
		data.list.add(Data.LIST_PERINFO);
		String queryParam = JSON.toJSONString(param);
		System.out.println(queryParam);
	}
}

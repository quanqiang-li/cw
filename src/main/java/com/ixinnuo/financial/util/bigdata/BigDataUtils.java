package com.ixinnuo.financial.util.bigdata;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSON;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.ixinnuo.financial.util.bigdata.BigDataQueryParam.Data;
import com.ixinnuo.financial.util.httpclient.HttpClientUtils;
import com.ixinnuo.financial.util.json.JsonUtil;

/**
 * 大数据接口服务
 * 
 * @author aisino-liqq
 */
@Component
public final class BigDataUtils {
	
	/*大数据服务地址*/
	public static String bigdataServer;
	
	private static Logger logger = LoggerFactory.getLogger(BigDataUtils.class);

	private BigDataUtils() {
    };

    /**
     * 获取企业基本信息
     * 
     * @param queryParam
     *            1:名称 2:税号 3:爱信诺编码 任选其一即可
     * @param timeout
     *            超时时间，单位毫秒
     * @return 企业基本信息
     */
    public static EnterpriseVo getEnterpriseVo(String queryParam, int timeout) {
        EnterpriseVo enterpriseVo = null;
        String url = BigDataUtils.bigdataServer + "/api/v2/getBasicAndXydj/";
        url = url + queryParam;
        String requestByGetMethod = HttpClientUtils.requestByGet(url, timeout);
        System.out.println(requestByGetMethod);
        JsonUtil util = new JsonUtil();
        util.setFAIL_ON_UNKNOWN_PROPERTIES(false);
        try {
            enterpriseVo = util.jsonStr2Object(requestByGetMethod, EnterpriseVo.class);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return enterpriseVo;
    }
    
	/**
     * @param registVo
     *            待注册企业 1:名称 2:税号 3:爱信诺编码 任选其一即可,fre 频率 单位天 ，无直接触发,优先级 0-5，5最高
     * @return 注册结果 true 成功，false 失败
     */
    public static boolean registEnterprise(RegistVo registVo) {
        JsonUtil util = new JsonUtil();
        util.setFAIL_ON_UNKNOWN_PROPERTIES(false);
        String registVoStr;
        try {
            registVoStr = util.object2jsonStr(registVo);
            // System.out.println(registVoStr);
        }
        catch (JsonProcessingException e1) {
            return false;
        }
        String url = BigDataUtils.bigdataServer + "/api/v2/etr/update/";
        Map<String, String> param = new HashMap<>();
        param.put("queryParam", registVoStr);
        String httpResult = HttpClientUtils.requestByPostForm(url, param, 5000);
        System.out.println("注册企业到大数据"+ registVo.mc + registVo.sh);
        try {
            System.out.println(httpResult);
            @SuppressWarnings("rawtypes")
            Map resultMap = util.jsonStr2Object(httpResult, Map.class);
            Object errMsg = resultMap.get("errMsg");
            if (!"success".equals(errMsg)) {
                return false;
            }
        }
        catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    /**
     * 新版大数据信息查询
     * @param qyxx 名称,统一社会信用代码,爱信诺编码 三选一
     * @param interfaceId BigDataQueryParam定义了接口常量
     * @param dataList Data定义了常量
     * @param timeout 超时时间 单位毫秒
     * @return
     */
    public static String getEnterinfoV2(String qyxx,String interfaceId,List<String> dataList,int timeout){
    	BigDataQueryParam param = new BigDataQueryParam();
		param.INTERFACEID=interfaceId;
		Data data = new Data();
		param.DATA = data;
		data.qyxx=qyxx;
		data.mc=qyxx;
		data.sh=qyxx;
		data.list = dataList;
		String queryParam = JSON.toJSONString(param);
		String url = BigDataUtils.bigdataServer + "/api/v2/common/chooseInterface/";
		logger.info("请求大数据{},参数{}",url,queryParam);
		Map<String, String> form = new HashMap<>();
		form.put("queryParam", queryParam);
		String requestByPostForm = HttpClientUtils.requestByPostForm(url, form, timeout);
		logger.info("大数据结果{}",requestByPostForm);
		return requestByPostForm;
    }
    
    public static void main(String[] args) {}
    
    //@Value("${bigdata.server}")
    public void setBigdataServer(String bigdataServer) {
    	BigDataUtils.bigdataServer = bigdataServer;
    }

}

package com.ixinnuo.financial.util.sms.emay;

import java.io.IOException;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.config.RequestConfig.Builder;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ByteArrayEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.ixinnuo.financial.framework.Code;
import com.ixinnuo.financial.framework.ReturnData;

/**
 * 发送短信工具类
 * 
 * @author liqq
 *
 */
public class EmayUtil {

	private static Logger logger = LoggerFactory.getLogger(EmayUtil.class);

	// appId
	private static final String APPID = "9SDK-EMY-0999-SBRPT";// 请联系销售，或者在页面中 获取
	// 密钥
	private static final String SECRETKEY = "FD3195F7F7536FC6";// 请联系销售，或者在页面中
																// 获取
	// 接口地址
	private static final String HOST = "http://101.201.79.216";// 从http://geturl.eucp.b2m.cn/sdk/getInters
	// 加密算法
	private static final String ALGORITHM = "AES/ECB/PKCS5Padding";
	// 编码
	private static final String ENCODE = "UTF-8";
	// 状态码
	private static Map<String, String> map = new HashMap<>();

	static {
		map.put("SUCCESS", "成功");
		map.put("ERROR_APPID", "AppId错误");
		map.put("ERROR_NO_VOICE_SERVICE", "语音服务未开启");
		map.put("ERROR_VOICE_CONTENT", "语音验证码格式错误");
		map.put("ERROR_ENCRYPTION", "解密失败【安全接口专用】");
		map.put("ERROR_PARAMS", "请求参数错误");
		map.put("ERROR_REQUEST_NO_VALID", "请求超时【安全接口专用】");
		map.put("ERROR_CLIENT_IP", "不识别的Ip");
		map.put("ERROR_OVER_SPEED", "请求超速");
		map.put("ERROR_MOBILE_EMPTY", "手机号为空");
		map.put("ERROR_MOBILE_NUMBER", "号码数量过多");
		map.put("ERROR_MOBILE_ERROR", "手机号码错误");
		map.put("ERROR_CONTENT_EMPTY", "短信内容为空");
		map.put("ERROR_SMS_TIME", "定时时间过早或过久");
		map.put("ERROR_CUSTOM_SMSID", "自定义消息ID过长");
		map.put("ERROR_EXTENDED_CODE", "扩展码错误");
		map.put("ERROR_LONG_CONTENT", "短信内容过长");
		map.put("ERROR_BALANCE", "余额不足");
		map.put("ERROR_TIMESTAMP", "时间戳错误【普通接口专用】");
		map.put("ERROR_SIGN", "签名错误【普通接口专用】");
		map.put("ERROR_NO_RETRIEVE_SERVICE", "未开通重新获取状态报告服务【重新获取状态报告接口专用】");
		map.put("ERROR_REPORT_TIME", "状态报告时间错误【重新获取状态报告接口专用】");
		map.put("ERROR_TOO_MUCH_SMSIDS", "SMSID过多【重新获取状态报告接口专用】");
	}

	public static void main(String[] args) throws Exception {

		//sendSms("15910756898", "感谢您使用航信金融");
		getBalance();
	}

	/**
	 * 发送单条短信
	 * 
	 * @param mobile
	 *            手机号
	 * @param content
	 *            短信内容
	 */
	public static ReturnData sendSms(String mobile, String content) {
		if(StringUtils.isBlank(mobile) || StringUtils.isBlank(content)){
			return new ReturnData(Code.EMPTY_PARAMETER_ERROR);
		}
		SingleRequest sr = new SingleRequest();
		sr.mobile = mobile;
		sr.content = "【航信金融】" + content;
		sr.requestTime = Calendar.getInstance().getTimeInMillis();
		sr.requestValidPeriod = 100;

		String requestJson = JSON.toJSONString(sr);
		logger.info("发送短信:{}",requestJson);
		String result = null;
		try {
			byte[] requestBytes = requestJson.getBytes(ENCODE);
			byte[] encrypt = AES.encrypt(requestBytes, SECRETKEY.getBytes(ENCODE), ALGORITHM);
			result = requestByPost(HOST + "/inter/sendSingleSMS", encrypt, 15 * 1000);
			logger.info("短信结果:{}",result);
		} catch (Exception e) {
			e.printStackTrace();
		}
		if(result.startsWith("ERROR")){
			ReturnData returnData = new ReturnData(Code.SMS_ERROR);
			returnData.getDataBody().put("smsResult", result);
			return returnData;
		}
		ReturnData returnData = new ReturnData(Code.OK);
		returnData.getDataBody().put("smsResult", result);
		return returnData;
	}
	
	/**
	 * 查询余额
	 */
	private static void getBalance(){
		SingleRequest sr = new SingleRequest();
		sr.mobile = null;
		sr.content = null;
		sr.requestTime = Calendar.getInstance().getTimeInMillis();
		sr.requestValidPeriod = 100;
		String requestJson = JSON.toJSONString(sr);
		logger.info("查询余额:{}",requestJson);
		String result = null;
		try {
			byte[] requestBytes = requestJson.getBytes(ENCODE);
			byte[] encrypt = AES.encrypt(requestBytes, SECRETKEY.getBytes(ENCODE), ALGORITHM);
			result = requestByPost(HOST + "/inter/getBalance", encrypt, 15 * 1000);
			logger.info("短信结果:{}",result);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 发送
	 * @param url
	 * @param content
	 * @param timeout
	 * @return 发送结果,成功是响应内容,失败是ERROR开头
	 */
	private static String requestByPost(String url, byte[] content, int timeout) {
		HttpPost httpPost = new HttpPost(url);
		// url格式编码
		httpPost.setEntity(new ByteArrayEntity(content));
		httpPost.addHeader("appId", APPID);
		httpPost.addHeader("Charset", "UTF-8");
		Builder builder = RequestConfig.custom();
		// 获取链接的时间 单位毫秒
		builder.setConnectionRequestTimeout(timeout)
				// 链接时间，从共享池获取链接
				.setConnectTimeout(timeout)
				// 读取数据时间
				.setSocketTimeout(timeout);
		httpPost.setConfig(builder.build());
		String result = "";
		try (CloseableHttpClient httpclient = HttpClients.createDefault(); CloseableHttpResponse response = httpclient.execute(httpPost)) {
			Header header = response.getHeaders("result")[0];
			String value = header.getValue().trim();
			logger.info("短信发送状态:{}", map.get(value));
			if(!"SUCCESS".equalsIgnoreCase(value)){
				return value + map.get(value);
			}
			HttpEntity responseEntity = response.getEntity();
			if (responseEntity != null) {
				byte[] byteArray = EntityUtils.toByteArray(responseEntity);
				byte[] decrypt = AES.decrypt(byteArray, SECRETKEY.getBytes(ENCODE), ALGORITHM);
				result = new String(decrypt, ENCODE);
			}
		} catch (ClientProtocolException e) {
			logger.error("httpclient异常", e);
		} catch (IOException e) {
			logger.error("httpclient异常", e);
		}
		return result;
	}

}

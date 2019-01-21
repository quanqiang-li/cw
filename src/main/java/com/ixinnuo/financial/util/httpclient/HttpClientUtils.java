package com.ixinnuo.financial.util.httpclient;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.config.RequestConfig.Builder;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisherAware;

/**
 * 基于httpclient 4.5封装的工具类
 * 
 * @author aisino
 */
public class HttpClientUtils {
    
    private static final Logger logger = LoggerFactory.getLogger(HttpClientUtils.class); 


    /**
     * get请求，请自行拼接好url，设置超时时间
     * 
     * @param url
     *            请求的url
     * @param timeout
     *            超时，单位毫秒
     * @return
     */
    public static String requestByGet(String url, int timeout) {
        logger.info("get url:{}",url);
        HttpGet httpget = new HttpGet(url);
        Builder builder = RequestConfig.custom();
        // 获取链接的时间
        builder.setConnectionRequestTimeout(timeout)
                // 链接时间，从共享池获取链接
                .setConnectTimeout(timeout)
                // 读取数据时间
                .setSocketTimeout(timeout);
        httpget.setConfig(builder.build());
        String string = "";
        try (CloseableHttpClient httpclient = HttpClients.createDefault();
                CloseableHttpResponse response = httpclient.execute(httpget)) {
            HttpEntity entity = response.getEntity();
            if (entity != null) {
                string = EntityUtils.toString(entity, "utf-8");
            }
        }
        catch (ClientProtocolException e) {
            e.printStackTrace();
        }
        catch (IOException e) {
            e.printStackTrace();
        }
        logger.info("get result:{}",string);
        return string;
    }

    /**
     * post请求，设置超时时间
     * 
     * @param url
     *            请求的url
     * @param params
     *            参数，封装在map
     * @param timeout
     *            超时，单位毫秒
     * @return
     */
    public static String requestByPostForm(String url, Map<String, String> params, int timeout) {
        logger.info("post url:{}",url);
        HttpPost httpPost = new HttpPost(url);
        List<NameValuePair> list = new ArrayList<NameValuePair>();
        if(null != params){
            Iterator<Entry<String, String>> iterator = params.entrySet().iterator();
            while(iterator.hasNext()){
                Entry<String, String> next = iterator.next();
                list.add(new BasicNameValuePair(next.getKey(), next.getValue()));
                logger.info("post param-{}:{}",next.getKey(),next.getValue());
            }
        }
        // url格式编码
        UrlEncodedFormEntity uefEntity;
        try {
            uefEntity = new UrlEncodedFormEntity(list, "UTF-8");
            httpPost.setEntity(uefEntity);
        }
        catch (UnsupportedEncodingException e1) {
            e1.printStackTrace();
        }
        Builder builder = RequestConfig.custom();
        // 获取链接的时间
        builder.setConnectionRequestTimeout(timeout)
                // 链接时间，从共享池获取链接
                .setConnectTimeout(timeout)
                // 读取数据时间
                .setSocketTimeout(timeout);
        httpPost.setConfig(builder.build());
        String string = "";
        try (CloseableHttpClient httpclient = HttpClients.createDefault();
                CloseableHttpResponse response = httpclient.execute(httpPost)) {
            HttpEntity entity = response.getEntity();
            if (entity != null) {
                string = EntityUtils.toString(entity, "utf-8");
            }
        }
        catch (ClientProtocolException e) {
            e.printStackTrace();
        }
        catch (IOException e) {
            e.printStackTrace();
        }
        logger.info("post result:{}",string);
        return string;
    }
    
    /**
	 * psot json
	 * 
	 * @param url
	 * @param json
	 * @param timeout
	 *            超时，单位毫秒
	 * @return
	 */
	public static String requestByPostJson(String url, String json, int timeout) {
		logger.info("post url:{};post json:{}", url, json);
		HttpPost httpPost = new HttpPost(url);
		StringEntity entity = new StringEntity(json, "utf-8");
		// url格式编码
		httpPost.setEntity(entity);
		httpPost.addHeader("Content-Type", "application/json");
		Builder builder = RequestConfig.custom();
		// 获取链接的时间 单位毫秒
		builder.setConnectionRequestTimeout(timeout)
				// 链接时间，从共享池获取链接
				.setConnectTimeout(timeout)
				// 读取数据时间
				.setSocketTimeout(timeout);
		httpPost.setConfig(builder.build());
		String string = "";
		try (CloseableHttpClient httpclient = HttpClients.createDefault();
				CloseableHttpResponse response = httpclient.execute(httpPost)) {
			HttpEntity responseEntity = response.getEntity();
			if (responseEntity != null) {
				string = EntityUtils.toString(responseEntity, "utf-8");
			}
		} catch (ClientProtocolException e) {
			logger.error("httpclient异常", e);
		} catch (IOException e) {
			logger.error("httpclient异常", e);
		}
		logger.info("post result:{}", string);
		return string;
	}

    public static void main(String[] args) {
        String requestByget = requestByGet("http://www.baidu.com", 1000 * 5);
        System.out.println(requestByget);
        
//        Map<String, String> params = new HashMap<String, String>();
//        params.put("ss", "hello");
//        String requestByPostForm = requestByPostForm("http://www.baidu.com", params , 1000*5);
//        System.out.println(requestByPostForm);
    }
}

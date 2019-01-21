package com.ixinnuo.financial.util.report;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;
import java.util.Map.Entry;

import org.apache.commons.codec.Charsets;
import org.apache.commons.lang.StringUtils;

public class ReportEncodeUtil {
	/**
	 * 组装签名的字段
	 * @param params 参数
	 * @param urlEncoder 是否urlEncoder
	 * @return String
	 */
	public static String paramSort(Map<String, String> params, boolean urlEncoder) {
		// 先将参数以其参数名的字典序升序进行排序
		TreeMap<String, String> sortedParams = new TreeMap<String, String>(params);
		// 遍历排序后的字典，将所有参数按"key=value"格式拼接在一起
		StringBuilder sb = new StringBuilder();
		boolean first = true;
		for (Entry<String, String> param : sortedParams.entrySet()) {
			String value = param.getValue();
			if (StringUtils.isBlank(value)) {
				continue;
			}
			if (first) {
				first = false;
			} else {
				sb.append("&");
			}
			sb.append(param.getKey()).append("=");
			if (urlEncoder) {
				try {
					value = urlEncode(value);
				}
				catch (UnsupportedEncodingException e) {
				}
			}
			sb.append(value);
		}
		return sb.toString();
	}

	/**
	 * urlEncode
	 * @param src 微信参数
	 * @return String
	 * @throws UnsupportedEncodingException 编码错误
	 */
	public static String urlEncode(String src) throws UnsupportedEncodingException {
		return URLEncoder.encode(src, Charsets.UTF_8.name()).replace("+", "%20");
	}

	/**
	 * 生成签名
	 * @param params 参数
	 * @param paternerKey 支付密钥
	 * @return sign
	 */
	public static String createSign(Map<String, String> params, String paternerKey) {
		// 生成签名前先去除sign
		params.remove("sign");
		String stringA = paramSort(params, false);
		String stringSignTemp = stringA + "&key=" + paternerKey;
		return MD5Encode(stringSignTemp).toUpperCase();
	}

	private static String MD5Encode(String data) {
		try {
			MessageDigest md = MessageDigest.getInstance("MD5");
			try {
				return TranscodeUtil.byteArrayToHexStr(md.digest(data.getBytes("utf-8")));
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			}
		}
		catch (NoSuchAlgorithmException ex) {
			ex.printStackTrace();
		}
		return null;
	}

	/**
	 * 校验sign
	 * @param params 参数
	 * @param paternerKey 密钥
	 * @return {boolean}
	 */
	public static boolean verifyNotify(Map<String, String> params, String paternerKey) {
		String sign = params.get("sign");
		System.out.println("sign:"+sign);
		String localSign = createSign(params, paternerKey);
		System.out.println("localSign:"+localSign);
		return sign.equals(localSign);
	}

	public static void main(String[] args) {
		Map<String, String> params = new HashMap<String, String>();
		params.put("qymcParam", "合肥卓润商贸有限公司");
		params.put("sourceParam", "ck");
		params.put("userParam", "payh");
//		String sign = createSign(params, "ixinnuo_123");
		params.put("sign", "32C11EFB9793D2BFD542BE901A8C673F");
//		System.out.println(sign);

		System.out.println(verifyNotify(params, "ixinnuo_123"));
	}
}

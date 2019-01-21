package com.ixinnuo.financial.util.security;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

import org.apache.commons.lang.StringUtils;

/**
 * 安全工具类
 * 
 * @author liqq
 */
public final class SecurityUtils {
    
    /**
     * 私有构造函数，防止用户实例化工具类
     * 创建一个新的实例 SecurityUtils.
     */
    private SecurityUtils() {
        
    }

    /**
     * 定义加密方式
     */
    private static final String KEY_SHA1 = "SHA-1";

    /**
     * 定义加盐方式
     */
    private static final String KEY_SALT = "SHA1PRNG";

    /**
     * 全局数组
     */
    private static final String[] hexDigits = { 
        "0", "1", "2", "3", "4", "5", "6", "7", 
        "8", "9", "a", "b", "c", "d", "e", "f" };

    /**
     * SHA 加密
     * 
     * @param data
     *            需要加密的字符串
     * @return 加密之后的字符串
     * @throws Exception 异常
     */
    public static String encryptSHA(String data){
        // 验证传入的字符串
        if (StringUtils.isBlank(data)) {
            return "";
        }
        // 创建具有指定算法名称的信息摘要
		MessageDigest sha = null;
		try {
			sha = MessageDigest.getInstance(KEY_SHA1);
			// 使用指定的字节数组对摘要进行最后更新
			sha.update(data.getBytes("UTF-8"));
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
        // 完成摘要计算
        byte[] bytes = sha.digest();
        // 将得到的字节数组变成字符串返回
        return byteArrayToHexString(bytes);
    }

    /**
     * SHA 加密带盐值
     * 
     * @param data
     *            待加密数据
     * @param salt
     *            盐值
     * @return 密文
     * @throws Exception 异常
     */
    public static String encryptSHAWithSalt(String data, String salt){
        return encryptSHA(data + salt);
    }

    /**
     * 获取盐值，40位长度
     * 
     * @return 盐
     * @throws Exception 异常
     */
    public static String getSaltBySHA(){
        SecureRandom instance = null;
		try {
			instance = SecureRandom.getInstance(KEY_SALT);
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}
        byte[] bytes = new byte[20];
        instance.nextBytes(bytes);
        return byteArrayToHexString(bytes);
    }

    /**
     * 将一个字节转化成十六进制形式的字符串
     * 
     * @param b
     *            字节数组
     * @return 字符串
     */
    private static String byteToHexString(byte b) {
        int ret = b;
        if (ret < 0) {
            ret += 256;
        }
        int m = ret / 16;
        int n = ret % 16;
        return hexDigits[m] + hexDigits[n];
    }

    /**
     * 转换字节数组为十六进制字符串
     * 
     * @param bytes
     *            字节数组
     * @return 十六进制字符串
     */
    private static String byteArrayToHexString(byte[] bytes) {
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < bytes.length; i++) {
            sb.append(byteToHexString(bytes[i]));
        }
        return sb.toString();
    }

}

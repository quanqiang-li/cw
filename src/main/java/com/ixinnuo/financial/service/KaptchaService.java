package com.ixinnuo.financial.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ixinnuo.financial.dao.redis.RedisDao;


/**
 * @ClassName: KaptchaService
 * @Description: 图像验证码相关服务 *
 */
@Service
public class KaptchaService {
	private final Logger logger = LoggerFactory.getLogger(KaptchaService.class);

	/**
	 * 图形验证码redis前缀
	 */
	private static final String KAPTCHA_CODE_PREFIX = "KAPTCHA_CODE_";

	/**
	 * 定义常量：一分钟(60秒)
	 */
	private static final int ONE_MINUTE = 60;

	@Autowired
	private RedisDao redisDao;

	public boolean writeKaptchaValueToRedis(String codeKey, String value) {
		logger.info("codeKey=" + codeKey + ",value=" + value);
		return redisDao.writeStringValue(KAPTCHA_CODE_PREFIX + codeKey, ONE_MINUTE, value);
	}

	public String getKaptchaValueFromRedis(String codeKey) {
		logger.info("codeKey:" + codeKey);
		return redisDao.getStringValue(KAPTCHA_CODE_PREFIX + codeKey);
	}

}

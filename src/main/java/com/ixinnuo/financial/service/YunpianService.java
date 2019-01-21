package com.ixinnuo.financial.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ixinnuo.financial.dao.redis.RedisDao;
import com.ixinnuo.financial.util.sms.YunpianUtil;

/**
 * 云片网短信服务
 * 
 * @author liqq
 *
 */
@Service
public class YunpianService {

	// redis存储的key
	private static final String VERFIFY_CODE_PREFIX = "VERFIFY:CODE:";
	// redis存储的有效时间
	private static final long VERFIFY_CODE_TIMEOUT = 180;

	@Autowired
	private RedisDao redisDao;

	/**
	 * 发送短信验证码,并存储到redis,有效期3分钟
	 * @param mobile 手机号
	 * @return true成功,false失败
	 */
	public boolean sendVerifyCode(String mobile) {
		// 6位随机数
		int code = (int) ((Math.random() * 9 + 1) * 100000);
		Integer sendVerifyCode = YunpianUtil.sendVerifyCode(mobile, code + "");
		//非0失败
		if(sendVerifyCode != 0){
			return false;
		}
		redisDao.writeStringValue(VERFIFY_CODE_PREFIX + mobile, VERFIFY_CODE_TIMEOUT, code + "");
		return true;

	}
	/**
	 * 校验短信验证码
	 * @param mobile 手机号
	 * @param code 验证码
	 * @return true成功,false失败
	 */
	public boolean checkVerfifyCode(String mobile,String code){
		String verifyCode = redisDao.getStringValue(VERFIFY_CODE_PREFIX + mobile);
		//一致成功
		if(code.equals(verifyCode)){
			//验证成功后失效,不可重复使用
			redisDao.deleteKey(VERFIFY_CODE_PREFIX + mobile);
			return true;
		}
		return false;
	}

	public static void main(String[] args) {
		// [0.0,1.0)*9;

		System.out.println((int) ((Math.random() * 9 + 1) * 100000));
	}
}

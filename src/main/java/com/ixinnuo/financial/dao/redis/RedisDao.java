package com.ixinnuo.financial.dao.redis;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.stereotype.Service;

/**
 * 关于如何使用 RedisTemplate操作redis，建议查阅官方文档，见下面的地址：
 * http://docs.spring.io/spring-data/redis/docs/1.8.1.RELEASE/reference/html/#
 * redis:template
 * 
 * @author zhangkm
 */
@Service("redisDao")
public class RedisDao {

	/**
	 * redisTemplate
	 */
	//@Autowired
	private RedisTemplate<String, ?> redisTemplate;
	
	//@Autowired
	private StringRedisTemplate stringRedisTemplate;

	/**
	 * 向一个String写入值，如果不存在，则创建一个String
	 * 
	 * @param key
	 *            key
	 * @param seconds
	 *            持续时间（秒）
	 * @param value
	 *            value
	 * @return 是否写成功
	 */
	public boolean writeStringValue(String key, long seconds, String value) {
		return redisTemplate.execute(new RedisCallback<Boolean>() {

			@Override
			public Boolean doInRedis(RedisConnection connection) throws DataAccessException {
				RedisSerializer<String> serializer = redisTemplate.getStringSerializer();
				connection.setEx(serializer.serialize(key), seconds, serializer.serialize(value));
				return true;
			}
		});
	}

	/**
	 * 设置字符串的key-value,永不过期
	 * @param key
	 * @param value
	 */
	public  void setValue(String key,String value){
		stringRedisTemplate.opsForValue().set(key, value);
    }

	/**
	 * 获取String的值
	 * 
	 * @param key
	 *            key
	 * @return value
	 */
	public String getStringValue(String key) {
		// TODO: 这个方法似乎不是官方推荐方案，建议修改。
		String ret = (String) redisTemplate.opsForValue().get(key);
		return ret;
	}

	/**
	 * 向有序列表插入一条数据，如果存在则覆盖
	 * 
	 * @param key
	 *            key
	 * @param score
	 *            score
	 * @param member
	 *            member
	 * @return 是否成功
	 */
	public boolean addSortedSetMember(String key, double score, String member) {
		return redisTemplate.execute(new RedisCallback<Boolean>() {

			@Override
			public Boolean doInRedis(RedisConnection connection) throws DataAccessException {
				RedisSerializer<String> serializer = redisTemplate.getStringSerializer();
				connection.zAdd(serializer.serialize(key), score, serializer.serialize(member));
				return true;
			}
		});
	}

	/**
	 * 删除一个String/Set/Hash/List
	 * 
	 * @param key
	 *            key
	 */
	public void deleteKey(String key) {
		redisTemplate.delete(key);
	}

	/**
	 * 设置过期时间
	 * 
	 * @param key
	 * @param date
	 * @return
	 */
	public boolean setExpire(String key, Date date) {
		return redisTemplate.expireAt(key, date);
	}

}

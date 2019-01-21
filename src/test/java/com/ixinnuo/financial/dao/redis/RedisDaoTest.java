package com.ixinnuo.financial.dao.redis;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.ixinnuo.financial.Application;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = Application.class)
public class RedisDaoTest {

	
	@Autowired
	private RedisDao redisDao;
	
	@Test
	public void setValue(){
		redisDao.setValue("hello","zhangsan");
		System.out.println(redisDao.getStringValue("hello"));
	}
}

package com.ixinnuo.financial.service.rabbitmq;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.ixinnuo.financial.Application;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = Application.class)
public class SendMessageTest {

	@Autowired
	private SendMessage sendMessage;
	
	@Test
	public void sendBigdata(){
		String rzf = "爱信诺征信有限公司";
		String fkf = "北京融信通金服科技股份有限公司";
		String applyNo = "201812101335558e25617YXUa";
		String productFlag = "MBL_BZ";
		try {
			sendMessage.sendBigdata(rzf, fkf, applyNo, productFlag);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	@Test
	public void testApp(){
		sendMessage.sendApp();
	}
}

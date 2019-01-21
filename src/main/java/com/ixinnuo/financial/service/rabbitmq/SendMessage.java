package com.ixinnuo.financial.service.rabbitmq;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.rabbit.support.CorrelationData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;

@Service
public class SendMessage {

	private Logger log = LoggerFactory.getLogger(this.getClass());

	private RabbitTemplate rabbitTemplate;

	// 发送大数据消息的路由key
	@Value("${key.bigdata}")
	private String keyBigdata;
	// 发送平台消息的路由key
	@Value("${key.app}")
	private String keyApp;

	/**
	 * 在发送消息服务中,对自动配置的RabbitTemplate增加回调设置
	 * 
	 * @param rabbitTemplate
	 */
	//@Autowired
	public SendMessage(RabbitTemplate rabbitTemplate, @Value("${exchange}") String exchange) {
		this.rabbitTemplate = rabbitTemplate;
		// 因为只有一个交换机,可以在模版中唯一指定,这里不能用成员变量的@Value值,因为还没有初始化,改为构造参数
		rabbitTemplate.setExchange(exchange);

	}

	/**
	 * 发送消息
	 * 
	 * @param routingKey
	 *            路由的key
	 * @param message
	 *            要发送的消息
	 * @param dataId
	 *            消息id,用于发布者确认的唯一标识
	 */
	public void send(String routingKey, String message, String dataId) {
		CorrelationData data = new CorrelationData(dataId);
		rabbitTemplate.convertAndSend(rabbitTemplate.getExchange(), routingKey, message, data);
	}

	/**
	 * 通知大数据计算风控,反欺诈,信用评分.
	 * 
	 * @param rzf
	 *            融资方,即销方
	 * @param fkf
	 *            付款方,即购方
	 * @param applyNo
	 *            申请序列号
	 * @param productFlag
	 *            产品标识
	 */
	public void sendBigdata(String rzf, String fkf, String applyNo, String productFlag) throws Exception {
		log.info("通知大数据计算风控,反欺诈,信用评分;融资方:{},付款方:{},序列号:{},产品标识:{},", rzf, fkf, applyNo, productFlag);
		Map<String, String> map = new HashMap<>();
		map.put("rzf", rzf);
		map.put("fkf", fkf);
		map.put("applyNo", applyNo);
		map.put("productFlag", productFlag);
		String message = JSON.toJSONString(map);
		send(keyBigdata, message, applyNo);
	}
	/**
	 * 用于模拟大数据发送消息给平台,生产是用不到的
	 */
	public void sendApp(){
		String routingKey = keyApp;
		String message = "{\"risk\":\"result\"}";
		String dataId = UUID.randomUUID().toString();
		send(routingKey, message, dataId);
	}

}

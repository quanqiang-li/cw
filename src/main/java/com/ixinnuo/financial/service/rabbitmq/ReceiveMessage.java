package com.ixinnuo.financial.service.rabbitmq;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.rabbitmq.client.Channel;

/**
 * 接收消息
 * 
 * @author liqq
 *
 */
@Component
public class ReceiveMessage {

	private Logger log = LoggerFactory.getLogger(this.getClass());

	/**
	 * 监听大数据发送过来的风控
	 * @param message
	 * @param channel
	 */
	//@RabbitListener(queues = "${queue.app}")
	public void listenerManualAck(Message message, Channel channel) {
		//可以看出并发的消费者
		log.info("监听大数据发送过来的风控"+Thread.currentThread().getName() + new String(message.getBody()));
		try {
			// TODO 这里写业务逻辑处理
			
			
			//设置了spring.rabbitmq.listener.simple.acknowledge-mode=manual
			//即开启了手动确认模式,替代自动确认(失败会压回队列),那么下面这句必须有,否则消费者会阻塞等待确认,造成队列消息堆积
			channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);
		} catch (Exception e) {
			// TODO 如果报错了,那么我们可以进行容错处理,比如转移当前消息进入其它队列
			e.printStackTrace();
		}
	}
	
	/**
	 * 监听大数据收到的风控计算请求,模拟大数据测试用,生产注释掉下面的@RabbitListener
	 * @param message
	 * @param channel
	 */
	//@RabbitListener(queues = "${queue.bigdata}")
	public void listenerBigdata(Message message, Channel channel) {
		//可以看出并发的消费者
		log.info("监听大数据收到的风控计算请求"+Thread.currentThread().getName() + new String(message.getBody()));
		try {
			// TODO 这里写业务逻辑处理
			
			
			//设置了spring.rabbitmq.listener.simple.acknowledge-mode=manual
			//即开启了手动确认模式,替代自动确认(失败会压回队列),那么下面这句必须有,否则消费者会阻塞等待确认,造成队列消息堆积
			channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);
		} catch (Exception e) {
			// TODO 如果报错了,那么我们可以进行容错处理,比如转移当前消息进入其它队列
			e.printStackTrace();
		}
	}
}

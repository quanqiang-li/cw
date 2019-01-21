package com.ixinnuo.financial.conf;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 使用默认的配置即可,除非有特殊需求,不要去自定义
 * 
 * @author liqq
 *
 */
//@Configuration
public class RabbitmqConfiguration {
	// 主题交换机
	@Value("${exchange}")
	private String exchange;
	// #大数据监听的队列,即平台要把消息发送到这里
	@Value("${queue.bigdata}")
	private String queueBigdata;
	@Value("${key.bigdata}")
	private String keyBigdata;
	// #平台监听队列,即大数据要把消息发送到这里
	@Value("${queue.app}")
	private String queueApp;
	@Value("${key.app}")
	private String keyApp;

	//@Bean
	public TopicExchange createTopicExchange() {
		// durable 交换机重启仍会存在;autoDelete 不使用时删除交换机
		TopicExchange topicExchange = new TopicExchange(exchange, true, true);
		return topicExchange;
	}

	//@Bean
	public Queue createBigdataQueue() {
		return new Queue(queueBigdata, true, false, true);
	}

	//@Bean
	public Binding createBigdataBinding() {
		// 路由键是通配的key.开头;如key.hello,key.good 都是此队列绑定到交换机的路由键
		// 如果只想把队列绑定到交换机的固定路由键,则把#替换为固定值即可
		return BindingBuilder.bind(createBigdataQueue()).to(createTopicExchange()).with(keyBigdata);
	}
	
	//@Bean
	public Queue createAppQueue() {
		return new Queue(queueApp, true, false, true);
	}

	//@Bean
	public Binding createAppBinding() {
		return BindingBuilder.bind(createAppQueue()).to(createTopicExchange()).with(keyApp);
	}
}

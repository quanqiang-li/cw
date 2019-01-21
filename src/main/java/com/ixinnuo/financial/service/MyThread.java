package com.ixinnuo.financial.service;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Future;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.AsyncResult;
import org.springframework.stereotype.Service;

/**
 * 异步任务,使用线程池,{@link com.ixinnuo.financial.service.MyThreadTest}
 * @author liqq
 *
 */
@Service
public class MyThread {

	private Logger logger = LoggerFactory.getLogger(this.getClass());
	
	//视情况Service的范围可定义为prototype
	@Autowired
	private HelloService helloService;

	/**
	 * 普通的任务
	 * 
	 * @param name
	 * @param latch
	 */
	//如有多个线程池,可以在注解里指定
	@Async
	public void excuteAsyncTask(String name, CountDownLatch latch) {
		logger.info("正在执行异步任务{},依赖{}", name,helloService.toString());
		try {
			Thread.sleep(2000);
			latch.countDown();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 带有返回接口的任务
	 * @param name
	 * @param latch
	 */
	@Async
	public Future<String> excuteAsyncTaskWithReturn(String name, CountDownLatch latch) {
		logger.info("正在执行异步任务{}", name);
		try {
			Thread.sleep(2000);
			latch.countDown();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		return new AsyncResult<String>(name);
	}
}

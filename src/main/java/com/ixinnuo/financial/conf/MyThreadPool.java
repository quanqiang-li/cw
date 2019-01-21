package com.ixinnuo.financial.conf;

import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
/**
 * 线程池,使用参考demo {@link com.ixinnuo.financial.service.MyThread}
 * @author liqq
 *
 */
@Configuration //声明配置类
@EnableAsync //开启异步任务支持
public class MyThreadPool implements AsyncConfigurer{

	
	@Override
	public Executor getAsyncExecutor() {
		ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
		int availableProcessors = Runtime.getRuntime().availableProcessors();
		// 设置核心线程数
        executor.setCorePoolSize(availableProcessors);
        // 设置最大线程数
        executor.setMaxPoolSize(2*availableProcessors);
        // 设置队列容量
        executor.setQueueCapacity(5*availableProcessors);
        // 设置线程活跃时间（秒）
        executor.setKeepAliveSeconds(60);
        // 设置默认线程名称
        executor.setThreadNamePrefix("gylrz-");
        // 设置拒绝策略,由调用线程处理该任务
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        // 等待所有任务结束后再关闭线程池
        //executor.setWaitForTasksToCompleteOnShutdown(true);
        //实例化
        executor.initialize();
        return executor;
	}
}

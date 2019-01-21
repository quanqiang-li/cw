package com.ixinnuo.financial.conf;

import java.util.Map;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

/**
 * 手动获取bean
 * 
 * @author liqq
 *
 */
@Component
public class SpringContext implements ApplicationContextAware {

	private ApplicationContext applicationContext;

	@Override
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		this.applicationContext = applicationContext;

	}

	/**
	 * 从上下文获取bean，按名称，多继承情况下使用
	 * 
	 * @param beanName
	 * @param t
	 * @return
	 */
	public <T> T getBeanByName(String beanName, Class<T> t) {
		return applicationContext.getBean(beanName, t);
	}
	/**
	 * 按类型获取，单例模式下使用
	 * @param t
	 * @return
	 */
	public <T> T getBean(Class<T> t) {
		return applicationContext.getBean(t);
	}
	
	/**
	 * 获取指定接口的所有实现类
	 * @param t
	 * @return 带有匹配bean的Map，包含bean名称作为key和相应的bean实例作为值
	 */
	public <T> Map<String,T> getBeansOfType(Class<T> t){
		return applicationContext.getBeansOfType(t);
	}

}

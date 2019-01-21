package com.ixinnuo.financial.conf.task;

import org.springframework.stereotype.Component;

/**
 * 风控计算接口
 * @author liqq
 *
 */
@Component
public interface RiskCalc {

	/**
	 * 计算风控
	 */
	public void calc();
}

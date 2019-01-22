package com.ixinnuo.financial.conf.task;

import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.ixinnuo.financial.conf.SpringContext;
/**
 * 风控计算定时任务
 * @author liqq
 *
 */
@Component
@EnableScheduling
public class RiskTask {

	private Logger logger = LoggerFactory.getLogger(this.getClass());
	

	@Autowired
	private SpringContext springContext;

	//@Scheduled(cron = "${RiskTask.cron}")
	public void run() {
		logger.info("风控计算定时任务开始...");
		Map<String, RiskCalc> beansOfType = springContext.getBeansOfType(RiskCalc.class);
		Set<Entry<String, RiskCalc>> entrySet = beansOfType.entrySet();
		Iterator<Entry<String, RiskCalc>> iterator = entrySet.iterator();
		while (iterator.hasNext()) {
			Entry<String, RiskCalc> riskCalc = iterator.next();
			logger.info("风控计算信息{}-{}", riskCalc.getKey(), riskCalc.getValue());
			//执行计算
			riskCalc.getValue().calc();
		}
		logger.info("风控计算定时任务结束...");
	}
}

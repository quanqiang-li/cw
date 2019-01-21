package com.ixinnuo.financial.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 数据中心监测url ，勿动
 * @author aisono
 *
 */
@RestController
@RequestMapping("/hello")
public class HelloController {

	@Value("${server.port}")
	private String port;

	@GetMapping({""})
	public String sayHello() {
		return "hello " + port;
	}
}

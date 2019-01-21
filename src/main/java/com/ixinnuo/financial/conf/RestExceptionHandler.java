package com.ixinnuo.financial.conf;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.validation.BindException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.ixinnuo.financial.framework.Code;
import com.ixinnuo.financial.framework.ReturnData;
import com.ixinnuo.financial.util.json.JsonUtil;

@Order(Ordered.HIGHEST_PRECEDENCE)
@ControllerAdvice
public class RestExceptionHandler {

	@ExceptionHandler(BindException.class)
	protected void bindExceptionHandler(BindException ex, HttpServletResponse response) {
		ReturnData retData = new ReturnData(Code.EMPTY_PARAMETER_ERROR);
		if (ex.hasFieldErrors()) {
			retData.setErrorString(ex.getFieldErrors().get(0).getDefaultMessage());
		}
		JsonUtil util = new JsonUtil();
		try {
			response.setHeader("Content-type", "text/html;charset=UTF-8"); 
			response.getWriter().write(util.object2jsonStr(retData));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
package com.ixinnuo.financial.dao.mysql;

import java.util.List;

import com.ixinnuo.financial.model.Working;
import tk.mybatis.mapper.common.Mapper;

public interface WorkingMapper extends Mapper<Working> {

	/**
	 * 批量插入工时数据
	 * @param list
	 */
	void addWorkingBatch(List<Working> list);
}
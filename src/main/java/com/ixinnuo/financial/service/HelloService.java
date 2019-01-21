package com.ixinnuo.financial.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.github.pagehelper.PageHelper;
import com.ixinnuo.financial.dao.mysql.HelloMapper;
import com.ixinnuo.financial.model.Hello;

@Service
@Transactional
public class HelloService {

    @Autowired
    private HelloMapper helloMapper;
    
    /**
     * 增加一条记录，并返回所有记录
     * @param name 你偶像名字
     * @return
     */
    public List<Hello> addOneAndSelectAll(String name){
        Hello record = new Hello();
        record.setCreateTime(new Date());
        record.setName(name);
        helloMapper.insert(record);
        List<Hello> selectAll = helloMapper.selectAll();
        return selectAll;
    }
    /**
     * 增加一条记录，并返回所有记录
     * @param name 你偶像名字
     * @return
     */
    public List<Hello> addOneAndSelectByPage(String name,int pageNum,int pageSize){
        Hello record = new Hello();
        record.setCreateTime(new Date());
        record.setName(name);
        helloMapper.insert(record);
        PageHelper.startPage(pageNum, pageSize);
        List<Hello> selectAll = helloMapper.selectAll();
        return selectAll;
    }
    
}

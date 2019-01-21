package com.ixinnuo.financial.service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Future;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.ixinnuo.financial.Application;

/**
 * 测试线程池,多任务并行
 * 
 * @author liqq
 *
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = Application.class)
public class MyThreadTest {

	@Autowired
	private MyThread myThread;

	/**
	 * 测试普通任务
	 */
	@Test
	public void testSimple() {
		CountDownLatch latch = new CountDownLatch(5);
		for (int i = 0; i < 5; i++) {
			myThread.excuteAsyncTask("zhangsan" + i, latch);
		}
		try {
			//等待任务执行完毕
			latch.await();
			System.out.println("任务执行完毕");
		} catch (InterruptedException e) {
			e.printStackTrace();
		}

	}

	/**
	 * 测试带有返回结果的
	 */
	@Test
	public void test() {
		List<Future<String>> futureList = new ArrayList<>();
		CountDownLatch latch = new CountDownLatch(5);
		for (int i = 0; i < 5; i++) {
			Future<String> excuteAsyncTaskWithReturn = myThread.excuteAsyncTaskWithReturn("zhangsan" + i, latch);
			futureList.add(excuteAsyncTaskWithReturn);
		}
		try {
			latch.await();
			System.out.println("任务执行完毕");
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		for (Future<String> future : futureList) {
			try {
				System.out.println("执行的任务结果:" + future.get());
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

	}
}

package com.ixinnuo.financial.controller;

import java.io.File;
import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
/**
 * 导入数据
 * @author liqq
 *
 */
import org.springframework.web.multipart.MultipartFile;

import com.ixinnuo.financial.framework.Code;
import com.ixinnuo.financial.framework.ReturnData;
import com.ixinnuo.financial.model.Working;
import com.ixinnuo.financial.service.ImportDataService;

@RestController
@RequestMapping("/importData")
public class ImportDataController {

	@Value("${upload.dir}")
	private String uploadDir;
	
	@Autowired
	private ImportDataService importDataService;

	/**
	 * 导入工时
	 * 
	 * @param file
	 * @param request
	 * @return
	 */
	@PostMapping("importWorking")
	public ReturnData importWorking(@RequestParam("file") MultipartFile file, HttpServletRequest request) {
		ReturnData rd = new ReturnData(Code.OK);
		String contentType = file.getContentType(); // 文件类型
		System.out.println("文件类型:" + contentType);
		String fileName = file.getOriginalFilename(); // 名字
		//目录
		File dir = new File(uploadDir);
		if(!dir.exists()){
			dir.mkdirs();
		}
		System.out.println("文件路径:" + dir.getAbsolutePath());
		//文件
		File uploadFile = new File(dir, fileName);
		if (uploadFile.exists()) {
			rd.setErrorString("文件已存在");
			return rd;
		}else{
			try {
				uploadFile.createNewFile();
			} catch (Exception e) {
				rd.setErrorString("文件上传失败" + e.getMessage());
				return rd;
			}
		}
		try {
			FileCopyUtils.copy(file.getBytes(), uploadFile);
			List<Working> importWorking = importDataService.importWorking(uploadFile);
			importDataService.addWorkingBatch(importWorking);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return rd;
	}
}

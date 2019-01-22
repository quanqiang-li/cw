package com.ixinnuo.financial.service;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ixinnuo.financial.dao.mysql.WorkingMapper;
import com.ixinnuo.financial.model.Working;

@Service
public class ImportDataService {
	
	@Autowired
	private WorkingMapper workingMapper;

	/**
	 * 读取工时数据
	 * 
	 * @param file
	 *            上传的文件
	 * @return 员工工时集合
	 */
	public List<Working> importWorking(File file) {

		List<Working> workingList = new ArrayList<>();
		XSSFWorkbook wb = null;
		try {
			wb = new XSSFWorkbook(file);
		} catch (Exception e) {
			// 文件读取失败
			e.printStackTrace();
		}
		DataFormatter formatter = new DataFormatter();
		XSSFSheet sheet = wb.getSheetAt(0);
		String sheetName = sheet.getSheetName();// yyyyMM
		// 第一行,项目名称
		Row project = sheet.getRow(0);
		// 第二行开始,员工,工时比例
		for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
			Working working = new Working();
			working.setYearMonth(sheetName);
			// 第一列=姓名,第二列=部门,第三列往后,是项目
			Row row = sheet.getRow(i);
			working.setEmployeeName(row.getCell(0).getStringCellValue());
			working.setDepartmentName(row.getCell(1).getStringCellValue());
			for (int j = 2; j < row.getPhysicalNumberOfCells(); j++) {
				Cell cell = row.getCell(j);
				String text = formatter.formatCellValue(cell);
				if (StringUtils.isBlank(text)) {
					continue;
				} else {
					working.setProjectName(project.getCell(j).getStringCellValue());
					working.setWorkingRate(new BigDecimal(text));
					workingList.add(working);
					// 必须克隆一个新对象,否则会覆盖集合中的相同对象
					working = working.clone();//
				}
			}
		}
		try {
			wb.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return workingList;
	}
	
	/**
	 * 批量插入工时
	 * @param list
	 */
	public void addWorkingBatch(List<Working> list) {
		// TODO Auto-generated method stub
		workingMapper.addWorkingBatch(list);
	}

	public static void main(String[] args) {
		ImportDataService service = new ImportDataService();
		File file = new File("研发人员工时分摊表2019.01.4（技术质量部）-全强沟通.xlsx");
		List<Working> importWorking = service.importWorking(file);
		for (Working working : importWorking) {
			System.out.println(working.getYearMonth() + working.getEmployeeName() + working.getDepartmentName() + working.getProjectName() + working.getWorkingRate());
		}
	}

}

package com.ixinnuo.financial.util.poi;

import java.io.File;

import org.apache.commons.lang.StringUtils;
import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.util.CellReference;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public class ExcelUtil {

	public static void main(String[] args) throws Exception {
		XSSFWorkbook wb = new XSSFWorkbook(new File("研发人员工时分摊表2019.01.4（技术质量部）-全强沟通.xlsx"));
		DataFormatter formatter = new DataFormatter();
		for (Sheet sheet : wb) {
			for (Row row : sheet) {
				for (Cell cell : row) {
					CellReference cellRef = new CellReference(row.getRowNum(), cell.getColumnIndex());
					System.out.print(cellRef.formatAsString());
					System.out.print(" - ");

					// get the text that appears in the cell by getting the cell
					// value and applying any data formats (Date, 0.00, 1.23e9,
					// $1.23, etc)
					String text = formatter.formatCellValue(cell);
					if (StringUtils.isBlank(text)) {
						System.out.println("空白");
					} else {
						System.out.println(text);

					}
				}
			}
		}
		wb.close();
	}

}

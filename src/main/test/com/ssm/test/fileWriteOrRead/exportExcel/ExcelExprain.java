package com.ssm.test.fileWriteOrRead.exportExcel;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.junit.Test;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

/**
 * @author
 * @description
 * 解析一个模板xls 然后对模板xls进行写读
 * @date 2019/12/5
 */
public class ExcelExprain {
    /**
     * 解析一个模板xls 然后对模板xls进行写数据
     */
    @Test
    public void loadExcel() {
        String templateUrl = "template/快钱商户代扣请求上传模板.xls";
        InputStream inputStream = this.getClass().getClassLoader().getResourceAsStream(templateUrl);
        Resource resource = new ClassPathResource(templateUrl);
        String filePath = "";
        try {
            filePath = "D:\\" + "abc.xls";
            HSSFWorkbook workbook = new HSSFWorkbook(inputStream);
            //HSSFWorkbook workbook = new HSSFWorkbook(new FileInputStream(resource.getFile()));
            HSSFSheet sheet = workbook.getSheetAt(0);
            HSSFRow row = sheet.getRow(1);
            HSSFCell cell = row.getCell(1);
            //cell.setCellValue("ABCD");
            System.out.println("cellValye:"+cell.getStringCellValue());
            FileOutputStream outputStream = new FileOutputStream(filePath);
            workbook.write(outputStream);
            System.out.println("写xls完成");
            outputStream.flush();
            outputStream.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

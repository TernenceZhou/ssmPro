package com.ssm.common.support.excel;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.view.AbstractView;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.FileInputStream;
import java.util.Map;

public abstract class TemplateExcelView extends AbstractView {
    private static final String CONTENT_TYPE = "application/vnd.ms-excel";
    private String filePath;
    protected String outputFilename = "report.xls";

    public TemplateExcelView() {
        super.setContentType("application/vnd.ms-excel");
    }

    public TemplateExcelView(String filePath) {
        this.filePath = filePath;
        super.setContentType("application/vnd.ms-excel");
    }

    protected boolean generatesDownloadContent() {
        return true;
    }

    protected final void renderMergedOutputModel(Map<String, Object> model, HttpServletRequest request, HttpServletResponse response) throws Exception {
        HSSFWorkbook workbook;
        if (this.filePath != null) {
            workbook = this.getTemplateSource(this.filePath, request);
        } else {
            workbook = new HSSFWorkbook();
            this.logger.debug("Created Excel Workbook from scratch");
        }

        this.buildExcelDocument(model, workbook, request, response);
        response.setContentType(this.getContentType());
        response.setHeader("Content-Disposition", "attachment;filename=" + this.outputFilename);
        ServletOutputStream out = response.getOutputStream();
        workbook.write(out);
        out.flush();
    }

    protected HSSFWorkbook getTemplateSource(String url, HttpServletRequest request) throws Exception {
        Resource resource = new ClassPathResource(url);
        HSSFWorkbook workbook = new HSSFWorkbook(new FileInputStream(resource.getFile()));
        return workbook;
    }

    protected abstract void buildExcelDocument(Map<String, Object> var1, HSSFWorkbook var2, HttpServletRequest var3, HttpServletResponse var4) throws Exception;

    public int getExcelColIndex(String name) {
        assert name != null && !name.isEmpty();

        int sum = 0;

        for(int i = 0; i < name.length(); ++i) {
            char c = name.charAt(i);
            int n = c - 64;
            sum += n * this.power(26, name.length() - i - 1);
        }

        return sum - 1;
    }

    public String getExcelColName(int index) {
        int quotient = index / 26;
        return quotient > 0 ? this.getExcelColName(quotient - 1) + (char)(index % 26 + 65) : "" + (char)(index % 26 + 65);
    }

    private int power(int a, int b) {
        int answer = 1;

        for(int i = 0; i < b; ++i) {
            answer *= a;
        }

        return answer;
    }
}

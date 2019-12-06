package com.ssm.controller;

import com.ssm.common.util.ExcelUtil;
import com.ssm.controller.base.BaseController;
import com.ssm.model.result.ResponseResult;
import com.ssm.qo.UserInfoQO;
import com.ssm.service.UserService;
import com.ssm.vo.UserInfoVO;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFClientAnchor;
import org.apache.poi.hssf.usermodel.HSSFComment;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFPatriarch;
import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.formula.functions.T;
import org.apache.poi.ss.usermodel.ClientAnchor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Controller
@RequestMapping("/user")
public class UserController extends BaseController{

    private static  final Logger logger = LoggerFactory.getLogger(BaseController.class);

    //http://localhost:8080/user/index
    @Autowired
    private UserService userService;

    @RequestMapping(value = "/index")
    @ResponseBody
    public ResponseResult index(UserInfoQO qo){
        logger.info("comming");
        ResponseResult result = null;
//        result=  getResult(userService.getUser());
        qo.setPageSize(2);
        result = getResult(userService.getUserList(qo));

//        System.out.println(result.getObj()+"   "+result.getResult());
        return result;
    }

    /**
     * 导出数据到Excel
     * @param request
     * @param response
     */
    @RequestMapping("/export")
    public void export(HttpServletRequest request, HttpServletResponse response) {
        UserInfoQO qo = new UserInfoQO();
        List list = new ArrayList();
        for (int i = 0; i < 10; i++) {
            UserInfoVO vo = new UserInfoVO();
            vo.setId(String.valueOf(i+1));
            vo.setName("name"+i+1);
            list.add(vo);
        }


        List<UserInfoVO> userList = userService.getUserList(qo);
        String fileName = "用户列表.xls";

        FileOutputStream outputStream = null;
        ByteArrayOutputStream bos = null;
        File file = null;
        try {
            bos = new ByteArrayOutputStream();
            HSSFWorkbook workbook = new HSSFWorkbook();
            HSSFSheet sheet = workbook.createSheet("列表sheet1");
            HSSFRow sheetRow = sheet.createRow(0);
            HSSFCell sheetRowCell = sheetRow.createCell(0);
            outputStream = new FileOutputStream(new File("D:\\"));
            int size = userList.size();
            String key[] = {"编号","姓名"};
            String value[] = {"id","name"};
            for (int i = 0; i < size; i++) {
                sheet.createRow(i).createCell(i).setCellValue(key[i]);
            }

            workbook.write(outputStream);
            outputStream.flush();

        } catch (Exception e) {
            e.printStackTrace();
        } finally {

        }

    }

    public static void main(String[] args) {
        List userList = new ArrayList();
        for (int i = 0; i < 10; i++) {
            UserInfoVO vo = new UserInfoVO();
            vo.setId(String.valueOf(i+1));
            vo.setName("name"+(i+1));
            userList.add(vo);
        }
        String fileName = "用户列表.xls";

        FileOutputStream outputStream = null;
        ByteArrayOutputStream os = null;
        File file = null;
        try {
            os = new ByteArrayOutputStream();
            HSSFWorkbook workbook = new HSSFWorkbook();
            HSSFSheet sheet = workbook.createSheet("列表sheet1");
            HSSFRow sheetRow = sheet.createRow(0);
            HSSFCell sheetRowCell = sheetRow.createCell(0);

            outputStream = new FileOutputStream(new File("D:\\"+fileName));
            os = new ByteArrayOutputStream();

            String columnNames [] = {"编号","姓名2"};
            String keys[] = {"id","name"};
            List map = excelMap(userList);
            ExcelUtil.createWorkBook(map,keys,columnNames).write(os);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {

        }

    }
    /**
     * 生成excel结果
     *
     * @param records
     * @return List<Map<String, Object>>
     */
    private static List<Map<String, Object>> excelMap(
            List<UserInfoVO> records) {
        List<Map<String, Object>> listmap = new ArrayList<Map<String, Object>>();
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("sheetName", "查询结果");
        listmap.add(map);
        UserInfoVO record = null;
        for (int j = 0; j < records.size(); j++) {
            record = records.get(j);
            Map<String, Object> mapValue = new HashMap<String, Object>();
            mapValue.put("id", record.getId());
            mapValue.put("name", record.getName());
            listmap.add(mapValue);
        }
        return listmap;
    }

    /*@RequiresRoles(value = { Station.FIN }, logical = Logical.OR)
	@RequestMapping(value = "/advancereport/download.do", method = RequestMethod.POST)*/
    /*public String advanceReportDownload(ModelMap map, ExamApplySearchQO qo,
                                        HttpServletResponse response, HttpServletRequest request)
            throws Exception {

        // 设置不分页
        qo.setPageFlg(false);
        qo = (ExamApplySearchQO) StringUtil.objectTrim(qo);
        // 查出的结果list
        List<ApplySearch> recordList = this.finService.getAdvanceList(qo);
        // 禁止数据缓存。
        response.setHeader("Pragma", "no-cache");
        response.setHeader("Cache-Control", "no-cache");
        response.setDateHeader("Expires", 0);
        response.setContentType("application/vnd.ms-excel;charset=UTF-8");
        String filename = null;
        try {
            filename = new String(("财务垫付数据导出" + qo.getCalcYM() + ".xls").getBytes("GB2312"), "ISO_8859_1");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        response.addHeader("Content-Disposition", "attachment;filename=" + filename);
        List<Map<String, Object>> list = createAdvanceReport(recordList);
        // 列名
        String[] columnNames = { "渠道商", "金融机构", "产品", "申请编号", "姓名", "融资金额",
                "月供", "期限", "已还金额（本金）", "已还期数", "月供垫付金额（本金）", "垫付期数",
                "月供垫付返还金额（本金）", "返还期数", "本金垫付金额", "本金垫付返还金额", "押金" };
        // map中的key
        String[] keys = { "branchName", "fininstName", "productName",
                "applyCd", "customerName", "loanAmount", "refundAmount",
                "leaseHold", "payAmount", "payTerms", "monthlyAdvanceAmount",
                "monthlyAdvanceTerms", "monthlyPaybackAmount",
                "monthlyPaybackTerms", "seedAdvanceAmount",
                "seedPaybackAmount", "depositAmount" };

        ByteArrayOutputStream os = new ByteArrayOutputStream();
        try {
            ExcelUtil.createWorkBook(list, keys, columnNames).write(os);
        } catch (IOException e) {
            e.printStackTrace();
        }
        byte[] content = os.toByteArray();
        InputStream is = new ByteArrayInputStream(content);
        // 设置response参数，可以打开下载页面
        ServletOutputStream out = response.getOutputStream();
        BufferedInputStream bis = null;
        BufferedOutputStream bos = null;
        try {
            bis = new BufferedInputStream(is);
            bos = new BufferedOutputStream(out);
            byte[] buff = new byte[2048];
            int bytesRead;
            // Simple read/write loop.
            while (-1 != (bytesRead = bis.read(buff, 0, buff.length))) {
                bos.write(buff, 0, bytesRead);
            }
        } catch (final IOException e) {
            throw e;
        } finally {
            if (bis != null) {
                bis.close();
            }
            if (bos != null) {
                bos.close();
            }
        }

        return null;
    }*/

}

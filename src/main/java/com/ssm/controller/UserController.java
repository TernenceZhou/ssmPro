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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
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

}

package com.ssm.common.util;

import org.apache.commons.lang.ArrayUtils;
import org.apache.poi.EncryptedDocumentException;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.DataFormat;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * @author
 * @description
 * @date 2019/12/6
 */
public class ExcelUtil {

    public ExcelUtil() {
    }

    public static Workbook createWorkBook(List<Map<String, Object>> list, String[] keys, String[] columnNames) {
        Workbook wb = new HSSFWorkbook();
        Sheet sheet = wb.createSheet(((Map) list.get(0)).get("sheetName").toString());

        for (int i = 0; i < keys.length; ++i) {
            sheet.setColumnWidth((short) i, 5355);
        }

        Row row = null;
        if (columnNames.length != 0) {
            row = sheet.createRow(0);
        }

        CellStyle cs = wb.createCellStyle();
        CellStyle cs2 = wb.createCellStyle();
        Font f = wb.createFont();
        Font f2 = wb.createFont();
        f.setFontHeightInPoints((short) 10);
        f.setColor(IndexedColors.BLACK.getIndex());
        f.setBoldweight((short) 700);
        f2.setFontHeightInPoints((short) 10);
        f2.setColor(IndexedColors.BLACK.getIndex());
        cs.setFont(f);
        cs.setBorderLeft((short) 1);
        cs.setBorderRight((short) 1);
        cs.setBorderTop((short) 1);
        cs.setBorderBottom((short) 1);
        cs.setAlignment((short) 2);
        cs.setFillPattern((short) 1);
        cs.setFillForegroundColor((short) 22);
        cs.setFillBackgroundColor((short) 22);
        cs2.setFont(f2);
        cs2.setBorderLeft((short) 1);
        cs2.setBorderRight((short) 1);
        cs2.setBorderTop((short) 1);
        cs2.setBorderBottom((short) 1);
        cs2.setAlignment((short) 2);

        for (int i = 0; i < columnNames.length; ++i) {
            Cell cell = row.createCell(i);
            cell.setCellValue(columnNames[i]);
            cell.setCellStyle(cs);
        }

        short i = 0;
        if (columnNames.length != 0) {
            i = 1;
        }

        Iterator var18 = list.iterator();

        while (true) {
            Map map;
            do {
                if (!var18.hasNext()) {
                    return wb;
                }

                map = (Map) var18.next();
            } while (map.get("sheetName") != null && StringUtil.isNotBlank(map.get("sheetName").toString()));

            Row row1 = sheet.createRow(i);

            for (short j = 0; j < keys.length; ++j) {
                Cell cell = row1.createCell(j);
                cell.setCellValue(map.get(keys[j]) == null ? " " : map.get(keys[j]).toString());
                cell.setCellStyle(cs2);
            }

            ++i;
        }
    }

    public static Workbook createWorkBook2(List<Map<String, Object>> list, String[] keys, String[] columnNames, short[] columns) {
        Workbook wb = new HSSFWorkbook();
        Sheet sheet = wb.createSheet(((Map) list.get(0)).get("sheetName").toString());

        for (int i = 0; i < keys.length; ++i) {
            sheet.setColumnWidth((short) i, 5355);
        }

        Row row = null;
        if (columnNames.length != 0) {
            row = sheet.createRow(0);
        }

        CellStyle cs = wb.createCellStyle();
        CellStyle cs2 = wb.createCellStyle();
        CellStyle cs3 = wb.createCellStyle();
        Font f = wb.createFont();
        Font f2 = wb.createFont();
        f.setFontHeightInPoints((short) 10);
        f.setColor(IndexedColors.BLACK.getIndex());
        f.setBoldweight((short) 700);
        f2.setFontHeightInPoints((short) 10);
        f2.setColor(IndexedColors.BLACK.getIndex());
        cs.setFont(f);
        cs.setBorderLeft((short) 1);
        cs.setBorderRight((short) 1);
        cs.setBorderTop((short) 1);
        cs.setBorderBottom((short) 1);
        cs.setAlignment((short) 2);
        cs.setFillPattern((short) 1);
        cs.setFillForegroundColor((short) 22);
        cs.setFillBackgroundColor((short) 22);
        cs2.setFont(f2);
        cs2.setBorderLeft((short) 1);
        cs2.setBorderRight((short) 1);
        cs2.setBorderTop((short) 1);
        cs2.setBorderBottom((short) 1);
        cs2.setAlignment((short) 2);
        cs3.setFont(f2);
        cs3.setBorderLeft((short) 1);
        cs3.setBorderRight((short) 1);
        cs3.setBorderTop((short) 1);
        cs3.setBorderBottom((short) 1);
        cs3.setAlignment((short) 2);
        DataFormat format = wb.createDataFormat();
        cs3.setDataFormat(format.getFormat("@"));

        for (int i = 0; i < columnNames.length; ++i) {
            Cell cell = row.createCell(i);
            cell.setCellValue(columnNames[i]);
            cell.setCellStyle(cs);
        }

        short i = 0;
        if (columnNames.length != 0) {
            i = 1;
        }

        Iterator var21 = list.iterator();

        while (true) {
            Map map;
            do {
                if (!var21.hasNext()) {
                    return wb;
                }

                map = (Map) var21.next();
            } while (map.get("sheetName") != null && StringUtil.isNotBlank(map.get("sheetName").toString()));

            Row row1 = sheet.createRow(i);

            for (short j = 0; j < keys.length; ++j) {
                Cell cell = row1.createCell(j);
                cell.setCellValue(map.get(keys[j]) == null ? " " : map.get(keys[j]).toString());
                if (ArrayUtils.contains(columns, j)) {
                    cell.setCellStyle(cs3);
                } else {
                    cell.setCellStyle(cs2);
                }
            }

            ++i;
        }
    }

    public static Workbook createWorkBook3(List<Map<String, Object>> list, String[] keys, String[] columnNames) {
        Workbook wb = new SXSSFWorkbook();
        Sheet sheet = wb.createSheet(((Map) list.get(0)).get("sheetName").toString());

        for (int i = 0; i < keys.length; ++i) {
            sheet.setColumnWidth((short) i, 5355);
        }

        Row row = null;
        if (columnNames.length != 0) {
            row = sheet.createRow(0);
        }

        CellStyle cs = wb.createCellStyle();
        CellStyle cs2 = wb.createCellStyle();
        Font f = wb.createFont();
        Font f2 = wb.createFont();
        f.setFontHeightInPoints((short) 10);
        f.setColor(IndexedColors.BLACK.getIndex());
        f.setBoldweight((short) 700);
        f2.setFontHeightInPoints((short) 10);
        f2.setColor(IndexedColors.BLACK.getIndex());
        cs.setFont(f);
        cs.setBorderLeft((short) 1);
        cs.setBorderRight((short) 1);
        cs.setBorderTop((short) 1);
        cs.setBorderBottom((short) 1);
        cs.setAlignment((short) 2);
        cs.setFillPattern((short) 1);
        cs.setFillForegroundColor((short) 22);
        cs.setFillBackgroundColor((short) 22);
        cs2.setFont(f2);
        cs2.setBorderLeft((short) 1);
        cs2.setBorderRight((short) 1);
        cs2.setBorderTop((short) 1);
        cs2.setBorderBottom((short) 1);
        cs2.setAlignment((short) 2);

        int i;
        for (i = 0; i < columnNames.length; ++i) {
            Cell cell = row.createCell(i);
            cell.setCellValue(columnNames[i]);
            cell.setCellStyle(cs);
        }

        i = 0;
        if (columnNames.length != 0) {
            i = 1;
        }

        Iterator var17 = list.iterator();

        while (true) {
            Map map;
            do {
                if (!var17.hasNext()) {
                    return wb;
                }

                map = (Map) var17.next();
            } while (map.get("sheetName") != null && StringUtil.isNotBlank(map.get("sheetName").toString()));

            Row row1 = sheet.createRow(i);

            for (short j = 0; j < keys.length; ++j) {
                Cell cell = row1.createCell(j);
                cell.setCellValue(map.get(keys[j]) == null ? " " : map.get(keys[j]).toString());
                cell.setCellStyle(cs2);
            }

            ++i;
        }
    }

    public static String[] readExcelTitle(InputStream is) {
        Workbook wb = null;
        String[] title = null;

        try {
            wb = WorkbookFactory.create(is);
            Sheet sheet = wb.getSheetAt(0);
            Row row = sheet.getRow(0);
            int colNum = row.getPhysicalNumberOfCells();
            title = new String[colNum];

            for (int i = 0; i < colNum; ++i) {
                title[i] = getCellFormatValue(row.getCell((short) i));
            }
        } catch (EncryptedDocumentException | InvalidFormatException | IOException var7) {
            var7.printStackTrace();
        }

        return title;
    }

    public static Map<Integer, List<String>> readExcelContent(InputStream is) {
        Workbook wb = null;
        HashMap content = new HashMap();

        try {
            wb = WorkbookFactory.create(is);
            Sheet sheet = wb.getSheetAt(0);
            int rowNum = sheet.getLastRowNum();
            Row row = sheet.getRow(0);
            int colNum = row.getPhysicalNumberOfCells();

            for (int i = 1; i <= rowNum; ++i) {
                List<String> tempList = new ArrayList();
                row = sheet.getRow(i);

                for (int j = 0; j < colNum; ++j) {
                    tempList.add(getCellFormatValue(row.getCell((short) j)).trim());
                }

                content.put(i, tempList);
            }
        } catch (EncryptedDocumentException | InvalidFormatException | IOException var10) {
            var10.printStackTrace();
        }

        return content;
    }

    public static Map<Integer, List<String>> readExcelContentNumerucToString(InputStream is) {
        Workbook wb = null;
        HashMap content = new HashMap();

        try {
            wb = WorkbookFactory.create(is);
            Sheet sheet = wb.getSheetAt(0);
            int rowNum = sheet.getLastRowNum();
            Row row = sheet.getRow(0);
            int colNum = row.getPhysicalNumberOfCells();

            for (int i = 1; i <= rowNum; ++i) {
                List<String> tempList = new ArrayList();
                row = sheet.getRow(i);

                for (int j = 0; j < colNum; ++j) {
                    tempList.add(getCellFormatValueNumerucToString(row.getCell((short) j)).trim());
                }

                content.put(i, tempList);
            }
        } catch (EncryptedDocumentException | InvalidFormatException | IOException var10) {
            var10.printStackTrace();
        }

        return content;
    }

    public static Map<Integer, List<String>> readExcelContentSimple(InputStream is) {
        Workbook wb = null;
        HashMap content = new HashMap();

        try {
            wb = WorkbookFactory.create(is);
            int sheetPages = wb.getNumberOfSheets();

            for (int i = 0; i < sheetPages; ++i) {
                Sheet sheet = wb.getSheetAt(i);
                int rowNum = sheet.getLastRowNum();
                Row row = sheet.getRow(0);
                if (row != null && row.getPhysicalNumberOfCells() != 0) {
                    int colNum = row.getPhysicalNumberOfCells();

                    for (int k = 0; k <= rowNum; ++k) {
                        List<String> tempList = new ArrayList();
                        row = sheet.getRow(k);

                        for (int j = 0; j < colNum; ++j) {
                            tempList.add(getCellFormatValue(row.getCell((short) j)).trim());
                        }

                        content.put(k, tempList);
                    }
                }
            }
        } catch (EncryptedDocumentException | InvalidFormatException | IOException var12) {
            var12.printStackTrace();
        }

        return content;
    }

    public static Map<Integer, List<String>> readExcelContentSimple(InputStream is, String sheetName) {
        Workbook wb = null;
        HashMap content = new HashMap();

        try {
            wb = WorkbookFactory.create(is);
            int sheetPages = wb.getNumberOfSheets();

            for (int i = 0; i < sheetPages; ++i) {
                Sheet sheet = wb.getSheet(sheetName);
                if (sheet == null) {
                    break;
                }

                int rowNum = sheet.getLastRowNum();
                Row row = sheet.getRow(0);
                if (row != null && row.getPhysicalNumberOfCells() != 0) {
                    int colNum = row.getPhysicalNumberOfCells();

                    for (int k = 0; k <= rowNum; ++k) {
                        List<String> tempList = new ArrayList();
                        row = sheet.getRow(k);

                        for (int j = 0; j < colNum; ++j) {
                            tempList.add(getCellFormatValue(row.getCell((short) j)).trim());
                        }

                        content.put(k, tempList);
                    }
                }
            }
        } catch (EncryptedDocumentException | InvalidFormatException | IOException var13) {
            var13.printStackTrace();
        }

        return content;
    }

    private static String getStringCellValue(HSSFCell cell) {
        if (cell == null) {
            return "";
        } else {
            String strCell = "";
            switch (cell.getCellType()) {
                case 0:
                    strCell = String.valueOf(cell.getNumericCellValue());
                    break;
                case 1:
                    strCell = cell.getStringCellValue();
                    break;
                case 2:
                default:
                    strCell = "";
                    break;
                case 3:
                    strCell = "";
                    break;
                case 4:
                    strCell = String.valueOf(cell.getBooleanCellValue());
            }

            return strCell == null ? "" : strCell;
        }
    }

    private static String getDateCellValue(HSSFCell cell) {
        String result = "";

        try {
            int cellType = cell.getCellType();
            if (cellType == 0) {
                Date date = cell.getDateCellValue();
                result = date.getYear() + 1900 + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            } else if (cellType == 1) {
                String date = getStringCellValue(cell);
                result = date.replaceAll("[年月]", "-").replace("日", "").trim();
            } else if (cellType == 3) {
                result = "";
            }
        } catch (Exception var4) {
            var4.printStackTrace();
        }

        return result;
    }

    private static String getCellFormatValue(Cell cell) {
        String cellvalue = "";
        if (cell != null) {
            switch (cell.getCellType()) {
                case 0:
                case 2:
                    if (HSSFDateUtil.isCellDateFormatted(cell)) {
                        Date date = cell.getDateCellValue();
                        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                        cellvalue = sdf.format(date);
                    } else {
                        cellvalue = String.valueOf(cell.getNumericCellValue());
                    }
                    break;
                case 1:
                    cellvalue = cell.getRichStringCellValue().getString();
                    break;
                default:
                    cellvalue = " ";
            }
        } else {
            cellvalue = "";
        }

        return cellvalue;
    }

    private static String getCellFormatValueNumerucToString(Cell cell) {
        String cellvalue = "";
        if (cell != null) {
            switch (cell.getCellType()) {
                case 0:
                    if (HSSFDateUtil.isCellDateFormatted(cell)) {
                        SimpleDateFormat dateformat = new SimpleDateFormat("yyyy/MM/dd");
                        Date dt = HSSFDateUtil.getJavaDate(cell.getNumericCellValue());
                        cellvalue = dateformat.format(dt);
                    } else {
                        cell.setCellType(1);
                        cellvalue = cell.getStringCellValue();
                    }
                    break;
                case 1:
                    cellvalue = cell.getRichStringCellValue().getString();
                    break;
                case 2:
                    if (HSSFDateUtil.isCellDateFormatted(cell)) {
                        Date date = cell.getDateCellValue();
                        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                        cellvalue = sdf.format(date);
                    } else {
                        cellvalue = String.valueOf(cell.getNumericCellValue());
                    }
                    break;
                default:
                    cellvalue = " ";
            }
        } else {
            cellvalue = "";
        }

        return cellvalue;
    }

    public static void insertRow(HSSFSheet sheet, int starRow) {
        HSSFRow sourceRow = null;
        HSSFRow targetRow = null;
        HSSFCell sourceCell = null;
        HSSFCell targetCell = null;
        sourceRow = sheet.getRow(starRow);
        targetRow = sheet.createRow(starRow + 1);
        targetRow.setHeight(sourceRow.getHeight());

        for (int m = 0; m < sourceRow.getLastCellNum(); ++m) {
            sourceCell = sourceRow.getCell(m);
            targetCell = targetRow.createCell(m);
            targetCell.setCellStyle(sourceCell.getCellStyle());
            targetCell.setCellType(sourceCell.getCellType());
        }

    }

    public static String getCellValue(HSSFCell cell) {
        return cell.getCellType() == 0 ? String.valueOf(cell.getNumericCellValue()) : cell.getStringCellValue();
    }

    public static void copyRows(HSSFWorkbook wb, String pSourceSheetName, String pTargetSheetName, int pStartRow, int pEndRow, int pPosition) {
        HSSFRow sourceRow = null;
        HSSFRow targetRow = null;
        HSSFCell sourceCell = null;
        HSSFCell targetCell = null;
        HSSFSheet sourceSheet = null;
        HSSFSheet targetSheet = null;
        if (pStartRow != -1 && pEndRow != -1) {
            sourceSheet = wb.getSheet(pSourceSheetName);
            targetSheet = wb.getSheet(pTargetSheetName);
            List<CellRangeAddress> oldRanges = new ArrayList();

            int i;
            for (i = 0; i < sourceSheet.getNumMergedRegions(); ++i) {
                oldRanges.add(sourceSheet.getMergedRegion(i));
            }

            for (int k = 0; k < oldRanges.size(); ++k) {
                CellRangeAddress oldRange = (CellRangeAddress) oldRanges.get(k);
                CellRangeAddress newRange = new CellRangeAddress(oldRange.getFirstRow(), oldRange.getLastRow(), oldRange.getFirstColumn(), oldRange.getLastColumn());
                int firstRow = oldRange.getFirstRow();
                int lastRow = oldRange.getLastRow();
                if (oldRange.getFirstRow() >= pStartRow && oldRange.getLastRow() <= pEndRow) {
                    int targetRowFrom = oldRange.getFirstRow() - pStartRow + pPosition;
                    int targetRowTo = oldRange.getLastRow() - pStartRow + pPosition;
                    oldRange.setFirstRow(targetRowFrom);
                    oldRange.setLastRow(targetRowTo);
                    targetSheet.addMergedRegion(oldRange);
                    oldRange.setFirstRow(firstRow);
                    oldRange.setLastRow(lastRow);
                    sourceSheet.addMergedRegion(newRange);
                }
            }

            int j;
            label68:
            for (i = pStartRow; i <= pEndRow; ++i) {
                sourceRow = sourceSheet.getRow(i);
                if (sourceRow != null) {
                    j = sourceRow.getLastCellNum();

                    while (true) {
                        if (j <= sourceRow.getFirstCellNum()) {
                            break label68;
                        }

                        targetSheet.setColumnWidth(j, sourceSheet.getColumnWidth(j));
                        targetSheet.setColumnHidden(j, false);
                        --j;
                    }
                }
            }

            for (; i <= pEndRow; ++i) {
                sourceRow = sourceSheet.getRow(i);
                if (sourceRow != null) {
                    targetRow = targetSheet.createRow(i - pStartRow + pPosition);
                    targetRow.setHeight(sourceRow.getHeight());

                    for (j = sourceRow.getFirstCellNum(); j < sourceRow.getPhysicalNumberOfCells(); ++j) {
                        sourceCell = sourceRow.getCell(j);
                        if (sourceCell != null) {
                            targetCell = targetRow.createCell(j);
                            targetCell.setCellStyle(sourceCell.getCellStyle());
                            int cType = sourceCell.getCellType();
                            targetCell.setCellType(cType);
                            switch (cType) {
                                case 0:
                                    targetCell.setCellValue(sourceCell.getNumericCellValue());
                                    break;
                                case 1:
                                    targetCell.setCellValue(sourceCell.getRichStringCellValue());
                                    break;
                                case 2:
                                    targetCell.setCellFormula(parseFormula(sourceCell.getCellFormula()));
                                case 3:
                                default:
                                    break;
                                case 4:
                                    targetCell.setCellValue(sourceCell.getBooleanCellValue());
                                    break;
                                case 5:
                                    targetCell.setCellErrorValue(sourceCell.getErrorCellValue());
                            }
                        }
                    }
                }
            }

        }
    }

    private static String parseFormula(String pPOIFormula) {
        String cstReplaceString = "ATTR(semiVolatile)";
        StringBuffer result = null;
        result = new StringBuffer();
        int index = pPOIFormula.indexOf("ATTR(semiVolatile)");
        if (index >= 0) {
            result.append(pPOIFormula.substring(0, index));
            result.append(pPOIFormula.substring(index + "ATTR(semiVolatile)".length()));
        } else {
            result.append(pPOIFormula);
        }

        return result.toString();
    }

    public static void insertXSSFRow(XSSFSheet sheet, int starRow) {
        XSSFRow sourceRow = null;
        XSSFRow targetRow = null;
        XSSFCell sourceCell = null;
        XSSFCell targetCell = null;
        sourceRow = sheet.getRow(starRow);
        targetRow = sheet.createRow(starRow + 1);
        targetRow.setHeight(sourceRow.getHeight());

        for (int m = 0; m < sourceRow.getLastCellNum(); ++m) {
            sourceCell = sourceRow.getCell(m);
            targetCell = targetRow.createCell(m);
            targetCell.setCellStyle(sourceCell.getCellStyle());
            targetCell.setCellType(sourceCell.getCellType());
        }

    }

    public static void insertXSSFRowWithOutStyle(XSSFSheet sheet, int starRow) {
        XSSFRow sourceRow = null;
        XSSFRow targetRow = null;
        sourceRow = sheet.getRow(starRow);
        targetRow = sheet.createRow(starRow + 1);
        targetRow.setHeight(sourceRow.getHeight());

        for (int m = 0; m < sourceRow.getLastCellNum(); ++m) {
            targetRow.createCell(m);
        }

    }

    public static Workbook createWorkBook07(List<Map<String, Object>> list, String[] keys, String[] columnNames) {
        Workbook wb = new XSSFWorkbook();
        Sheet sheet = wb.createSheet("Sheet0");

        for (int i = 0; i < keys.length; ++i) {
            sheet.setColumnWidth((short) i, 5355);
        }

        Row row = null;
        if (columnNames.length != 0) {
            row = sheet.createRow(0);
        }

        CellStyle cs = wb.createCellStyle();
        CellStyle cs2 = wb.createCellStyle();
        Font f = wb.createFont();
        Font f2 = wb.createFont();
        f.setFontHeightInPoints((short) 10);
        f.setColor(IndexedColors.BLACK.getIndex());
        f.setBoldweight((short) 700);
        f2.setFontHeightInPoints((short) 10);
        f2.setColor(IndexedColors.BLACK.getIndex());
        cs.setFont(f);
        cs.setBorderLeft((short) 1);
        cs.setBorderRight((short) 1);
        cs.setBorderTop((short) 1);
        cs.setBorderBottom((short) 1);
        cs.setAlignment((short) 2);
        cs.setFillPattern((short) 1);
        cs.setFillForegroundColor((short) 22);
        cs.setFillBackgroundColor((short) 22);
        cs2.setFont(f2);
        cs2.setBorderLeft((short) 1);
        cs2.setBorderRight((short) 1);
        cs2.setBorderTop((short) 1);
        cs2.setBorderBottom((short) 1);
        cs2.setAlignment((short) 2);

        for (int i = 0; i < columnNames.length; ++i) {
            Cell cell = row.createCell(i);
            cell.setCellValue(columnNames[i]);
            cell.setCellStyle(cs);
        }

        short i = 0;
        if (columnNames.length != 0) {
            i = 1;
        }

        Iterator var18 = list.iterator();

        while (true) {
            Map map;
            do {
                if (!var18.hasNext()) {
                    return wb;
                }

                map = (Map) var18.next();
            } while (map.get("sheetName") != null && StringUtil.isNotBlank(map.get("sheetName").toString()));

            Row row1 = sheet.createRow(i);

            for (short j = 0; j < keys.length; ++j) {
                Cell cell = row1.createCell(j);
                cell.setCellValue(map.get(keys[j]) == null ? " " : map.get(keys[j]).toString());
                cell.setCellStyle(cs2);
            }

            ++i;
        }
    }

    public static Map<Integer, List<String>> readExcelContentSimpleDate(InputStream is, Integer sheetNo) {
        Workbook wb = null;
        HashMap content = new HashMap();

        try {
            wb = WorkbookFactory.create(is);
            int sheetPages = wb.getNumberOfSheets();

            for (int i = 0; i < sheetPages; ++i) {
                if (sheetNo == null || i == sheetNo) {
                    Sheet sheet = wb.getSheetAt(i);
                    int rowNum = sheet.getLastRowNum();
                    Row row = sheet.getRow(0);
                    if (row != null && row.getPhysicalNumberOfCells() != 0) {
                        int colNum = row.getPhysicalNumberOfCells();

                        for (int k = 0; k <= rowNum; ++k) {
                            List<String> tempList = new ArrayList();
                            row = sheet.getRow(k);

                            for (int j = 0; j < colNum; ++j) {
                                tempList.add(getCellFormatValueDate(row.getCell((short) j)).trim());
                            }

                            content.put(k, tempList);
                        }
                    }
                }
            }
        } catch (EncryptedDocumentException | InvalidFormatException | IOException var13) {
            var13.printStackTrace();
        }

        return content;
    }

    private static String getCellFormatValueDate(Cell cell) {
        String cellvalue = "";
        if (cell != null) {
            switch (cell.getCellType()) {
                case 0:
                case 2:
                    if (HSSFDateUtil.isCellDateFormatted(cell)) {
                        cellvalue = cell.getDateCellValue().toLocaleString();
                    } else {
                        cellvalue = String.valueOf(cell.getNumericCellValue());
                    }
                    break;
                case 1:
                    cellvalue = cell.getRichStringCellValue().getString();
                    break;
                default:
                    cellvalue = " ";
            }
        } else {
            cellvalue = "";
        }

        return cellvalue;
    }

    public static void insertColumn(HSSFSheet sheet, int column) {
        HSSFCell sourceCell = null;
        HSSFCell targetCell = null;

        for (int i = 0; i < sheet.getLastRowNum(); ++i) {
            sourceCell = sheet.getRow(i).getCell(column);
            targetCell = sheet.getRow(i).createCell(column + 1);
            targetCell.setCellStyle(sourceCell.getCellStyle());
            targetCell.setCellType(sourceCell.getCellType());
        }

    }
}

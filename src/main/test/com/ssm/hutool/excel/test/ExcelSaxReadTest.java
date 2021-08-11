package com.ssm.hutool.excel.test;

import java.util.List;

import org.junit.Assert;
import org.junit.Test;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.lang.Console;
import cn.hutool.poi.excel.ExcelUtil;
import cn.hutool.poi.excel.sax.Excel03SaxReader;
import cn.hutool.poi.excel.sax.Excel07SaxReader;
import cn.hutool.poi.excel.sax.handler.RowHandler;

/**
 * Excel sax方式读取
 * @author looly
 *
 */
public class ExcelSaxReadTest {
	
	@Test
	public void readBySaxTest() {
		ExcelUtil.readBySax("blankAndDateTest.xlsx", 0, createRowHandler());
	}
	
	@Test
	public void excel07Test() {
		Excel07SaxReader reader = new Excel07SaxReader(createRowHandler());
		reader.read("aaa.xlsx", 0);
		
		//工具化快速读取
		ExcelUtil.readBySax("aaa.xlsx", 0, createRowHandler());
	}
	
	@Test
	public void excel03Test() {
		Excel03SaxReader reader = new Excel03SaxReader(createRowHandler());
		reader.read("aaa.xls", 1);
//		Console.log("Sheet index: [{}], Sheet name: [{}]", reader.getSheetIndex(), reader.getSheetName());
		ExcelUtil.readBySax("aaa.xls", 1, createRowHandler());
	}
	
	private RowHandler createRowHandler() {
		return new RowHandler() {
            @Override
            public void handle(int i, long l, List<Object> list) {
                Console.log("[{}] [{}] {}", i, l, list);
                if(5 != i && 6 != i) {
                    //测试样例中除第五行、第六行都为非空行
                    Assert.assertTrue(CollUtil.isNotEmpty(list));
                }
            }
        };
	}
}

package com.ssm.controller;

import java.util.Scanner;

import org.apache.commons.lang3.StringUtils;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.core.exceptions.MybatisPlusException;
import com.baomidou.mybatisplus.generator.AutoGenerator;
import com.baomidou.mybatisplus.generator.config.DataSourceConfig;
import com.baomidou.mybatisplus.generator.config.GlobalConfig;
import com.baomidou.mybatisplus.generator.config.PackageConfig;
import com.baomidou.mybatisplus.generator.config.StrategyConfig;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;


public class MpGenerator {

    public static void main(String[] args) {
        // jdbc配置
        //final String dbUrl = "jdbc:mysql://10.42.0.147:3306/fushun_insurance";
        final String dbUrl = "jdbc:mysql://10.42.0.147:3306/insurance_data";
        final String dbUsername = "root";
        final String dbPassword = "cango";
        final String driverName = "com.mysql.jdbc.Driver";

        final String auth = "captain";
        final String outPath = "E:/tmp";
        final String packageName = "com.product";
        // final String [] tableNames = {"sys_menu"};

        GlobalConfig config = new GlobalConfig();
        DataSourceConfig dataSourceConfig = new DataSourceConfig();
        dataSourceConfig.setDbType(DbType.MYSQL)
                .setUrl(dbUrl)
                .setUsername(dbUsername)
                .setPassword(dbPassword)
                .setDriverName(driverName);
        StrategyConfig strategyConfig = new StrategyConfig();
        strategyConfig
                .setCapitalMode(false)
//                .setDbColumnUnderline(true)
                .setNaming(NamingStrategy.underline_to_camel)
                .setEntityLombokModel(true)
                .setInclude(scanner("表名，多个英文逗号分割").split(","));//修改替换成你需要的表名，多个表名传数组
        config.setActiveRecord(false)
                .setAuthor(auth)
                .setOutputDir(outPath)
                .setFileOverride(true);
        config.setMapperName("%sDao");
        new AutoGenerator().setGlobalConfig(config)
                .setDataSource(dataSourceConfig)
                .setStrategy(strategyConfig)
                .setPackageInfo(
                        new PackageConfig()
                                .setParent(packageName)
                                .setController("controller")
                                .setEntity("model")
                                .setMapper("dao")
                                //.setService("service")
                                //.setServiceImpl("service.impl")
                ).execute();
    }

    public static String scanner(String tip) {
        Scanner scanner = new Scanner(System.in);
        StringBuilder help = new StringBuilder();
        help.append("请输入" + tip + "：");
        System.out.println(help.toString());
        if (scanner.hasNext()) {
            String ipt = scanner.next();
            if (StringUtils.isNotEmpty(ipt)) {
                return ipt;
            }
        }
        throw new MybatisPlusException("请输入正确的" + tip + "！");
    }
}

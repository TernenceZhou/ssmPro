package com.ssm.test.base.reflect.reflect2;

import lombok.Getter;
import lombok.Setter;

/**
 * 车辆金融信息.
 */
@Getter
@Setter
public class UpdateFinInfoReq {

    /** 申请编号. */
    private String applyCd;
    /** 分公司id. */
    private String branchId;
    /** 经销商id. */
    private String dealerId;
    /** 金融机构id. */
    private String fininstId;
    /** 贷款产品id. */
    private String productId;
    /** 贷款期限. */
    private String leaseHold;
    /** 还款频率. */
    private String refundfReq;
    /** 基础利率. */
    private String baseIntrate;
    /** 车辆品牌id. */
    private String carBrandId;
    /** 车辆车系ID. **/
    private String carSeriesId;
    /** 车辆车型id. */
    private String carModelId;
    /** 是否二手车. */
    private String secondHandFlg;
    /** 卖方姓名. */
    private String sellerName;
    /** 卖方证件号码. */
    private String sellerPaperNo;
    /** 首次登记日期（二手车）. */
    private String registerDate;
    /** 二手车里程数. */
    private String carMileage;
    /** 过户次数. */
    private String transferNumber;
    /** 车辆颜色. */
    private String carColor;
    /** 车辆指导价. */
    private String carPrice;
    /** 购置税. */
    private String carTax;
    /** 车辆发票金额. */
    private String carInvoicePrice;
    /** 保险费用. */
    private String insuranceCost;
    /** 装潢费用. */
    private String upHolsterCost;
    /** 车辆项目总额. */
    private String carAmount;
    /** 车辆融资金额. */
    private String loanAmount;
    /** 实际融资金额. */
    private String realLoanAmount;
    /** 风险敞口. */
    private String riskExposure;
    /** 首付比例. */
    private String downPaymentRate;
    /** 首付金额. */
    private String downPayment;
    /** 月供. */
    private String refundAmount;
    /** 账户管理费比例. */
    private String accountManagementFeeRate;
    /** 牌照费(账户管理费). */
    private String licenseFee;
    /** 车辆主驾人. */
    private String carDriver;
    /** 驾驶员姓名. */
    private String driverName;
    /** 驾照类型. */
    private String driverType;
    /** 驾驶员驾驶证号码. */
    private String driverNo;
    /** 实际利率. */
    private String factIntrate;
    /** 车架号. */
    private String carChassisNo;
    /** 服务包金额. */
    private String servicePackAmount;
    /** 销售顾问姓名. */
    private String salConsultabtName;
    /** 销售顾问手机. */
    private String salConsultabtMobile;
    /** 抵押办理方. */
    private String mortgageOrg;
    /**上牌城市.**/
    private String mortgageCity;
    /**用户ID.*/
    private String userId;
    /**是否加融服务包.*/
    private String servicePackFlg;
}

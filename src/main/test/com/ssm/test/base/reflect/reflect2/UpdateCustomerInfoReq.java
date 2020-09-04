package com.ssm.test.base.reflect.reflect2;

import lombok.Getter;
import lombok.Setter;

/**
 * 客户更新req.
 */
@Getter
@Setter
public class UpdateCustomerInfoReq {

    /** 申请编号. */
    private String applyCd;
    /** 客户类型. **/
    private String customerFlg;
    /**主申请人区分.**/
    private String mainCustomerFlg;
    /**状态.**/
    private String status;
    /**个人申请人客户ID.**/
    private String indCustomerId;
    /**  个人姓名.**/
    private String indCustomerName;
    /**  个人姓名拼音.**/
    private String indEngName;
    /** 个人性别.**/
    private String indSex;
    /** 个人出生日期.**/
    private String indBirthDay;
    /** 个人民族.**/
    private String indNation;
    /** 个人证件类型.**/
    private String indPaperType;
    /** 个人证件号码.**/
    private String indPaperNo;
    /** 个人身份证有效期开始时间.**/
    private String indPaperNoStartTime;
    /** 个人身份证有效期结束时间.**/
    private String indPaperNoEndTime;
    /** 个人身份证签发机关.**/
    private String indIssueAuthority;
    /** 个人驾照号码.**/
    private String indDriverLicenseNo;
    /** 个人手机.**/
    private String indMobile;
    /** 个人电子邮件.**/
    private String indEmail;
    /** 个人学历.**/
    private String indEducation;
    /** 个人婚姻状况.**/
    private String indMaritalStatus;
    /** 个人配偶姓名.**/
    private String indPartnerName;
    /** 个人配偶证件类型.**/
    private String indPartnerPaperType;
    /** 个人配偶证件号码.**/
    private String indPartnerPaperNo;
    /** 个人现居住省.**/
    private String indProvince;
    /** 个人现居住市.**/
    private String indCity;
    /** 个人现居住区（县）.**/
    private String indCounty;
    /** 个人现居住地地址.**/
    private String indAddress;
    /** 个人现居住地邮编.**/
    private String indZipCode;
    /** 个人现居住地电话区号.**/
    private String indTelArea;
    /** 个人现居住地电话号码.**/
    private String indTel;
    /** 个人现居住地年限.**/
    private String indResidentPeriod;
    /** 个人现居住地住房所有权.**/
    private String indHouseOwnerShip;
    /** 个人户籍地址省.**/
    private String indResidenceProvince;
    /** 个人户籍地址市.**/
    private String indResidenceCity;
    /** 个人户籍地区（县）.**/
    private String indResidenceCounty;
    /** 个人户籍地址地址.**/
    private String indResidenceAddress;
    /** 个人户籍地址邮编.**/
    private String indResidenceZipCode;
    /** 个人户籍地址电话区号.**/
    private String indResidenceTelArea;
    /** 个人户籍地址电话号码.**/
    private String indResidenceTel;
    /** 个人主要收入来源.**/
    private String indIncomeFlg;
    /** 个人主要税后年收入.**/
    private String indMainIncome;
    /** 个人其他税后年收入.**/
    private String indOtherIncome;
    /**个人现工作单位省 .**/
    private String indWorkProvince;
    /** 个人现工作单位市.**/
    private String indWorkCity;
    /** 个人先工作区（县）.**/
    private String indWorkCounty;
    /** 个人本行业工作年限.**/
    private String indWorkPeriod;
    /** 个人现工作单位地址.**/
    private String indWorkAddress;
    /** 个人现工作单位邮编.**/
    private String indWorkZipCode;
    /** 个人现工作单位名称.**/
    private String indWorkUnitName;
    /** 个人现工作单位电话区号.**/
    private String indWorkTelArea;
    /** 个人现工作单位电话号码.**/
    private String indWorkTel;
    /** 个人现工作单位电话分机.**/
    private String indWorkTelExt;
    /** 个人银行卡号.**/
    private String indBankAccount;
    /** 个人卡开户行联行号.**/
    private String indWholeSaleLineNum;
    /** 个人银行预留手机号.**/
    private String indBankMobile;
    /** 个人是否在职.**/
    private String indOnTheJob;
    /** 个人雇佣属性.**/
    private String indEmployProperty;
    /** 机构申请人客户ID.**/
    private String orgCustomerId;
    /** 机构单位名称.**/
    private String orgOrgName;
    /** 机构公司类型.**/
    private String orgOrgType;
    /** 机构组织机构代码.**/
    private String orgOrgCode;
    /** 机构注册资本.**/
    private String orgRegistCapital;
    /** 机构员工人数.**/
    private String orgMemberNum;
    /** 机构营业执照注册号.**/
    private String orgLicenseCode;
    /** 机构贷款卡号码.**/
    private String orgBankCardCode;
    /** 机构贷款卡密码.**/
    private String orgBankCardPwd;
    /** 机构注册成立日期.**/
    private String orgRegistDate;
    /** 机构营业执照有效期至.**/
    private String orgValidDate;
    /** 机构股东人数.**/
    private String orgShareHolderNum;
    /** 机构纳税人识别号（国税）.**/
    private String orgTaxPayerRegisterNoirs;
    /** 机构纳税人识别号（地税）.**/
    private String orgTaxPayerRegisterNoland;
    /** 机构注册地址省.**/
    private String orgRegistProvince;
    /** 机构注册地址市.**/
    private String orgRegistCity;
    /** 机构注册地区（县）.**/
    private String orgRegistCounty;
    /** 机构注册地址.**/
    private String orgRegistAddress;
    /** 机构注册地址邮编.**/
    private String orgRegistZipCode;
    /** 机构实际经营地址省.**/
    private String orgWorkProvince;
    /** 机构实际经营地址市.**/
    private String orgWorkCity;
    /** 机构实际经营地址区（县）.**/
    private String orgWorkCounty;
    /** 机构实际经营地址.**/
    private String orgWorkAddress;
    /** 机构实际经营地址邮编.**/
    private String orgWorkZipCode;
    /** 机构单位电话区号.**/
    private String orgWorkTelArea;
    /** 机构单位电话.**/
    private String orgWorkTel;
    /** 机构单位电话分机.**/
    private String orgWorkTelExt;
    /** 机构单位传真区号.**/
    private String orgWorkFaxArea;
    /** 机构单位传真.**/
    private String orgWorkFax;
    /** 机构单位传真分机.**/
    private String orgWorkFaxExt;
    /** 机构经营场所所有权.**/
    private String orgSiteOwnerShip;
    /** 机构开户银行.**/
    private String orgBankName;
    /** 机构银行账号.**/
    private String orgBankAccount;
    /** 机构财务经理姓名.**/
    private String orgFinancialMng;
    /** 机构联系人姓名.**/
    private String orgContactsName;
    /** 机构联系人手机.**/
    private String orgContactsMobile;
    /** 机构第一大股东姓名/名称 .**/
    private String orgFirstShareHolderName;
    /** 机构第一大股东身份证号码/营业执照注册号.**/
    private String orgFirstPaperNo;
    /** 机构第一大股东持股比例.**/
    private String orgFirstShareHolding;
    /** 机构第一大股东现居住地址/经营地址省 .**/
    private String orgFirstResideProvince;
    /** 机构第一大股东现居住地址/经营地址市.**/
    private String orgFirstResideCity;
    /** 机构第一大股东现居住地址/经营地址区（县）.**/
    private String orgFirstResideCounty;
    /** 机构第一大股东现居住地址/经营地址 .**/
    private String orgFirstResideAddress;
    /** 机构第一大股东现居住地址/经营地址邮编.**/
    private String orgFirstResideZipCode;
    /** 机构第一大股东联系人.**/
    private String orgFirstContactsName;
    /** 机构第一大股东手机/电话.**/
    private String orgFirstShareHolderTel;
    /** 机构第二大股东姓名/名称.**/
    private String orgSecondShareHolderName;
    /** 机构第二大股东身份证号码/营业执照注册号.**/
    private String orgSecondPaperNo;
    /** 机构第二大股东持股比例 .**/
    private String orgSecondShareHolding;
    /** 机构第二大股东现居住地址/经营地址省.**/
    private String orgSecondResideProvince;
    /** 机构第二大股东现居住地址/经营地址市.**/
    private String orgSecondResideCity;
    /** 机构第二大股东现居住地址/经营地址区（县） .**/
    private String orgSecondResideCounty;
    /** 机构第二大股东现居住地址/经营地址.**/
    private String orgSecondResideAddress;
    /** 机构第二大股东现居住地址/经营地址邮编.**/
    private String orgSecondResideZipCode;
    /** 机构第二大股东联系人.**/
    private String orgSecondContactsName;
    /** 机构第二大股东手机/电话.**/
    private String orgSecondShareholderTel;
    /** 机构第三大股东姓名/名称.**/
    private String orgThirdShareHolderName;
    /** 机构第三大股东身份证号码/营业执照注册号.**/
    private String orgThirdPaperNo;
    /** 机构第三大股东持股比例.**/
    private String orgThirdShareHolding;
    /** 机构第三大股东现居住地址/经营地址省.**/
    private String orgThirdResideProvince;
    /** 机构第三大股东现居住地址/经营地址市.**/
    private String orgThirdResideCity;
    /** 机构第三大股东现居住地址/经营地址区（县）.**/
    private String orgThirdResideCounty;
    /** 机构第三大股东现居住地址/经营地址.**/
    private String orgThirdResideAddress;
    /** 机构第三大股东现居住地址/经营地址邮编.**/
    private String orgThirdResideZipCode;
    /** 机构第三大股东联系人.**/
    private String orgThirdContactsName;
    /** 机构第三大股东手机/电话.**/
    private String orgThirdShareHolderTel;
    /** 机构法定代表人客户ID.**/
    private String orgCorpCustomerId;
    /**机构法定代表人持股比例 .**/
    private String orgCorpShareHolding;
    /** 担保人个数.**/
    private String cautionerIdNum;
    /** 担保人1与申请人关系.**/
    private String relationShipCd1;
    /** 担保人1与申请人关系描述.**/
    private String relationShip1;
    /** 担保人1客户id. */
    private String cautionerId1;
    /** 担保人1姓名.**/
    private String c1CustomerName;
    /** 担保人1电话.**/
    private String c1Mobile;
    /** 担保人1证件类型.**/
    private String c1PaperType;
    /** 担保人1证件号码.**/
    private String c1PaperNo;
    /** 担保人1身份证有效期开始时间.**/
    private String c1PaperNoStartTime;
    /** 担保人1身份证有效期结束时间.**/
    private String c1PaperNoEndTime;
    /** 担保人1身份证签发机关.**/
    private String c1IssueAuthority;
    /** 担保人1婚姻状况.**/
    private String c1MaritalStatus;
    /** 担保人1现居住省.**/
    private String c1Province;
    /** 担保人1现居住市.**/
    private String c1City;
    /** 担保人1现居住区（县）.**/
    private String c1County;
    /** 担保人1现居住地地址.**/
    private String c1Address;
    /** 担保人1户籍地址省.**/
    private String c1ResidenceProvince;
    /** 担保人1户籍地址市.**/
    private String c1ResidenceCity;
    /** 担保人1户籍地区（县）.**/
    private String c1ResidenceCounty;
    /** 担保人1主要税后年收入.**/
    private String c1MainIncome;
    /** 担保人1现工作单位名称.**/
    private String c1WorkUnitName;
    /** 担保人1现工作单位电话区号.**/
    private String c1WorkTelArea;
    /** 担保人1现工作单位电话号码.**/
    private String c1WorkTel;
    /** 申请人配偶客户ID .**/
    private String partnerCustomerId;
    /** 配偶姓名.**/
    private String partnerCustomerName;
    /** 配偶证件类型.**/
    private String partnerPaperType;
    /** 配偶证件号码.**/
    private String partnerPaperNo;
    /** 配偶身份证有效期开始时间.**/
    private String partnerPaperNoStartTime;
    /** 配偶身份证有效期结束时间.**/
    private String partnerPaperNoEndTime;
    /** 配偶身份证签发机关.**/
    private String partnerIssueAuthority;
    /** 配偶手机.**/
    private String partnerMobile;
    /** 配偶是否在职.**/
    private String partnerOnTheJob;
    /** 家庭紧急联系人1姓名. */
    private String urgencyName;
    /** 家庭紧急联系人1与申请人关系. */
    private String urgencyRelationCd;
    /** 家庭紧急联系人1与申请人关系描述. */
    private String urgencyRelation;
    /** 家庭紧急联系人1联系电话. */
    private String urgencyTel;
    /** 家庭紧急联系人2姓名. */
    private String urgency2Name;
    /** 家庭紧急联系人2与申请人关系. */
    private String urgency2RelationCd;
    /** 家庭紧急联系人2与申请人关系描述. */
    private String urgency2Relation;
    /** 家庭紧急联系人2联系电话. */
    private String urgency2Tel;
    /** 工作紧急联系人姓名. */
    private String urgency3Name;
    /** 工作紧急联系人与申请人关系. */
    private String urgency3RelationCd;
    /** 工作紧急联系人与申请人关系描述. */
    private String urgency3Relation;
    /** 工作紧急联系人联系电话. */
    private String urgency3Tel;
    /** 创建备注. */
    private String createComment;
    /**用户id.**/
    private String userId;
}

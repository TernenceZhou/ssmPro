package com.ssm.model;

/**
 * app插入log
 * 
 * @author guozhiming
 */
public class AppLog {
	
	/** id*/
	private String logId;
	/**接口名称	*/
	private String interfaceName;
	/** 发起方*/
	private String initiator;
	/** 接收方*/
	private String receiver;
	/** 调用时间*/
	private String logTime;
	/** 调用结果 1.成功 2.失败*/
	private String logResult;
	/** 调用结果明细*/
	private String logResultDetail;
	/** 申请编号*/
	private String applyCd;
	/** 发送报文*/
	private String sendMessage;
	/** 返回报文*/
	private String returnMessage;
	
	
	public String getLogId() {
		return logId;
	}
	public void setLogId(String logId) {
		this.logId = logId;
	}
	public String getInterfaceName() {
		return interfaceName;
	}
	public void setInterfaceName(String interfaceName) {
		this.interfaceName = interfaceName;
	}
	public String getInitiator() {
		return initiator;
	}
	public void setInitiator(String initiator) {
		this.initiator = initiator;
	}
	public String getReceiver() {
		return receiver;
	}
	public void setReceiver(String receiver) {
		this.receiver = receiver;
	}
	public String getLogTime() {
		return logTime;
	}
	public void setLogTime(String logTime) {
		this.logTime = logTime;
	}
	public String getLogResult() {
		return logResult;
	}
	public void setLogResult(String logResult) {
		this.logResult = logResult;
	}
	public String getLogResultDetail() {
		return logResultDetail;
	}
	public void setLogResultDetail(String logResultDetail) {
		this.logResultDetail = logResultDetail;
	}
	public String getApplyCd() {
		return applyCd;
	}
	public void setApplyCd(String applyCd) {
		this.applyCd = applyCd;
	}
	public String getSendMessage() {
		return sendMessage;
	}
	public void setSendMessage(String sendMessage) {
		this.sendMessage = sendMessage;
	}
	public String getReturnMessage() {
		return returnMessage;
	}
	public void setReturnMessage(String returnMessage) {
		this.returnMessage = returnMessage;
	}
	
	

}

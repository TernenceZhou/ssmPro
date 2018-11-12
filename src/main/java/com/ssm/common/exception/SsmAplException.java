package com.ssm.common.exception;

import com.ssm.model.AppLog;

public class SsmAplException extends RuntimeException{
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 4003497966271432253L;

    private boolean codeFlg;
    private AppLog appLog;
    private String msgId;


    public SsmAplException(String errMsg) {
        this(errMsg, true);
    }

    public SsmAplException(String errMsg, AppLog appLog) {
        super(errMsg);
        this.appLog = appLog;
    }


    public SsmAplException(String errMsg, String msgId) {
        super(errMsg);
        this.msgId = msgId;
    }

    public SsmAplException(String errMsg, AppLog appLog, String msgId) {
        super(errMsg);
        this.appLog = appLog;
        this.msgId = msgId;
    }

    public SsmAplException(String errMsg, boolean codeFlg) {
        super(errMsg);
        this.codeFlg = codeFlg;
    }

    /**
     * @return the codeFlg
     */
    public boolean isCodeFlg() {
        return codeFlg;
    }

    /**
     * @param codeFlg
     *            the codeFlg to set
     */
    public void setCodeFlg(boolean codeFlg) {
        this.codeFlg = codeFlg;
    }

    public AppLog getAppLog() {
        return appLog;
    }

    public void setAppLog(AppLog appLog) {
        this.appLog = appLog;
    }

    public String getMsgId() {
        return msgId;
    }

    public void setMsgId(String msgId) {
        this.msgId = msgId;
    }
}

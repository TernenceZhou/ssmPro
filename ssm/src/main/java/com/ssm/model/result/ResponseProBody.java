package com.ssm.model.result;

public class ResponseProBody {
    public static final String SUCCESS = "0000";
    public static final String FAILD = "9999";
    private String message;
    private Object obj;
    private String result;

    //初始化

    public ResponseProBody(){
        this.result = "0000";
    }
    public ResponseProBody(String result){
        this.result = result;
    }
    public ResponseProBody(String result, Object obj) {
        this.result = result;
        this.obj = obj;
    }
    public ResponseProBody(String message, Object obj, String result) {
        this.message = message;
        this.obj = obj;
        this.result = result;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getObj() {
        return obj;
    }

    public void setObj(Object obj) {
        this.obj = obj;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }
}

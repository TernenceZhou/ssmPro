package com.ssm.model.result;

public class ResponseResult extends ResponseProBody {
    public final static String API_NO_ACCESS = "0001";
    public final static String API_SIGN_ERROR = "0002";
    public final static String API_NOT_AVAILABLE = "0003";

    public ResponseResult() {
        super();
    }

    public ResponseResult(String message,String result) {
        super(result);
        setMessage(message);
    }
    public ResponseResult(String result,String message,Object obj) {
        super(result,obj);
        setMessage(message);
    }
}


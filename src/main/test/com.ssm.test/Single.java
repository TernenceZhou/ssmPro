package com.ssm.test;

public class Single {
    //饿汉 天生线程安全
    /*private static Single sin = new Single();
    private Single(){}
    public static Single getSingle(){
        return sin;
    }*/

    //懒汉
    /*private static Single sin;
    private Single(){}
    public static Single getSingle(){
        if(sin == null) {
            sin = new Single();
        }
        return sin;
    }*/
    private volatile static Single sin ;
    private Single(){}
    public static Single getSingle(){
        if (sin == null){
            synchronized (Single.class){
                if(sin == null){
                    sin = new Single();
                }
            }
        }
        return sin;
    }

}

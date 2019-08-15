package com.ssm.test.xiangxueClass.thread.ConcurrentContainer;

/**
 * 用位运算表示一个类含有的权限
 */
public class Permistion {

    private static int PERMISION_SELECT =  1<< 0 ; //0001   1
    private static int PERMISION_INSERT =  1<< 1 ; //0010   2
    private static int PERMISION_UPDATE =  1<< 2 ; //0100   4
    private static int PERMISION_DELETE =  1<< 3 ; //1000   8
    //当前状态
    int flg = 0;

    public void setPermisionDelete(int per) {
        flg = per;
    }

    public  int getPermisionDelete() {
        return flg;
    }

    public void removePer(int per) {
        flg = per;
    }
}

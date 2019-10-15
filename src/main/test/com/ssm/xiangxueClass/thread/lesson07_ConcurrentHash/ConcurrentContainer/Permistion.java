package com.ssm.xiangxueClass.thread.lesson07_ConcurrentHash.ConcurrentContainer;

/**
 * 用位运算表示一个类含有的权限
 */
public class Permistion {

    private static final int PERMISION_SELECT =  1<< 0 ; //0001   1
    private static final int PERMISION_INSERT =  1<< 1 ; //0010   2
    private static final int PERMISION_UPDATE =  1<< 2 ; //0100   4
    private static final int PERMISION_DELETE =  1<< 3 ; //1000   8

    //当前类含有的属性
    int flg = 0;

    public void setPermision(int per) {
        flg = per;
    }

    /**
     * 添加某种权限
     * @param per
     */
    public  void addPer(int per) {
        flg = flg | per;
    }

    /**
     * 删除某种权限
     * @param per
     */
    public void disablePer(int per) {
        flg = flg&~per;
    }
    /**
     * 拥有的所有权限
     * @param per
     */
    public void allPer(int per) {
        flg = per;
    }

    /**
     * 查看是否有用某种权限
     * @param per
     */
    public boolean isAllowPer(int per) {
        return ((flg&per) == per);
    }
    /**
     * 查看没有的权限.
     * @param per
     */
    public boolean notEnablePer(int per) {
        return ((flg&per) == per);
    }


    public static void main(String[] args) {
        int data = 15;
        Permistion permistion = new Permistion();
        //System.out.println(Integer.toBinaryString(data));
        permistion.setPermision(data);
        permistion.disablePer(PERMISION_UPDATE);
        System.out.println("delete :"+permistion.isAllowPer(PERMISION_DELETE));
        System.out.println("add :"+permistion.isAllowPer(PERMISION_INSERT));
        System.out.println("update :"+permistion.isAllowPer(PERMISION_UPDATE));
        System.out.println("select :"+permistion.isAllowPer(PERMISION_SELECT));
    }
}

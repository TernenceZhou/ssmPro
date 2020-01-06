package com.ssm.xiangxueClass.JVM;

/**
 * @author
 * @description
 * @date 2020/1/6
 * 栈溢出
 * 参数：-Xss256k
 * java.lang.StackOverflowError
 * 一般的方法调用不会出现stack溢出
 * 出现的话就要考虑是不是无限递归调用没有控制栈深度
 * 所以就有递归和普通循环的区别
 * 通过虚拟机栈的启示：
 * 方法的执行要打包成栈帧 天生要比普通的循环更慢
 * 低估代码简洁
 * 普通循环：代码相对复杂但是效率上更快
 */
public class StackOOM {

    private int i = 0;

    public void digui(){
        i++;

    }

    public static void main(String[] args) {

    }

}

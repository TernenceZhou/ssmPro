package com.ssm.xiangxueClass.JVM.chapter;

/**
 * 栈帧演示
 * 栈帧大小的缺省值是1M
 * 可以通过参数-Xss配置 例如 在VM -options中配置 ： -Xss256k
 * 方法的执行就相当于在虚拟机栈中的出栈和入栈的过程
 */
public class HeapStack {

    private int stackLeng = 0;

    public void digui(){
        stackLeng ++;
        digui();
    }

    public void digui2(int x, String y){
        stackLeng ++;
        digui2(x,y);
    }

    public static void main(String[] args) {
        HeapStack stack = new HeapStack();
        try {
            //stack.digui(); //调用后显示的栈帧深度为.3393
            stack.digui2(30,"小周");//显示栈帧深度为2105
            /**
             * 由上可得java.lang.StackOverflowError 可以考虑是不是由于程序递归深度没有得到控制
             *
             * 程序的局部变量和操作数会被打包到栈帧中去 占用栈的大小 所以深度变得更浅
             */
        } catch (Throwable e){
            System.out.println("当前栈帧的深度为："+stack.stackLeng);
            e.printStackTrace();
        }
        //catch(Exception e){}无法捕获到stackoverError因为他是一个error所以得用thowable捕获他
    }
}

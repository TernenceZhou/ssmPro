package com.ssm.xiangxueClass.thread.forkjoin.sum;

public class SSS {
    public static void main(String[] args) {
        Base b1 = new Base();
        Base b2 = new Sub();

    }
}


class Base{
    Base(){
        method(100);
    }
    public void method(int i){
        System.out.println("base : " + i);
    }
}
class Sub extends Base{
    Sub(){
//        super.method(70);
        //method(70);
    }

        public void method(int j){
        System.out.println("sub : " + j);
    }
}
 
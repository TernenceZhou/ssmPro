package com.ssm.xiangxueClass.thread.forkjoin.sum;

import com.ssm.xiangxueClass.thread.SleepTools;

public class SumNormal {
	
	public static void main(String[] args) {
	    int count = 0;
	    int[] src = MakeArr.makeArray();

	    long start = System.currentTimeMillis();
	    for(int i= 0;i<src.length;i++){
	    	SleepTools.ms(1);
	    	count = count + src[i];
	    }
	    System.out.println("The count is "+ count
	            +" spend time:"+(System.currentTimeMillis()-start)+"ms");		
	}

}

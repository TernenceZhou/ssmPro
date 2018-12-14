package com.ssm.test;

import java.util.LinkedHashMap;

public class Child  {
    String id;
    String name;

    public static void main(String[] args) {
        LinkedHashMap a = new LinkedHashMap();
        a.put(1,2);

        auth();
    }
    public static int auth()
    {
        int i = 0;
        int arr[] = new int[3];
        for(; i<=3; i++){
            arr[i] = 0;
            System.out.println("hello");
        }
        return 0;
    }
}

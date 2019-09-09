package com.ssm.test.base.Immutable;

import java.util.HashMap;

/**
 * @author
 * @description
 * 深拷贝和浅拷贝实例
 * @date 2019/9/9
 */
public class FinalClassExample {
    private final int id;

    private final String name;

    private final HashMap<String, String> testMap ;

    public int getId(){
        return id;
    }

    public String getName(){
        return name;
    }

    /** ------------------------------------------------------------1-------------------
     * 访问可变对象 克隆
     * @return
     */
    @SuppressWarnings("unchecked")
    public HashMap<String, String> getTestMap(){
        return (HashMap<String, String>)testMap.clone();//返回对象的复制
    }

/**------------------------------------------2--------------------------
 * 访问可变对象 复制
 * @return
 */
// public HashMap<String, String> getTestMap(){
// return testMap;//直接返回对象的引用
// }

    /**-----------------------------------------3------------------------------
     * 深复制
     * @param i
     * @param n
     * @param hm
     */
    public FinalClassExample(int i,String n,HashMap<String, String> hm){
        System.out.println("Perfoming deep copy for object inititalization");
        this.id = i;
        this.name = n;
        //1、
        this.testMap = (HashMap<String, String>)hm.clone();
        //2、
        /*HashMap<String, String> tempMap = new HashMap<String, String>();
        String key;
        Iterator<String> it = hm.keySet().iterator();
        while(it.hasNext()){
            key = it.next();
            tempMap.put(key, hm.get(key));
        }
        this.testMap = tempMap;*/
    }

    /**---------------------------------------4------------------------------------
     * 浅复制
     * @param i
     * @param n
     * @param hm
     */
    // public FinalClassExample(int i,String n,HashMap<String, String>hm){
    // System.out.println("Perfoming shallow copy for object inititalization");
    // this.id = i;
    // this.name = n;
    // this.testMap = hm;
    // }

    public static void main(String[] args) {
        HashMap<String, String> map = new HashMap<String, String>();
        map.put("1", "first");
        map.put("2", "second");
        String s = "original";
        int i = 10;
        FinalClassExample example = new FinalClassExample(i, s, map);
        //下面看一个复制的域还是引用
        System.out.println(s == example.getName());
        System.out.println(map == example.getTestMap());
        //打印example的值
        System.out.println("example id="+example.getId());
        System.out.println("example name="+example.getName());
        System.out.println("example testmap = "+ example.getTestMap());

        //改变局部变量的值
        i = 20;
        s ="modify";
        map.put("3", "third");
        //打印值
        System.out.println("example id after local variable change ="+example.getId());
        System.out.println("example name after local variable change ="+example.getName());
        System.out.println("example testmap after local variable change = "+ example.getTestMap());

        HashMap<String, String> hm = example.getTestMap();
        hm.put("4", "new");
        System.out.println("example testMap after changing variable from accessor methords:"+example.getTestMap());
}
}

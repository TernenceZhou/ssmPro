package com.ssm.lagou.深浅克隆;


public class Address implements Cloneable{
    private String cityId;
    private String cityName;

    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }

    public Address(String cityId, String cityName) {
        this.cityId = cityId;
        this.cityName = cityName;
    }


    public String getCityId() {
        return cityId;
    }

    public void setCityId(String cityId) {
        this.cityId = cityId;
    }

    public String getCityName() {
        return cityName;
    }

    public void setCityName(String cityName) {
        this.cityName = cityName;
    }
}

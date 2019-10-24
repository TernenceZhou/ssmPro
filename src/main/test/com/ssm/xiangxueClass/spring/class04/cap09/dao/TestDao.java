package com.ssm.xiangxueClass.spring.class04.cap09.dao;

import org.springframework.stereotype.Repository;

@Repository
public class TestDao {
	private String flag = "1";
	public String getFlag() {
		return flag;
	}

	public void setFlag(String flag) {
		this.flag = flag;
	}

	@Override
	public String toString() {
		return "TestDao...... [flag=" + flag + "]";
	}


}

package com.ssm.qo;

import com.ssm.common.support.page.Page;
import com.ssm.vo.UserInfoVO;

public class UserInfoQO extends Page<UserInfoVO>{
    private String id;
    private String name;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

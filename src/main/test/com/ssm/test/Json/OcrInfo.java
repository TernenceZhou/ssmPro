package com.ssm.test.Json;

import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.builder.HashCodeBuilder;

@Getter
@Setter
public class OcrInfo {

    private String name;
    private String paperNo;
    private String sex;
    private String nation;
    private String birthday;
    private String address;
    private String issueOrg;
    private String expiryDate;

    @Override
    public int hashCode() {
        return HashCodeBuilder.reflectionHashCode(this);
    }

}

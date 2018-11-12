package com.ssm.common.support.page;

import java.util.List;

public class Page<T> {
    private int pageNo = 1;
    private int pageSize = 50;
    private int totalRecord;
    private int totalPage;
    private List<T> results;
    private int pageNavNum = 5;
    private int pageNavStart = 1;
    private boolean pageFlg = true;
    private boolean complicateFlg = true;
    private boolean overFlowMaxCntFlg;
    private boolean checkOverFlowMaxCntFlg;
    private String sql;
    private int OverFlowMaxNum = 2000;
    private boolean needCountFlg = true;

    public Page() {
    }

    public int getPageNo() {
        return this.pageNo;
    }

    public void setPageNo(int pageNo) {
        this.pageNo = pageNo;
    }

    public int getPageSize() {
        return this.pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public int getTotalRecord() {
        return this.totalRecord;
    }

    public String getSql() {
        return this.sql;
    }

    public void setSql(String sql) {
        this.sql = sql;
    }

    public void setTotalRecord(int totalRecord) {
        this.totalRecord = totalRecord;
        this.totalPage = totalRecord % this.pageSize == 0 ? totalRecord / this.pageSize : totalRecord / this.pageSize + 1;
        if (this.pageNavNum >= this.totalPage) {
            this.pageNavStart = 1;
            this.pageNavNum = this.totalPage;
        } else {
            int half = this.pageNavNum / 2;
            if (this.pageNavNum % 2 != 0) {
                ++half;
            }

            int start = this.pageNo - half + 1;

            int end;
            for(end = start + this.pageNavNum - 1; start < 1; ++end) {
                ++start;
            }

            while(end > this.totalPage) {
                --end;
                --start;
            }

            this.pageNavStart = start;
        }

    }

    public int getTotalPage() {
        return this.totalPage;
    }

    public List<T> getResults() {
        return this.results;
    }

    public void setResults(List<T> results) {
        this.results = results;
    }

    public int getPageNavNum() {
        return this.pageNavNum;
    }

    public void setPageNavNum(int pageNavNum) {
        if (pageNavNum >= 2) {
            this.pageNavNum = pageNavNum;
        }

    }

    public int getPageNavStart() {
        return this.pageNavStart;
    }

    public void setPageNavStart(int pageNavStart) {
        this.pageNavStart = pageNavStart;
    }

    public boolean isPageFlg() {
        return this.pageFlg;
    }

    public void setPageFlg(boolean pageFlg) {
        this.pageFlg = pageFlg;
    }

    public boolean isComplicateFlg() {
        return this.complicateFlg;
    }

    public void setComplicateFlg(boolean complicateFlg) {
        this.complicateFlg = complicateFlg;
    }

    public boolean isOverFlowMaxCntFlg() {
        return this.overFlowMaxCntFlg;
    }

    public void setOverFlowMaxCntFlg(boolean overFlowMaxCntFlg) {
        this.overFlowMaxCntFlg = overFlowMaxCntFlg;
    }

    public boolean isCheckOverFlowMaxCntFlg() {
        return this.checkOverFlowMaxCntFlg;
    }

    public void setCheckOverFlowMaxCntFlg(boolean checkOverFlowMaxCntFlg) {
        this.checkOverFlowMaxCntFlg = checkOverFlowMaxCntFlg;
    }

    public int getOverFlowMaxNum() {
        return this.OverFlowMaxNum;
    }

    public void setOverFlowMaxNum(int overFlowMaxNum) {
        this.OverFlowMaxNum = overFlowMaxNum;
    }

    public boolean isNeedCountFlg() {
        return this.needCountFlg;
    }

    public void setNeedCountFlg(boolean needCountFlg) {
        this.needCountFlg = needCountFlg;
    }

    public String toString() {
        StringBuilder builder = new StringBuilder();
        builder.append("Page [pageNo=").append(this.pageNo).append(", pageSize=").append(this.pageSize).append(", resultSize=").append(this.results == null ? 0 : this.results.size()).append(", totalPage=").append(this.totalPage).append(", totalRecord=").append(this.totalRecord).append(", pageNavStart=").append(this.pageNavStart).append(", pageNavNum=").append(this.pageNavNum).append(", pageFlg=").append(this.pageFlg).append("]");
        return builder.toString();
    }
}

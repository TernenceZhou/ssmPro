package com.ssm.qo;

import com.ssm.vo.BookVO;

public class AppointmentQO {
    private long bookId;// 图书ID

    private long studentId;// 学号

    private String appointTime;// 预约时间

    // 多对一的复合属性
    private BookVO book;// 图书实体

    public long getBookId() {
        return bookId;
    }

    public void setBookId(long bookId) {
        this.bookId = bookId;
    }

    public long getStudentId() {
        return studentId;
    }

    public void setStudentId(long studentId) {
        this.studentId = studentId;
    }

    public String getAppointTime() {
        return appointTime;
    }

    public void setAppointTime(String appointTime) {
        this.appointTime = appointTime;
    }

    public BookVO getBook() {
        return book;
    }

    public void setBook(BookVO book) {
        this.book = book;
    }
}

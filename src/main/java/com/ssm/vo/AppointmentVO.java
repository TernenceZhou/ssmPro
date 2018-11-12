package com.ssm.vo;

public class AppointmentVO {
    private long bookId;// 图书ID

    private long studentId;// 学号

    private String appointTime;// 预约时间

    // 多对一的复合属性
    private BookVO book;// 图书实体

    public AppointmentVO() {
    }

    public AppointmentVO(long bookId, long studentId, String appointTime) {
        this.bookId = bookId;
        this.studentId = studentId;
        this.appointTime = appointTime;
    }

    public AppointmentVO(long bookId, long studentId, String appointTime, BookVO book) {
        this.bookId = bookId;
        this.studentId = studentId;
        this.appointTime = appointTime;
        this.book = book;
    }

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

    @Override
    public String toString() {
        return "Appointment [bookId=" + bookId + ", studentId=" + studentId + ", appointTime=" + appointTime + "]";
    }
}

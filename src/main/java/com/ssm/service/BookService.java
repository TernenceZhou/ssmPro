package com.ssm.service;

import com.ssm.vo.AppointExecution;
import com.ssm.vo.AppointmentVO;
import com.ssm.vo.BookVO;

import java.util.List;

public interface BookService {
    /**
     * 查询一本图书
     *
     * @param bookId
     * @return
     */
    BookVO getById(long bookId);

    /**
     * 查询所有图书
     *
     * @return
     */
    List<BookVO> getList();

    /**
     * 预约图书
     *
     * @param bookId
     * @param studentId
     * @return
     */
    AppointExecution appoint(long bookId, long studentId);
}

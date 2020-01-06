//package com.ssm.test.base.base64ToPDF;
//
//import com.alibaba.fastjson.JSON;
//import com.cango.cloud.core.wsresult.WsResult;
//import org.junit.Test;
//import org.junit.runner.RunWith;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.http.MediaType;
//import org.springframework.test.context.junit4.SpringRunner;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.MvcResult;
//
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.asyncDispatch;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.request;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
///**
// * describe: 条件处理测试类.
// * Date:     2019-11-7 10:34:50.
// * ClassName:ConditionalInfoTest.
// *
// * @author zyb
// * @since JDK 1.8
// */
//@RunWith(SpringRunner.class)
//@SpringBootTest
//@AutoConfigureMockMvc
//public class ConditionalInfoTest {
//
//    @Autowired
//    MockMvc mvc;
//
//    /**
//     * 机构为6的获取最新备注信息.
//     *
//     * @throws Exception 异常信息
//     */
//    @Test
//    public void getLastComment1() throws Exception {
//        WsResult result = new WsResult();
//        result.setResult("0000");
//        MvcResult mockResult = mvc.perform(post("/conditional/getLastComment").contentType(MediaType.APPLICATION_JSON_UTF8).accept(MediaType.APPLICATION_JSON_UTF8)
//            .content("{\"applyCd\":\"BPA2091805000910\",\"type\":\"1\",\"commentType\":\"1\"}")).andExpect(status().isOk()).andExpect(request().asyncStarted()).andReturn();
//        mockResult.getAsyncResult(60000L);
//        mvc.perform(asyncDispatch(mockResult)).andExpect(content().json(JSON.toJSONString(result), false)).andDo(print());
//    }
//
//    /**
//     * 机构为8的获取最新备注信息.
//     *
//     * @throws Exception 异常信息
//     */
//    @Test
//    public void getLastComment2() throws Exception {
//        WsResult result = new WsResult();
//        result.setResult("0000");
//        MvcResult mockResult = mvc.perform(post("/conditional/getLastComment").contentType(MediaType.APPLICATION_JSON_UTF8).accept(MediaType.APPLICATION_JSON_UTF8)
//            .content("{\"applyCd\":\"BPA0451801000711\",\"type\":\"1\",\"commentType\":\"1\"}")).andExpect(status().isOk()).andExpect(request().asyncStarted()).andReturn();
//        mockResult.getAsyncResult(60000L);
//        mvc.perform(asyncDispatch(mockResult)).andExpect(content().json(JSON.toJSONString(result), false)).andDo(print());
//    }
//
//    /**
//     * 机构为6的获取经销商提醒.
//     *
//     * @throws Exception 异常信息
//     */
//    @Test
//    public void getDealerRemind1() throws Exception {
//        WsResult result = new WsResult();
//        result.setResult("0000");
//        MvcResult mockResult = mvc
//            .perform(post("/conditional/getDealerRemind").contentType(MediaType.APPLICATION_JSON_UTF8).accept(MediaType.APPLICATION_JSON_UTF8).content("{\"applyCd\":\"BPA2091805000910\",\"type\":\"1\"}"))
//            .andExpect(status().isOk()).andExpect(request().asyncStarted()).andReturn();
//        mockResult.getAsyncResult(60000L);
//        mvc.perform(asyncDispatch(mockResult)).andExpect(content().json(JSON.toJSONString(result), false)).andDo(print());
//    }
//
//    /**
//     * 机构为8的获取经销商提醒.
//     *
//     * @throws Exception 异常信息
//     */
//    @Test
//    public void getDealerRemind2() throws Exception {
//        WsResult result = new WsResult();
//        result.setResult("0000");
//        MvcResult mockResult = mvc
//            .perform(post("/conditional/getDealerRemind").contentType(MediaType.APPLICATION_JSON_UTF8).accept(MediaType.APPLICATION_JSON_UTF8).content("{\"applyCd\":\"BPA0451801000711\",\"type\":\"1\"}"))
//            .andExpect(status().isOk()).andExpect(request().asyncStarted()).andReturn();
//        mockResult.getAsyncResult(60000L);
//        mvc.perform(asyncDispatch(mockResult)).andExpect(content().json(JSON.toJSONString(result), false)).andDo(print());
//    }
//
//    /**
//     * 更新机构为6的dfimId.
//     *
//     * @throws Exception 异常信息
//     */
//    @Test
//    public void assignDfim1() throws Exception {
//        WsResult result = new WsResult();
//        result.setResult("0000");
//        MvcResult mockResult = mvc.perform(
//            post("/conditional/assignDfim").contentType(MediaType.APPLICATION_JSON_UTF8).accept(MediaType.APPLICATION_JSON_UTF8).content("{\"applyCd\":\"BPA2091805000910\",\"dfimId\":\"13\",\"type\":\"1\"}"))
//            .andExpect(status().isOk()).andExpect(request().asyncStarted()).andReturn();
//        mockResult.getAsyncResult(60000L);
//        mvc.perform(asyncDispatch(mockResult)).andExpect(content().json(JSON.toJSONString(result), false)).andDo(print());
//    }
//
//    /**
//     * 更新机构为8的dfimId.
//     *
//     * @throws Exception 异常信息
//     */
//    @Test
//    public void assignDfim2() throws Exception {
//        WsResult result = new WsResult();
//        result.setResult("0000");
//        MvcResult mockResult = mvc.perform(
//            post("/conditional/assignDfim").contentType(MediaType.APPLICATION_JSON_UTF8).accept(MediaType.APPLICATION_JSON_UTF8).content("{\"applyCd\":\"BPA0451801000711\",\"dfimId\":\"13\",\"type\":\"1\"}"))
//            .andExpect(status().isOk()).andExpect(request().asyncStarted()).andReturn();
//        mockResult.getAsyncResult(60000L);
//        mvc.perform(asyncDispatch(mockResult)).andExpect(content().json(JSON.toJSONString(result), false)).andDo(print());
//    }
//
//    /**
//     * 更新机构为6的cfcaId和状态.
//     *
//     * @throws Exception 异常信息
//     */
//    @Test
//    public void updateCfcaId1() throws Exception {
//        WsResult result = new WsResult();
//        result.setResult("0000");
//        MvcResult mockResult = mvc.perform(post("/conditional/updateCfcaId").contentType(MediaType.APPLICATION_JSON_UTF8).accept(MediaType.APPLICATION_JSON_UTF8)
//            .content("{\"applyCd\":\"BPA2091805000910\",\"cfcaId\":\"AAAAsssss\",\"type\":\"1\"}")).andExpect(status().isOk()).andExpect(request().asyncStarted()).andReturn();
//        mockResult.getAsyncResult(60000L);
//        mvc.perform(asyncDispatch(mockResult)).andExpect(content().json(JSON.toJSONString(result), false)).andDo(print());
//    }
//
//    /**
//     * 更新机构为8的cfcaId和状态.
//     *
//     * @throws Exception 异常信息
//     */
//    @Test
//    public void updateCfcaId2() throws Exception {
//        WsResult result = new WsResult();
//        result.setResult("0000");
//        MvcResult mockResult = mvc.perform(post("/conditional/updateCfcaId").contentType(MediaType.APPLICATION_JSON_UTF8).accept(MediaType.APPLICATION_JSON_UTF8)
//            .content("{\"applyCd\":\"BPA0451801000711\",\"cfcaId\":\"AAAAsssss\",\"type\":\"1\"}")).andExpect(status().isOk()).andExpect(request().asyncStarted()).andReturn();
//        mockResult.getAsyncResult(60000L);
//        mvc.perform(asyncDispatch(mockResult)).andExpect(content().json(JSON.toJSONString(result), false)).andDo(print());
//    }
//
//    /**
//     * 线下产品不能电子签.
//     *
//     * @throws Exception 异常信息
//     */
//    @Test
//    public void updateCfcaIdError1() throws Exception {
//        WsResult result = new WsResult();
//        result.setResult("0028");
//        MvcResult mockResult = mvc.perform(post("/conditional/updateCfcaId").contentType(MediaType.APPLICATION_JSON_UTF8).accept(MediaType.APPLICATION_JSON_UTF8)
//            .content("{\"applyCd\":\"BPA0591901000165\",\"cfcaId\":\"AAAAsssss\",\"type\":\"1\"}")).andExpect(status().isOk()).andExpect(request().asyncStarted()).andReturn();
//        mockResult.getAsyncResult(60000L);
//        mvc.perform(asyncDispatch(mockResult)).andExpect(content().json(JSON.toJSONString(result), false)).andDo(print());
//    }
//
//    /**
//     * aaa在系统中不存在.
//     *
//     * @throws Exception 异常信息
//     */
//    @Test
//    public void updateCfcaIdError2() throws Exception {
//        WsResult result = new WsResult();
//        result.setResult("0021");
//        MvcResult mockResult = mvc.perform(
//            post("/conditional/updateCfcaId").contentType(MediaType.APPLICATION_JSON_UTF8).accept(MediaType.APPLICATION_JSON_UTF8).content("{\"applyCd\":\"aaa\",\"cfcaId\":\"AAAAsssss\",\"type\":\"1\"}"))
//            .andExpect(status().isOk()).andExpect(request().asyncStarted()).andReturn();
//        mockResult.getAsyncResult(60000L);
//        mvc.perform(asyncDispatch(mockResult)).andExpect(content().json(JSON.toJSONString(result), false)).andDo(print());
//    }
//
//    /**
//     * 状态不为19或者20.
//     *
//     * @throws Exception 异常信息
//     */
//    @Test
//    public void updateCfcaIdError3() throws Exception {
//        WsResult result = new WsResult();
//        result.setResult("0027");
//        MvcResult mockResult = mvc.perform(post("/conditional/updateCfcaId").contentType(MediaType.APPLICATION_JSON_UTF8).accept(MediaType.APPLICATION_JSON_UTF8)
//            .content("{\"applyCd\":\"BAH2091806010079\",\"cfcaId\":\"AAAAsssss\",\"type\":\"1\"}")).andExpect(status().isOk()).andExpect(request().asyncStarted()).andReturn();
//        mockResult.getAsyncResult(60000L);
//        mvc.perform(asyncDispatch(mockResult)).andExpect(content().json(JSON.toJSONString(result), false)).andDo(print());
//    }
//
//    /**
//     * 车架号未输入.
//     *
//     * @throws Exception 异常信息
//     */
//    @Test
//    public void updateCfcaIdError4() throws Exception {
//        WsResult result = new WsResult();
//        result.setResult("0030");
//        MvcResult mockResult = mvc.perform(post("/conditional/updateCfcaId").contentType(MediaType.APPLICATION_JSON_UTF8).accept(MediaType.APPLICATION_JSON_UTF8)
//            .content("{\"applyCd\":\"BAH2071908002510\",\"cfcaId\":\"AAAAsssss\",\"type\":\"1\"}")).andExpect(status().isOk()).andExpect(request().asyncStarted()).andReturn();
//        mockResult.getAsyncResult(60000L);
//        mvc.perform(asyncDispatch(mockResult)).andExpect(content().json(JSON.toJSONString(result), false)).andDo(print());
//    }
//
//    /**
//     * 还款卡号未输入.
//     *
//     * @throws Exception 异常信息
//     */
//    @Test
//    public void updateCfcaIdError5() throws Exception {
//        WsResult result = new WsResult();
//        result.setResult("0030");
//        MvcResult mockResult = mvc.perform(post("/conditional/updateCfcaId").contentType(MediaType.APPLICATION_JSON_UTF8).accept(MediaType.APPLICATION_JSON_UTF8)
//            .content("{\"applyCd\":\"BAH2071908002510\",\"cfcaId\":\"AAAAsssss\",\"type\":\"1\"}")).andExpect(status().isOk()).andExpect(request().asyncStarted()).andReturn();
//        mockResult.getAsyncResult(60000L);
//        mvc.perform(asyncDispatch(mockResult)).andExpect(content().json(JSON.toJSONString(result), false)).andDo(print());
//    }
//
//}

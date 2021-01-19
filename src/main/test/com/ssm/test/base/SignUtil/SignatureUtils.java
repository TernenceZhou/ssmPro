package com.ssm.test.base.SignUtil;

import java.io.ByteArrayOutputStream;
import java.security.Key;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Signature;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import javax.crypto.Cipher;

import org.apache.commons.collections.map.LinkedMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSONObject;

import it.sauronsoftware.base64.Base64;

/**
 * 签名工具
 *
 */
public class SignatureUtils {

	private static final Logger LOGGER = LoggerFactory.getLogger(SignatureUtils.class);

    /**
     * RSA最大加密明文大小
     */
    private static final int MAX_ENCRYPT_BLOCK = 117;
    
    /**
     * RSA最大解密密文大小
     */
    private static final int MAX_DECRYPT_BLOCK = 128;

	private SignatureUtils() {
	}

	/**
	 * 验签并解密
	 * <p>
     * 对于<b>合作伙伴</b>，publicKey是指保险公司的公钥，privateKey是指合作伙伴的私钥<br>
     * 对于<b>保险公司</b>，publicKey是指合作伙伴的公钥，privateKey是指保险公司自己的私钥<br>
	 * 
	 * @param request 原始报文(JSON字符串)
	 * @param publicKey  公钥
	 * @param privateKey 私钥
	 * @param isCheckSign 是否验签
	 * @param isDecrypt 是否解密
	 * @return 解密后的明文，验签失败则异常抛出
	 * @throws Exception
	 */
	public static String checkSignAndDecrypt(String request,String publicKey, String privateKey,
			boolean isCheckSign, boolean isDecrypt) throws Exception {
		boolean verifyResult = false;
		JSONObject requestJSONObject = JSONObject.parseObject(request);
		String sign = requestJSONObject.getString("signContent");//获取的签文
		String bizContent = requestJSONObject.getString("bizContent");//获取的业务数据密文
		requestJSONObject.remove("signContent");//要排序先去掉signContent（签文）
		String signContent = getSignContent(requestJSONObject);//所有key排序后放入LingkedMap后map.toString()
		LOGGER.info("签名字符串为：" + signContent);
		if(isCheckSign){
			verifyResult = verify(signContent, sign, publicKey);
		}
		if(isDecrypt && verifyResult){
			return decryptByPrivateKey(bizContent, privateKey);
		}
		return null;
	}
	
	/**
	 * 加密并签名
	 * <p>
     * 对于<b>合作伙伴</b>，publicKey是指保险公司的公钥，privateKey是指合作伙伴的私钥<br>
     * 对于<b>保险公司</b>，publicKey是指合作伙伴的公钥，privateKey是指保险公司自己的私钥<br>
	 *  
	 * @param publicKey  公钥
	 * @param privateKey  私钥
	 * @param responseContent 返回报文原文
	 * @param isCheckSign  是否签名
	 * @param isEncrypt  是否加密
	 * @return  加密加签后的返回报文
	 * @throws Exception
	 */
	public static String encryptAndSign(String publicKey, String privateKey,String responseContent,
			boolean isCheckSign, boolean isEncrypt) throws Exception{
		JSONObject responseJSONObject = JSONObject.parseObject(responseContent);
		String bizContent = responseJSONObject.getString("bizContent");
		responseJSONObject.remove("signContent");//去掉signContent,之后加签添加
		if(isEncrypt){
			String encryptBizContent = encryptByPublicKey(bizContent, publicKey);
			LOGGER.info("加密后业务数据：" + encryptBizContent);
			responseJSONObject.put("bizContent", encryptBizContent);
			if(isCheckSign){
				String signContent = getSignContent(responseJSONObject);//所有key排序后放入LingkedMap后map.toString()
				LOGGER.info("待签名字符串为：" + signContent);
				String sign = sign(signContent, privateKey);
				responseJSONObject.put("signContent", sign);
			}
		} else if(isCheckSign){//只加签、不加密
			String signContent = getSignContent(responseJSONObject);//所有key排序后放入LingkedMap后map.toString()
			LOGGER.info("待签名字符串为：" + signContent);
			String sign = sign(signContent, privateKey);
			responseJSONObject.put("signContent", sign);
		}
		return responseJSONObject.toJSONString();
	}
	
	   
    /**
     * 封装待验签的内容
     * @param sortedParam
     * @return
     */
	public static String getSignContent(Map<String, Object> sortedParam) {
		LinkedMap map = new LinkedMap();
		List<String> keys = new ArrayList<>(sortedParam.keySet());
		Collections.sort(keys);
		for (int i = 0; i < keys.size(); i++) {
			String key = keys.get(i);
			String value = sortedParam.get(key).toString();
			map.put(key, value);
		}
		LOGGER.info("map = "+map.toString());
		return map.toString();
	}

	/**
	 * 验签
	 * @param request
	 * @param sign
	 * @param publicKey
	 * @return
	 */
	public static boolean verify(String request, String sign, String publicKey) {
		try {
			return SignatureUtils.verify(request.getBytes(CharsetEnum.UTF_8.code), publicKey, sign);
		} catch (Exception e) {
			LOGGER.error(ExceptionUtil.getErrorMsg(e),e);
			throw new RuntimeException(e);
		}
	}
	
    /**
     * <p>
     * 校验数字签名
     * </p>
     * 
     * @param data 已加密数据
     * @param publicKey 公钥(BASE64编码)
     * @param sign 数字签名
     * 
     * @return
     * @throws Exception
     * 
     */
    public static boolean verify(byte[] data, String publicKey, String sign)
            throws Exception {
        byte[] keyBytes = Base64Utils.decode(publicKey);
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance(SignEnum.SIGN_TYPE_RSA.code);
        PublicKey publicK = keyFactory.generatePublic(keySpec);
        Signature signature = Signature.getInstance(SignEnum.SIGNATURE_ALGORITHM.code);
        signature.initVerify(publicK);
        signature.update(data);
        return signature.verify(Base64Utils.decode(sign));
    }
    
    /**
     * 私钥对数据进行解密
     * @param bizContent
     * @param privateKey
     * @return
     */
	public static String decryptByPrivateKey(String bizContent, String privateKey) {
		try {
			return new String(SignatureUtils.decryptByPrivateKey(Base64.decode(bizContent.getBytes()), privateKey),CharsetEnum.UTF_8.code);
		} catch (Exception e) {
			LOGGER.error(ExceptionUtil.getErrorMsg(e),e);
			throw new RuntimeException(e);
		}
	}
	
    /**
     * <P>
     * 私钥解密
     * </p>
     * 
     * @param encryptedData 已加密数据
     * @param privateKey 私钥(BASE64编码)
     * @return
     * @throws Exception
     */
    public static byte[] decryptByPrivateKey(byte[] encryptedData, String privateKey)
            throws Exception {
        byte[] keyBytes = Base64Utils.decode(privateKey);
        PKCS8EncodedKeySpec pkcs8KeySpec = new PKCS8EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance(SignEnum.SIGN_TYPE_RSA.code);
        Key privateK = keyFactory.generatePrivate(pkcs8KeySpec);
        Cipher cipher = Cipher.getInstance(keyFactory.getAlgorithm());
        cipher.init(Cipher.DECRYPT_MODE, privateK);
        int inputLen = encryptedData.length;
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        int offSet = 0;
        byte[] cache = null;
        int i = 0;
        // 对数据分段解密
        while (inputLen - offSet > 0) {
            if (inputLen - offSet > MAX_DECRYPT_BLOCK) {
                cache = cipher.doFinal(encryptedData, offSet, MAX_DECRYPT_BLOCK);
            } else {
                cache = cipher.doFinal(encryptedData, offSet, inputLen - offSet);
            }
            out.write(cache, 0, cache.length);
            i++;
            offSet = i * MAX_DECRYPT_BLOCK;
        }
        byte[] decryptedData = out.toByteArray();
        out.close();
        return decryptedData;
    }
    

	/**
	 * 公钥加密
	 * @param request
	 * @param publicKey
	 * @return
	 */
	public static String encryptByPublicKey(String request, String publicKey) throws Exception{
		return Base64Utils.encode(SignatureUtils.encryptByPublicKey(request.getBytes(CharsetEnum.UTF_8.code), publicKey));
	}
	
	  /**
     * <p>
     * 公钥加密
     * </p>
     * 
     * @param data 源数据
     * @param publicKey 公钥(BASE64编码)
     * @return
     * @throws Exception
     */
    public static byte[] encryptByPublicKey(byte[] data, String publicKey)
            throws Exception {
        byte[] keyBytes = Base64Utils.decode(publicKey);
        X509EncodedKeySpec x509KeySpec = new X509EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance(SignEnum.SIGN_TYPE_RSA.code);
        Key publicK = keyFactory.generatePublic(x509KeySpec);
        // 对数据加密
        Cipher cipher = Cipher.getInstance(keyFactory.getAlgorithm());
        cipher.init(Cipher.ENCRYPT_MODE, publicK);
        int inputLen = data.length;
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        int offSet = 0;
        byte[] cache;
        int i = 0;
        // 对数据分段加密
        while (inputLen - offSet > 0) {
            if (inputLen - offSet > MAX_ENCRYPT_BLOCK) {
                cache = cipher.doFinal(data, offSet, MAX_ENCRYPT_BLOCK);
            } else {
                cache = cipher.doFinal(data, offSet, inputLen - offSet);
            }
            out.write(cache, 0, cache.length);
            i++;
            offSet = i * MAX_ENCRYPT_BLOCK;
        }
        byte[] encryptedData = out.toByteArray();
        out.close();
        return encryptedData;
    }

	/**
	 * 加签
	 * @param request
	 * @param privateKey
	 * @return
	 */
	public static String sign(String request, String privateKey) {
		try {
			return SignatureUtils.sign(request.getBytes(CharsetEnum.UTF_8.code), privateKey);
		} catch (Exception e) {
			LOGGER.error(ExceptionUtil.getErrorMsg(e),e);
			throw new RuntimeException(e);
		}
	}
	
    /**
     * <p>
     * 用私钥对信息生成数字签名
     * </p>
     * 
     * @param data 已加密数据
     * @param privateKey 私钥(BASE64编码)
     * 
     * @return
     * @throws Exception
     */
    public static String sign(byte[] data, String privateKey) throws Exception {
        byte[] keyBytes = Base64Utils.decode(privateKey);
        PKCS8EncodedKeySpec pkcs8KeySpec = new PKCS8EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance(SignEnum.SIGN_TYPE_RSA.code);
        PrivateKey privateK = keyFactory.generatePrivate(pkcs8KeySpec);
        Signature signature = Signature.getInstance(SignEnum.SIGNATURE_ALGORITHM.code);
        signature.initSign(privateK);
        signature.update(data);
        return Base64Utils.encode(signature.sign());
    }
}

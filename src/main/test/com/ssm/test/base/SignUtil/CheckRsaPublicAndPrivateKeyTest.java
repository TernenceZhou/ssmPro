package com.ssm.test.base.SignUtil;

import org.junit.Test;

public class CheckRsaPublicAndPrivateKeyTest {
	
	//保险公司的公钥
	public static String publicKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCs/qLvyhRJxvjo0xo+tCD9L2eQr3FQfa6RFCnyF+HTK3Y6ee1LO/lR20rRTgY6d1ktsegJQ2oxAzEJzDpTpfK3a1DOQICyJ4Ger26LMrX9wFqBb3ElW3wcHGbxBxoBXcFWVsA6etNNZkU/KWhCxo6XBzEJtqeOZGQzQj/nqHNy7QIDAQAB";
	//保险公司的私钥
	public static String privateKey = "MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBAKz+ou/KFEnG+OjTGj60IP0vZ5CvcVB9rpEUKfIX4dMrdjp57Us7+VHbStFOBjp3WS2x6AlDajEDMQnMOlOl8rdrUM5AgLIngZ6vbosytf3AWoFvcSVbfBwcZvEHGgFdwVZWwDp6001mRT8paELGjpcHMQm2p45kZDNCP+eoc3LtAgMBAAECgYBYWrVdQxiZlcYLI8aDv/wZU9zRSMnXElnWPzYtL4VnFQuNUjif9EGiTR4pSHBl7A7gB706/fN+lOK23lfr4RXVQQJkc2QSKrU4V30FcK39/vaMRtKk79ZleLTdU3YJ8l/40fJ5crhqAgfrVqapLdPPdFiztW54/9FC2fy2nMSAAQJBANzoIZtRJCUaFzm80jv58QTIdM5og6tR38XmTHQoh+qJz0Kv0rmm0SkUBCwIrN3lMPOE/9rKOS5EKsJP9ernh20CQQDIegJiD7IeP5zmW1ok15fkSQfBGmhmSeOgNo/ztoLuPwduSZZ15sJHFvDYCPLBCVu8PJ6NxnYkbNya3Lo73umBAkEAtah6gmO+anhDIyrAY6vM5FcHnvlZVZfVgcM5mcf+xQMgmkFF839XvwUDzUYxCaRAlfEICV6EmSRbWUEyBELzHQJBALxu8g558lG8OR3Mf85hVsOcYU2AJOEAUpQktOm+gxKs668eO+5WGAX56iclQgdvZGpqEB3yjNlv+WsWTXY48AECQQCHQuQ/QszXPGuKY5FH8xNzYAVN3AeuyxBl3aEWBudi8XwTkyZ4San2aqTsWkqQzBOFDw4NMS2gkEya82sbH+UI";

	//合作伙伴的公钥
	public static String thirdPublicKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCiFIfrVmrNDfYzbZci+Ghw3J4KMW1JJZjKI8ntEOnAOQGyriJMv6Rl7Lo1nLFJ5mvwgMSMM3cQ/CUViLVgu7atqlEsn5ZyIzvoeGIJjqDr7Z1B9bG2pQxAt5XiMEkFDZq7iqdIuN4OX+c1xaq81sLHD2IF56wYLLD8R5ip3Ahj7wIDAQAB";
	//合作伙伴的私钥
	public static String thirdPrivateKey = "MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAKIUh+tWas0N9jNtlyL4aHDcngoxbUklmMojye0Q6cA5AbKuIky/pGXsujWcsUnma/CAxIwzdxD8JRWItWC7tq2qUSyflnIjO+h4YgmOoOvtnUH1sbalDEC3leIwSQUNmruKp0i43g5f5zXFqrzWwscPYgXnrBgssPxHmKncCGPvAgMBAAECgYAsWavblLkCxThCWFGL6ydBAs1oAqBh7JzDa0mcygz8YVz6lLWkBKiqjz1g4DCPBTMyCzo9FvQUvLo1C0R+ZL8WlGrw5CYyefsHcZA6yBfXWPD53ecbzEuM2Ym0suc12ipKCJXp2RNLFF45dYyXvZCsjZnexJhV222qlJdCog5kMQJBAN3ZPIPioDDYo3ytd8CH4DY9SFLWLwd7sYWA13VPL0OrWjhfk7AsFi3ytFt9ioTUiEueymDTRXMBFBgGS4dQymkCQQC7B+aHNXlolJ0CymRDFvvcB4cbUDiGNInQBE7NBXHI2R8+GHMU+/iDl27ClUYpGOJMnUwxl9IsBnj9y7zqOQCXAkEA2ZY1ak0ePIpeXuxsZaNe3xPgGY8E9Vv2UzB5Ig+WFdK8XEoxujqjTlGbX5iUAY/KVhDaAXl1xkQqhx21enRc8QJAJVP2VpX9nTnL/HqYeCtmKQv3kyP3pBFoT/QMJi8n/oYXDjWjAlUnzFu053ETh7BHujLKujsq306LZ1v6YGTwEQJBALvXytchgrBYyNeJL/u2qc5itNELZ/lCkeeoztaFXzAUI6wtIiFc6BiulXfRpad/+9EOibhxRVnlt+J/gAjEWt4=";

	/**
	 * RSA公钥私钥加密和解密
	 * @throws Exception
	 */
	@Test
	public void testPublicKeyAndPrivateKey() throws Exception {
		String txt = "12345678";
		System.out.println("原文：" + txt);
		String encryptContent = SignatureUtils.encryptByPublicKey(txt, thirdPublicKey);
		System.out.println("密文：" + encryptContent);
		String txt2 = SignatureUtils.decryptByPrivateKey(encryptContent, thirdPrivateKey);
		System.out.println("解密后的明文：" + txt2 + "\n是否一致:" + txt.equals(txt2));
	}
	
	/**
	 * RSA公钥私钥加签和验签
	 * @throws Exception
	 */
	@Test
	public void testPublicKeyAndPrivateKeySing() throws Exception {
		String signContent = "12345678";
		System.out.println("加签原文：" + signContent);
		String sign = SignatureUtils.sign(signContent, privateKey);//加签
		System.out.println("加签后密文：" + sign);
		
		
		boolean b = SignatureUtils.verify(signContent, sign, publicKey);//验签
		System.out.println("私钥验签结果：" + b);
		
	}

	/**
	 * RSA公钥私钥加密加签和解密验签，模拟 合作伙伴 请求 保险公司
	 *
	 * @throws Exception
	 */
	@Test
	public void testPublicKeyAndPrivateKeyAndCheckSign() throws Exception {
		String txt = "{\"bizContent\":{\"interfaceHead\":{\"requestNo\":\"20181218103150062848\"},\"VehicleModelQueryReq\":{\"flag\":\"\",\"vehicleBrandModelKey\":131,\"pageNo\":1,\"terminalNo\":\"NXS_6040100_001\",\"vin\":13131,\"pageSize\":100,\"plateNo\":13131}},\"charset\":\"UTF-8\",\"format\":\"json\",\"inscompanyCode\":\"abc\",\"serviceCode\":\"third.insurance.vehicleModelQuery\",\"signContent\":\"\",\"signType\":\"RSA\",\"thirdCode\":\"10037\",\"timestamp\":\"20181218103206062850\"}";

		System.out.println("原文：" + txt);
		//publicKey:保险公司的公钥，thirdPrivateKey:合作伙伴的私钥
		//先使用'保险公司的公钥'加密，然后使用'合作伙伴的私钥'加签
		String encryptContent = SignatureUtils.encryptAndSign(publicKey, thirdPrivateKey, txt,true,true);
		System.out.println("密文：" + encryptContent);

		//privateKey:保险公司的私钥，thirdPublicKey:合作伙伴的公钥
		//先使用'合作伙伴的公钥'验签，然后使用'保险公司的公钥'解密
		String txt2 = SignatureUtils.checkSignAndDecrypt(encryptContent, thirdPublicKey, privateKey,true,true);
		System.out.println("原文：" + txt);
		System.out.println("解密后的明文：" + txt2);
		System.out.println("请检查原文中的bizContent内容与解密后的明文是否相同");
	}

	/**
	 * RSA公钥私钥加密加签和解密验签，模拟 保险公司 返回 合作伙伴
	 *
	 * @throws Exception
	 */
	@Test
	public void testPublicKeyAndPrivateKeyAndCheckSign2() throws Exception {
		String requestJson = "{\"bizContent\":{\"interfaceHead\":{\"requestNo\":\"20181218103150062848\"},\"VehicleModelQueryReq\":{\"flag\":\"\",\"vehicleBrandModelKey\":131,\"pageNo\":1,\"terminalNo\":\"NXS_6040100_001\",\"vin\":13131,\"pageSize\":100,\"plateNo\":13131}},\"charset\":\"UTF-8\",\"format\":\"json\",\"inscompanyCode\":\"abc\",\"serviceCode\":\"third.insurance.vehicleModelQuery\",\"signContent\":\"\",\"signType\":\"RSA\",\"thirdCode\":\"10037\",\"timestamp\":\"20181218103206062850\"}";

		System.out.println("原文：" + requestJson);
		//privateKey:保险公司的私钥，thirdPublicKey:合作伙伴的公钥
		//先使用'合作伙伴的公钥'加密，然后使用'保险公司的私钥'加签
		String encryptContent = SignatureUtils.encryptAndSign(thirdPublicKey, privateKey, requestJson,true,true);
		System.out.println("密文：" + encryptContent);

		//publicKey:保险公司的公钥，thirdPrivateKey:合作伙伴的私钥
		//先使用'保险公司的公钥'验签，然后使用'合作伙伴的私钥'解密
		String responseJson = SignatureUtils.checkSignAndDecrypt(encryptContent, publicKey, thirdPrivateKey,true,true);
		System.out.println("原文：" + requestJson);
		System.out.println("解密后的明文：" + responseJson);
		System.out.println("请检查原文中的bizContent内容与解密后的明文是否相同");
	}
	
}

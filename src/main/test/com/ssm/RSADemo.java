package com.ssm;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Security;
import java.security.Signature;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.crypto.Cipher;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.lf5.util.StreamUtils;

public class RSADemo {
    private static String algorithm = "SHA256withRSA";

    public static void main(String[] args) {
        String keyword = "奥迪";
        String userId = "123456789";
        String oldSign = "Ugaug0keK0tm/4Aq9easzvNUDtnEELnXq6IS52tPSCmRVccfYZe3WvOt/RmIaO2JX8vDTHcA4X3zEzXTNpJ80+75Q1t/5hl5HafoWOYumRsbbywEtGtRZgngxKtNeQ6Jz/Jr6YlAki6g3y5XyKBKfE5EUpwjesR5QAZU7vs0vUY=";
        String publicKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCUoFBcJMk+rQhs/MpXcxY8ltZ3Pjxsxec9cIyJ8GIKHvueh92gstmvR4ebNV3PPD4LmL7yJlycz4n17+HGF1uGpNMN5j/EFds0boan5jpetLlQ43ylzqrzq+5VG7l2Gwe+YO6GSaJsstP0Av8GaXEZcGT2B0E1c5gx3XTo9th+uQIDAQAB";
        String privateKey = "MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAJSgUFwkyT6tCGz8yldzFjyW1nc+PGzF5z1wjInwYgoe+56H3aCy2a9Hh5s1Xc88PguYvvImXJzPifXv4cYXW4ak0w3mP8QV2zRuhqfmOl60uVDjfKXOqvOr7lUbuXYbB75g7oZJomyy0/QC/wZpcRlwZPYHQTVzmDHddOj22H65AgMBAAECgYBKTh//AVEvqZiFzJhowhwC7LKKaS4Sf5rNZ8CLkgeh4b2Qk4KlPeWBMTTFzxd4bTjj2VjVfYJdz5C8yVJKFBFoa0w+P/g/YT5V8IqsRuF74eJeVScrBDqk5Tk5WpE/P+au8gWamHrJnsansfYDCArCfOf4T48pxq4i0LXgkbg6pQJBAMj2343kFRE1ViPI87F3g7dWJv2qLgEWX9xPM4HJdtQsRpuyV5n9UGp7Nn7i08sv4Rg9aLMOjtS97Sn4M6zssKcCQQC9VCQPsPxRejznNCVYTiq6hRhCXaK5ysrVLQXFs9I7gVX3CEA746GMV8iNIv7K7q9ZnKuj2ZHcreSriyMRTOGfAkBJQcUIYkZTuY+nB8/dt2VqZZtdCLYwa0mSc8Sg4SHSAjnS89X/KlowFq4s3t65yMBTJ7+M1he28W0MyY98z+MtAkAG7jCPvnvOA7p9ACSp0dqwjzSvITxWrry0BvziGs4ETZy2+T9YseF1ALWfrPtEtG4IyrphuhIj0N3BBcvX00ejAkBkc7AXJAb+Cn0rsGZe9ZdLogVWJKA5gTYy0ThSQ2SocoCLuy+rRlBX67rHN3/0BKF+byWaf/MTdc5QtbH5pK9J";
        Map<String, String> bizdata = new HashMap<String, String>();
        bizdata.put("keyword", keyword);
        bizdata.put("userId", userId);
        // 签名前先排序
        String wtsign = sortParametersWithASCII(bizdata);
        System.out.println(wtsign);
        String signData = "";
        try {
            // 加签
            signData = sign(wtsign, privateKey);
            System.out.println(signData);
        } catch (Exception se) {
        }
        //验签
        Boolean verifyresult = verifySignRsa(bizdata, oldSign, publicKey);
        System.out.println(verifyresult);
        //解密方式
        //原始加密串
        String pwd = "g4otiaYyELiIEv2x9X4CDvMYfmWFZzV3VRDgzGCSjgyVR4FWxEKneEYJp/MvOfqkHfseuDnJvgnNKXDOUY37q40w4GoUiurIyXOaorhpjtrBJ9jmL3n3ExDHrq0kARnUjRuw3Y2dio9WocfpCMyW0XEAYaQQZtHcIs3k2lWbLYc=";
        //解密
        try {
            System.out.println("解密后值为:" + rsaDecrypt(pwd, privateKey, "UTF-8"));
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

    }

    public static String sign(String responseBody, String inPrivateKey) throws Exception {
        byte[] dataEncode = Base64.encodeBase64(responseBody.getBytes("UTF-8"));
        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(Base64.decodeBase64(inPrivateKey.getBytes()));
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        PrivateKey privateKey = keyFactory.generatePrivate(keySpec);
        Signature signatureChecker;
        Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider());
        signatureChecker = Signature.getInstance(algorithm);
        signatureChecker.initSign(privateKey);
        signatureChecker.update(dataEncode);
        byte[] sign = signatureChecker.sign();
        return new String(Base64.encodeBase64(sign));
    }

    public static Boolean verifySignRsa(Map param, String signature, String verifyKey) {
        if (!hasText(signature)) {
            return false;
        }
        String wtsign = "";
        wtsign = sortParametersWithASCII(param);
        Boolean verifyresult = false;
        verifyresult = verify(wtsign, signature, verifyKey);
        //兼容partnerId不加密
        if (!verifyresult) {
            param.remove("partnerId");
            wtsign = sortParametersWithASCII(param);
            verifyresult = verify(wtsign, signature, verifyKey);
        }
        return verifyresult;
    }

    /**
     * 验签
     *
     * @param businessdata 实际业务数据
     * @param signedText   加密后待验证数据
     * @return boolean
     */
    public static boolean verify(String businessdata, String signedText, String verifyKey) {
        try {
            String dataEncode = new String(Base64.encodeBase64(businessdata.getBytes("UTF-8")));
            X509EncodedKeySpec keySpec = new X509EncodedKeySpec(Base64.decodeBase64(verifyKey.getBytes()));
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            PublicKey publicKey = keyFactory.generatePublic(keySpec);
            Signature signatureChecker = null;
            Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider());
            signatureChecker = Signature.getInstance(algorithm);
            signatureChecker.initVerify(publicKey);
            signatureChecker.update(dataEncode.replace("\n", "").getBytes());
            byte[] signBytes = signedText.getBytes("UTF-8");
            byte[] sign = Base64.decodeBase64(signBytes);
            return signatureChecker.verify(sign);
        } catch (Exception e) {
        }
        return false;
    }

    public static String rsaDecrypt(String content, String privateKey, String charset) throws Exception {
        return rsaDecrypt(content, privateKey, charset, null);
    }

    public static String rsaDecrypt(String content, String privateKey, String charset, String signType) throws Exception {
        int maxDecryptBlock = 256;
        try {
            PrivateKey priKey = getPrivateKeyFromPKCS8("RSA", new ByteArrayInputStream(privateKey.getBytes()));
            Cipher cipher = Cipher.getInstance("RSA");
            cipher.init(2, priKey);
            byte[] encryptedData = StringUtils.isEmpty(charset) ? Base64.decodeBase64(content.getBytes()) : Base64.decodeBase64(content.getBytes(charset));
            int inputLen = encryptedData.length;
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            int offSet = 0;
            int i = 0;
            while (inputLen - offSet > 0) {
                byte[] cache;
                if (inputLen - offSet > maxDecryptBlock) {
                    cache = cipher.doFinal(encryptedData, offSet, maxDecryptBlock);
                } else {
                    cache = cipher.doFinal(encryptedData, offSet, inputLen - offSet);
                }
                out.write(cache, 0, cache.length);
                i++;
                offSet = i * maxDecryptBlock;
            }
            byte[] decryptedData = out.toByteArray();
            out.close();

            return StringUtils.isEmpty(charset) ? new String(decryptedData) : new String(decryptedData, charset);
        } catch (Exception e) {
            throw new Exception("RSA解密失败. EncodeContent = " + content + ",charset = " + charset, e);
        }
    }

    public static PrivateKey getPrivateKeyFromPKCS8(String algorithm, InputStream ins) throws Exception {
        if ((ins == null) || (StringUtils.isEmpty(algorithm))) {
            return null;
        }
        KeyFactory keyFactory = KeyFactory.getInstance(algorithm);
        byte[] encodedKey = StreamUtils.getBytes(ins);
        encodedKey = Base64.decodeBase64(encodedKey);
        return keyFactory.generatePrivate(new PKCS8EncodedKeySpec(encodedKey));
    }

    public static boolean hasText(String str) {
        if (!hasLength(str)) {
            return false;
        } else {
            int strLen = str.length();

            for (int i = 0; i < strLen; ++i) {
                if (!Character.isWhitespace(str.charAt(i))) {
                    return true;
                }
            }

            return false;
        }
    }

    public static boolean hasLength(String str) {
        return str != null && str.length() > 0;
    }

    public static String sortParametersWithASCII(Map param) {
        List sortList = new LinkedList<String>();
        Iterator listadd = param.keySet().iterator();
        while (listadd.hasNext()) {
            Object obj = listadd.next();
            sortList.add(obj.toString());
        }
        //参数排序
        Collections.sort(sortList);
        String sortStr = "";
        for (int i = 0; i < sortList.size(); i++) {
            String paramListStr = "";
            //对List数据进行排序
            if (param.get(sortList.get(i)) instanceof List) {
                List dataList = (List) param.get(sortList.get(i));
                if (null != dataList && dataList.size() > 0) {
                    Collections.sort(dataList);
                    for (int k = 0; k < dataList.size(); k++) {
                        paramListStr = paramListStr + dataList.get(k) + ",";
                    }
                    paramListStr = paramListStr.substring(0, paramListStr.length() - 1);

                }
                sortStr = sortStr + sortList.get(i) + "=" + paramListStr + "&";

            } else {
                sortStr = sortStr + sortList.get(i) + "=" + param.get(sortList.get(i)) + "&";

            }

        }
        sortStr = sortStr.substring(0, sortStr.length() - 1);
        return sortStr;

    }
}

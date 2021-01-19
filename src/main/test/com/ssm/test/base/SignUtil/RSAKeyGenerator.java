package com.ssm.test.base.SignUtil;

import java.io.IOException;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.sun.org.apache.xml.internal.security.utils.Base64;

/**
 * RSA密钥生成器，请注意：请区分生产和测试环境
 * @author caiping.hcp
 * @version $Id: RSAKeyGenerator.java, v 0.1 2015年11月20日 下午12:17:48 caiping.hcp Exp $
 */
@SuppressWarnings("restriction")
public class RSAKeyGenerator {

    private static final Logger LOGGER = LoggerFactory.getLogger(RSAKeyGenerator.class);

    private RSAKeyGenerator() {

    }

    /**
     * @param args
     * @throws NoSuchAlgorithmException
     * @throws IOException
     */
    public static void main(String[] args) {

        KeyPairGenerator kpg; //创建‘密匙对’生成器
        try {
            kpg = KeyPairGenerator.getInstance("RSA");
            kpg.initialize(1024); //指定密匙长度（取值范围：512～2048）,2048为了应对齐安信扫描，真实使用1024
            KeyPair kp = kpg.genKeyPair(); //生成‘密匙对’，其中包含着一个公匙和一个私匙的信息
            PublicKey publicKey = kp.getPublic(); //获得公匙
            PrivateKey privateKey = kp.getPrivate(); //获得私匙

            // 输出公匙
            LOGGER.info("公钥 public key:");
            String publicKeyStr = Base64.encode(publicKey.getEncoded());
            LOGGER.info(publicKeyStr);

            // 输出私匙
            LOGGER.info("私钥 private key:");
            String privateKeyStr = Base64.encode(privateKey.getEncoded());
            LOGGER.info(privateKeyStr);
        } catch (NoSuchAlgorithmException e) {
            //LOGGER.error(ExceptionUtil.getFullStackTrace(e));
        }

    }
}

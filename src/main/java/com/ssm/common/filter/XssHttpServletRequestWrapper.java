package com.ssm.common.filter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import java.util.Map;

public class XssHttpServletRequestWrapper extends HttpServletRequestWrapper{
    private HttpServletRequest orgRequest = null;

    public XssHttpServletRequestWrapper(HttpServletRequest request) {
        super(request);
        this.orgRequest = request;
    }

    public String getParameter(String name) {
        String value = super.getParameter(name);
        if (value != null) {
            value = xssEncode(value);
        }

        return value;
    }

    public String[] getParameterValues(String name) {
        String[] values = super.getParameterValues(name);
        if (values != null && values.length > 0) {
            for(int i = 0; i < values.length; ++i) {
                values[i] = xssEncode(values[i]);
            }
        }

        return values;
    }

    public Map getParameterMap() {
        Map values = super.getParameterMap();
        return values;
    }

    public String getHeader(String name) {
        String value = super.getHeader(name);
        if (value != null) {
            value = xssEncode(value);
        }

        return value;
    }

    private static String xssEncode(String s) {
        if (s != null && !s.isEmpty()) {
            StringBuilder sb = new StringBuilder();

            for(int i = 0; i < s.length(); ++i) {
                char c = s.charAt(i);
                switch(c) {
                    case '\'':
                        sb.append('‘');
                        break;
                    case '<':
                        sb.append('＜');
                        break;
                    case '>':
                        sb.append('＞');
                        break;
                    default:
                        sb.append(c);
                }
            }

            return sb.toString();
        } else {
            return s;
        }
    }

    public HttpServletRequest getOrgRequest() {
        return this.orgRequest;
    }

    public static HttpServletRequest getOrgRequest(HttpServletRequest req) {
        return req instanceof XssHttpServletRequestWrapper ? ((XssHttpServletRequestWrapper)req).getOrgRequest() : req;
    }
}

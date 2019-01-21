package com.ixinnuo.financial.util.dom;

import java.util.ArrayList;
import java.util.List;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;


public class DomUtil {
    /**
     * 截取xml字符串的指定节点字符串
     * 
     * @param xmlStr
     *            xml字符串
     * @param xpath
     *            节点路径
     * @return
     */
    public static String getXmlByNode(String xmlStr, String xpath) {
        String xml = null;
        try {
            Document document = DocumentHelper.parseText(xmlStr);
            Element element = (Element) document.selectSingleNode(xpath);
            xml = element.asXML();
        }
        catch (Exception e) {
        }
        return xml;
    }
    
    /**
     * 截取xml字符串的指定节点值
     * 
     * @param xmlStr
     *            xml字符串
     * @param xpath
     *            节点路径
     * @return
     */
    public static String getValueByXmlNode(String xmlStr, String xpath, String nodeName) {
        String xml = null;
        try {
            Document document = DocumentHelper.parseText(xmlStr);
            Element element = (Element) document.selectSingleNode(xpath);
            xml = element.getStringValue();
        }
        catch (Exception e) {
        }
        return xml;
    }

    /**
     * 获取xml节点的值
     * @param xml xml字符串文件
     * @param attribute 节点的属性
     * @return
     */
    public static String getNodeValueByXml(String xml,String attribute){
        List<String> list = new ArrayList<String>();
        StringBuffer sb1 = new StringBuffer();
        StringBuffer sb2 = new StringBuffer();
        StringBuffer sb3 = new StringBuffer();
        StringBuffer sb4 = new StringBuffer();
        StringBuffer sb5 = new StringBuffer();
        StringBuffer sb6 = new StringBuffer();
        sb1.append("xmlns=\"http://www.chinatax.gov.cn/spec/\"");
        sb2.append("xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"");
        sb3.append("xmlns=\"http://www.chinatax.gov.cn/dataspec/\"");
        sb4.append("xmlns='http://www.chinatax.gov.cn/spec/'");
        sb5.append("xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'");
        sb6.append("xmlns='http://www.chinatax.gov.cn/dataspec/'");
        list.add(sb1.toString());
        list.add(sb2.toString());
        list.add(sb3.toString());
        list.add(sb4.toString());
        list.add(sb5.toString());
        list.add(sb6.toString());
        String text2 = "";
        for(String s : list)
        {
            if(xml.contains(s)){
                xml = xml.replaceAll(s, "");
            }
        }
        String r = getXmlByNode(xml, "service/body");
        Document document = null;
        try{
            document = DocumentHelper.parseText(r);//将字符串转化成document对象
            Element foo = document.getRootElement();
            String text = foo.getText();//获取元素内容
            String r2 = getXmlByNode(text.trim(), "taxML/"+attribute);
            document = DocumentHelper.parseText(r2);//将字符串转化成document对象
            Element foo2 = document.getRootElement();
            text2 = foo2.getText();//获取元素内容
        }catch(DocumentException e){
            e.printStackTrace();
        }
        return text2;
    }
    public static void main(String[] args) throws DocumentException {
//        String xml =
//                "<?xml version=\"1.0\" encoding=\"UTF-8\"?><taxML cnName=\"税局推送企业信息及涉税数据\" name=\"qyxxandsssj\" version=\"V1.0\" ><body><slxx><BJFK>ssssssss</BJFK><NSRSBH>340603150830376</NSRSBH><SLYY>可以办理</SLYY><SQRQ>2015-06-23</SQRQ><STATUS>11</STATUS><XYDK_ID>224</XYDK_ID><YHMC>JTYH</YHMC></slxx>"
//                        + "<slxx><BJFK>error</BJFK><NSRSBH>123</NSRSBH><SLYY>可以办理</SLYY><SQRQ>2015-06-23</SQRQ><STATUS>11</STATUS><XYDK_ID>224</XYDK_ID><YHMC>JTYH</YHMC></slxx></body></taxML>";
        
        String xml = 
            "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
//            +"<service xmlns='http://www.chinatax.gov.cn/dataspec/' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'>"
            +"<service>"
    +"<head>"
        +"<service_id>WSBS.API.CXNSRXX</service_id>"
        +"<channel_id>AHGS.WSBS.ANDROID</channel_id>"
        +"<channel_psw>F1427E67063DF9E61014E6D0EE985702</channel_psw>"
        +"<tran_seq>e876fef3252c4cf09216280e05fc314c</tran_seq>"
        +"<tran_date>20160126123225</tran_date>"
        +"<czry>340197348708798</czry>"
        +"<czjg>13401000000</czjg>"
        +"<mac_address>00-00-00-00-00-00</mac_address>"
    +"</head>"
    +"<body>"
        +"<![CDATA[<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
        +"<taxML>"
           + "<code>0</code>"
            +"<message></message>"
            +"<content>[{\"DJXH\":\"10113425000107407735\",\"SHXYDM\":\"\",\"NSRSBH\":\"342522197606122713\"}]</content>"
        +"</taxML>]]>"
        +"</body>"
        +"</service>";
//        String xml = 
//            "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
//        +"<taxML   version=\"1.0\">"
//            +"<code>-1</code>"
//            +"<message>API调用接口失败：解析请求报文错误</message>"
//            +"<content></content>"
//        +"</taxML>";
//        List<String> list = new ArrayList<String>();
//        list.add("xmlns='http://www.chinatax.gov.cn/dataspec/'");
//        list.add("xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'");
//        for(String s : list)
//        {
//            if(xml.contains(s)){
//                xml = xml.replaceAll(s, "");
//            }
//        }
        //System.out.println(xml);
        
//        String r = getXmlByNode(xml, "taxML/code");
        String r = getXmlByNode(xml, "service/body");
        //System.out.println("r:"+r);
        /*//获取r节点的值
        SAXReader sax = new SAXReader();
        Document document = sax.read(r);//reader为定义的一个字符串，可以转换为xml
        Element root = document.getRootElement();//获取到根节点元素
        String str = root.getText();//获取到
        //System.out.println(str);*/
        Document document = null;
        try{
            document = DocumentHelper.parseText(r);//将字符串转化成document对象
            Element foo = document.getRootElement();
            String text = foo.getText();//获取元素内容
            System.out.print("text:"+text);
            String textxml = getXmlByNode(text, "taxML/code");
            System.out.println("textXml:"+textxml);
//            document = DocumentHelper.parseText(textxml);//将字符串转化成document对象
//            Element foo1 = document.getRootElement();
//            String text2 = foo1.getText();//获取元素内容
            //System.out.println("code:"+text);
        }catch(DocumentException e){
            e.printStackTrace();
        }
        
    }
}

package com.ixinnuo.financial.util.json;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.dataformat.xml.JacksonXmlModule;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;

/**
 * Jackson框架是基于Java平台的一套数据处理工具，被称为“最好的Java Json解析器”。 </br>
 * Jackson框架包含了3个核心库：streaming,databind,annotations.Jackson还包含了其它数据处理类库，此外不作说明。
 * </br>
 * Jackson版本： 1.x (目前版本从1.1~1.9)与2.x。1.x与2.x从包的命名上可以看出来， </br>
 * 1.x的类库中，包命名以：org.codehaus.jackson.xxx开头， </br>
 * 而2.x类库中包命令：com.fastxml.jackson.xxx开头 </br>
 * Jackson Home Page：https://github.com/FasterXML/jackson </br>
 * Jackson Wiki：http://wiki.fasterxml.com/JacksonHome </br>
 * Jackson doc: https://github.com/FasterXML/jackson-docs </br>
 * Jackson Download Page：http://wiki.fasterxml.com/JacksonDownload </br>
 * 
 * @author carl
 * @param <T>
 */
public class JsonUtil {

    /**
     * 是否允许属性为单引号
     */
    private boolean ALLOW_SINGLE_QUOTES = true;

    /**
     * 当json反序列到对象时，未知属性是否终止反序列过程
     */
    private boolean FAIL_ON_UNKNOWN_PROPERTIES = true;

    /**
     * 当json反序列到对象时，属性为“小写_小写”形式,转为驼峰式
     */
    private boolean SNAKE_CASE = false;

    /**
     * 优雅输出，生产谨慎使用，会增加字符量
     */
    private boolean INDENT_OUTPUT = true;

    /**
     * 日期格式，全局统一模式；如果要对属性特殊设置请使用此工具类提供的内部类 CustomDateSerializer
     */
    private String DateFormat_pattern = "yyyy-MM-dd";

    /**
     * 初始化ObjectMapper对象，采用属性的默认值，如果想修改，在调用工具方法之前设置
     * 
     * @return
     */
    private ObjectMapper getObjectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, FAIL_ON_UNKNOWN_PROPERTIES);
        mapper.configure(JsonParser.Feature.ALLOW_SINGLE_QUOTES, ALLOW_SINGLE_QUOTES);
        mapper.configure(SerializationFeature.INDENT_OUTPUT, INDENT_OUTPUT);
        mapper.setDateFormat(new SimpleDateFormat(DateFormat_pattern));
        if (SNAKE_CASE) {
            mapper.setPropertyNamingStrategy(PropertyNamingStrategy.SNAKE_CASE);
        }
        return mapper;
    }

    /**
     * 把json字符串转为java对象
     * 
     * @param jsonStr
     *            json字符串
     * @param valueType
     *            java对象 可以是普通对象或者内置数据类型
     * @return T
     * @throws Exception
     */
    public <T> T jsonStr2Object(String jsonStr, Class<T> valueType) {
        ObjectMapper objectMapper = getObjectMapper();
        T readValue = null;
        try {
            readValue = objectMapper.readValue(jsonStr, valueType);
        }
        catch (IOException e) {
            e.printStackTrace();
        }
        return readValue;

    }

    /**
     * 把json字符串转为java对象,使用自定义的反序列化实现
     * 
     * @param <T>
     * @param jsonStr
     *            json字符串
     * @param valueType
     *            值类型
     * @param deser
     *            反序列化实现类
     * @return
     * @throws Exception
     */
    public <T> T jsonStr2ObjectByCustom(String jsonStr, Class<T> valueType, JsonDeserializer<? extends T> deser)
            throws Exception {
        ObjectMapper objectMapper = getObjectMapper();
        SimpleModule module = new SimpleModule();
        module.addDeserializer(valueType, deser);
        objectMapper.registerModule(module);
        return objectMapper.readValue(jsonStr, valueType);

    }

    /**
     * 把json文件转为java对象
     * 
     * @param jsonFile
     *            json文件
     * @param valueType
     *            java对象 可以是普通对象或者内置数据类型
     * @return T
     * @throws Exception
     */
    public <T> T jsonFile2Object(File jsonFile, Class<T> valueType) throws Exception {
        ObjectMapper objectMapper = getObjectMapper();
        return objectMapper.readValue(jsonFile, valueType);
    }

    /**
     * json字符串转成xml字符串
     * 
     * @param jsonStr
     * @param valueType
     * @return
     * @throws Exception
     */
    @SuppressWarnings({ "unchecked", "rawtypes" })
    public String jsonStr2xmlStr(String jsonStr, Class valueType) throws Exception {
        JacksonXmlModule module = new JacksonXmlModule();
        // 对集合属性是否包装一层
        module.setDefaultUseWrapper(true);
        ObjectMapper xmlMapper = new XmlMapper(module);
        xmlMapper.configure(SerializationFeature.INDENT_OUTPUT, INDENT_OUTPUT);
        String writeValueAsString = xmlMapper.writeValueAsString(jsonStr2Object(jsonStr, valueType));
        return writeValueAsString;
    }

    /**
     * json文件转成xml字符串
     * 
     * @param jsonFile
     * @param valueType
     * @return
     * @throws Exception
     */
    @SuppressWarnings({ "unchecked", "rawtypes" })
    public String jsonFile2xmlStr(File jsonFile, Class valueType) throws Exception {
        JacksonXmlModule module = new JacksonXmlModule();
        // 对集合属性是否包装一层
        module.setDefaultUseWrapper(true);
        ObjectMapper xmlMapper = new XmlMapper(module);
        xmlMapper.configure(SerializationFeature.INDENT_OUTPUT, INDENT_OUTPUT);
        String writeValueAsString = xmlMapper.writeValueAsString(jsonFile2Object(jsonFile, valueType));
        return writeValueAsString;
    }

    /**
     * 对象序列化json字符串
     * 
     * @param valueType
     *            resultFile
     * @return
     * @throws JsonProcessingException
     */
    public String object2jsonStr(Object valueType) throws JsonProcessingException {
        ObjectMapper objectMapper = getObjectMapper();
        return objectMapper.writeValueAsString(valueType);
    }

    /**
     * 对象序列化json文件
     * 
     * @param resultFile
     *            结果文件
     * @param valueType
     *            可以是普通对象或者HashMap
     * @throws Exception
     */
    public void object2jsonFile(File resultFile, Object valueType) throws Exception {
        ObjectMapper objectMapper = getObjectMapper();
        objectMapper.writeValue(resultFile, valueType);
    }

    /**
     * xml字符串转化成json字符串
     * 
     * @param xmlStr
     * @param valueType
     *            可以是普通对象或者HashMap
     * @return
     * @throws Exception
     */
    public String xmlStr2jsonStr(String xmlStr, Class<?> valueType) throws Exception {
        ObjectMapper xmlMapper = new XmlMapper();
        Object readValue = xmlMapper.readValue(xmlStr, valueType);
        return object2jsonStr(readValue);
    }

    /**
     * xml文件转化成json字符串
     * 
     * @param xmlFile
     *            xml文件
     * @param valueType
     *            可以是普通对象或者HashMap
     * @return
     * @throws Exception
     */
    public String xmlFile2jsonStr(File xmlFile, Class<?> valueType) throws Exception {
        ObjectMapper xmlMapper = new XmlMapper();
        Object readValue = xmlMapper.readValue(xmlFile, valueType);
        return object2jsonStr(readValue);
    }

    public String object2xmlStr(Object valueType) throws Exception {
        String object2jsonStr = object2jsonStr(valueType);
        return jsonStr2xmlStr(object2jsonStr, valueType.getClass());
    }

    public void setALLOW_SINGLE_QUOTES(boolean aLLOW_SINGLE_QUOTES) {
        ALLOW_SINGLE_QUOTES = aLLOW_SINGLE_QUOTES;
    }

    public void setFAIL_ON_UNKNOWN_PROPERTIES(boolean fAIL_ON_UNKNOWN_PROPERTIES) {
        FAIL_ON_UNKNOWN_PROPERTIES = fAIL_ON_UNKNOWN_PROPERTIES;
    }

    public void setSNAKE_CASE(boolean sNAKE_CASE) {
        SNAKE_CASE = sNAKE_CASE;
    }

    public void setINDENT_OUTPUT(boolean iNDENT_OUTPUT) {
        INDENT_OUTPUT = iNDENT_OUTPUT;
    }

    public void setDateFormat_pattern(String dateFormat_pattern) {
        DateFormat_pattern = dateFormat_pattern;
    }

    /**
     * 静态内部类，用以测试，说明问题
     * 
     * @author carl
     */
    @JacksonXmlRootElement(localName = "carl")
    static class Province {

        @JsonProperty("NAME")
        @JacksonXmlProperty(localName = "naME")
        private String name;

        public int popuLation;// 可以接受驼峰式popu_lation

        @JacksonXmlElementWrapper(localName = "citys")
        // city数组，转成xml用citys包装一层
        public String[] city;

        public Date creat_time;

        @Override
        public String toString() {
            return "province name:" + name + "\npopulation :" + popuLation + "\ncity:" + Arrays.deepToString(city)
                    + "\ncreatTime:" + creat_time;
        }
    }

    /**
     * 在对象序列化json时，对日期属性的特殊操作，这里是指定了日期格式 只需在属性或get方法上添加@JsonSerialize(using =
     * CustomDateSerializer.class)
     * 
     * @author carl
     */
    class CustomDateSerializer extends JsonSerializer<Date> {

        @Override
        public void serialize(Date value, JsonGenerator jgen, SerializerProvider provider)
                throws IOException, JsonProcessingException {
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
            String formattedDate = formatter.format(value);
            jgen.writeString(formattedDate);
        }
    }

    public static void main(String[] args) throws Exception {
        JsonUtil util = new JsonUtil();
        util.testJsonStr2Object();
        util.testObject2jsonStr();
        // util.testJsonStr2xmlStr();
        // util.testXmlStr2jsonStr();
    }

    public void testObject2xmlStr() throws Exception {
        Province province = new Province();
        // province.name = "Shanxi";
        province.popuLation = 37751200;
        province.city = new String[] { "邯郸", "邢台" };
        province.creat_time = new Date();
        System.out.println(object2xmlStr(province));
    }

    private void testJsonStr2Object() throws Exception {
        // String jsonStr =
        // "{\"name\" : \"hebei\",\"population\" : 55080000,\"city\" :
        // [\"邯郸\",\"邢台\"]}";
        String jsonStr =
                "{'NAME' : \"hebei\",'popu_lation' : 55080000,'city' : ['邯郸','邢台'],'creat_time' : '2016-09-25 12:25:35'}";
        Province jsonStr2Object = jsonStr2Object(jsonStr, Province.class);// 反序列到普通对象
        System.out.println(jsonStr2Object.toString());
    }

    private void testObject2jsonStr() throws JsonProcessingException {
        Province province = new Province();
        province.name = "Shanxi";
        province.popuLation = 37751200;
        province.city = new String[] { "邯郸", "邢台" };
        province.creat_time = new Date();
        System.out.println(object2jsonStr(province));
    }

    private void testJsonStr2xmlStr() throws Exception {
        String jsonStr = "{'NAME' : \"hebei\",'popu_lation' : 55080000,'city' : ['邯郸','邢台']}";
        System.out.println(jsonStr2xmlStr(jsonStr, HashMap.class));
        System.out.println(jsonStr2xmlStr(jsonStr, Province.class));
    }

    private void testXmlStr2jsonStr() throws Exception {
        String xmlStr = "<carl>" + "<popuLation>55080000</popuLation>" + "<citys>" + " <city>邯郸</city>"
                + "<city>邢台</city>" + "</citys>" + "<naME>hebei</naME>" + "</carl>";
        System.out.println(xmlStr2jsonStr(xmlStr, Province.class));
    }
}

package com.ixinnuo.financial.util.calendar;

import java.text.ParseException;
import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

/**
 * 日期转换工具类
 * 
 * @author zhaoTh
 */
public class CalendarUtil {

    private static final String DATE_WITH_SPLIT = "yyyy-MM-dd";

    private static final String DATE_WITHNOT_SPLIT = "yyyyMMdd";

    private static final String DATETIME_WITH_SPLIT = "yyyy-MM-dd HH:mm:ss";

    private static final String DATETIME_WITHNOT_SPLIT = "yyyyMMddHHmmss";

    /**
     * 将日期转换成字符串
     * 
     * @param dateTime
     *            日期
     * @param withSplit
     *            true返回yyyy-MM-dd HH:mm:ss||false返回yyyyMMddHHmmss
     * @return 日期字符串
     */
    public static String convertDateTimeToString(Date dateTime, boolean withSplit) {
        SimpleDateFormat dateFormat = null;
        if (withSplit) {
            dateFormat = new SimpleDateFormat(DATETIME_WITH_SPLIT);
        }
        else {
            dateFormat = new SimpleDateFormat(DATETIME_WITHNOT_SPLIT);
        }
        return dateFormat.format(dateTime);
    }

    /**
     * 将日期转换成字符串
     * 
     * @param date
     *            日期
     * @param withSplit
     *            true返回yyyy-MM-dd||false返回yyyyMMdd
     * @return 日期字符串
     */
    public static String convertDateToString(Date date, boolean withSplit) {
        SimpleDateFormat dateFormat = null;
        if (withSplit) {
            dateFormat = new SimpleDateFormat(DATE_WITH_SPLIT);
        }
        else {
            dateFormat = new SimpleDateFormat(DATE_WITHNOT_SPLIT);
        }
        return dateFormat.format(date);
    }

    /**
     * 把格式为(yyyy-MM-dd或yyyyMMdd)的字符串转换为Date型(不带时分秒)
     * 
     * @param date
     *            字符串日期
     * @return Date型日期(失败返回null)
     */
    public static Date convertStringToDate(String date) {
        int length = date.length();
        SimpleDateFormat dateFormat = null;
        if (8 == length || 10 == length) {
            if (10 == length) {
                dateFormat = new SimpleDateFormat(DATE_WITH_SPLIT);
            }
            else {
                dateFormat = new SimpleDateFormat(DATE_WITHNOT_SPLIT);
            }
            ParsePosition position = new ParsePosition(0);
            return dateFormat.parse(date, position);
        }
        else {
            if (19 == length || 14 == length) {
                return convertStringToDateTime(date);
            }
            else {
                return null;
            }
        }
    }
    /**
     * 把格式为(yyyy-MM-dd或yyyyMMdd)的字符串转换为Date型(不带时分秒)
     * 
     * @param date
     *            字符串日期
     * @return Date型日期(失败返回null)
     */
    public static Date convertStringToDate(String date,String pattern){
    	Date parse = null;
    	try {
			SimpleDateFormat dateFormat = new SimpleDateFormat(pattern);
			parse = dateFormat.parse(date);
		} catch (ParseException e) {
		}
		return parse;
    }

    /**
     * 把格式为(yyyy-MM-dd hh:mm:ss或yyyyMMddHHmmss)的字符串转换为DateTime型(带时分秒)
     * 
     * @param date
     *            字符串日期
     * @return DateTime型日期(失败返回null)
     */
    public static Date convertStringToDateTime(String date) {
        int length = date.length();
        SimpleDateFormat dateFormat = null;
        if (19 == length || 14 == length) {
            if (19 == length) {
                dateFormat = new SimpleDateFormat(DATETIME_WITH_SPLIT);
            }
            else {
                dateFormat = new SimpleDateFormat(DATETIME_WITHNOT_SPLIT);
            }
            ParsePosition position = new ParsePosition(0);
            return dateFormat.parse(date, position);
        }
        else {
            if (8 == length || 10 == length) {
                return convertStringToDate(date);
            }
            else {
                return null;
            }
        }
    }

    /**
     * 日期转换成字符串
     * @param date 日期
     * @param pattern 字符串格式
     * @return 指定格式的日期字符串
     */
    public static String convertDateToString(Date date,String pattern){
    	String format = "";
    	try {
    		SimpleDateFormat dateFormat = new SimpleDateFormat(pattern);
    		format = dateFormat.format(date);
    	} catch (Exception e) {
    		e.printStackTrace();
    		format = "";
    	}
    	return format;
    }
    
    
    /**
     * 取得当前时间（ yyyy-MM-dd 00:00:00）
     * 
     * @return Date
     */
    public static Date getCurrDate() {
        return convertStringToDate(convertDateToString(new Date(), true));
    }

    /**
     * 取得当前时间（ yyyy-MM-dd HH:mm:ss）
     * 
     * @return
     */
    public static Date getCurrDateTime() {
        return new Date();
    }

    /**
     * 日期比较大小
     * 
     * @param date1
     *            日期
     * @param date2
     *            日期
     * @param canEq
     *            是否可以相等
     * @return date1-date2:true(大于)||false(小于)
     * @throws ParseException
     */
    public static boolean dateCompare(Date date1, Date date2, boolean canEq) {
        boolean result = false;
        long time = 1000 * 3600 * 24;
        SimpleDateFormat dateFormat = new SimpleDateFormat(DATE_WITHNOT_SPLIT);
        Date firstDate = convertStringToDate(dateFormat.format(date1));
        Date lastDate = convertStringToDate(dateFormat.format(date2));
        long dateRange = (firstDate.getTime() - lastDate.getTime()) / time;
        if (canEq) {
            if (dateRange >= 0) {
                result = true;
            }
        }
        else {
            if (dateRange > 0) {
                result = true;
            }
        }
        return result;
    }

    /**
     * 判断是否为同一天
     * 
     * @param date1
     *            日期
     * @param date2
     *            日期
     * @return true||false
     */
    public static boolean sameDayCheck(Date date1, Date date2) {
        boolean result = false;
        SimpleDateFormat dateFormat = new SimpleDateFormat(DATE_WITHNOT_SPLIT);
        String dateFirst = dateFormat.format(date1);
        String dateLast = dateFormat.format(date2);
        if (dateFirst.equals(dateLast)) {
            result = true;
        }
        return result;
    }

    /**
     * 获取年份
     * 
     * @param date
     * @return
     */
    public static int getYear(Date date) {
        Calendar calendar = new GregorianCalendar();
        calendar.setTime(date);
        return calendar.get(Calendar.YEAR);
    }
    /**
     * 获取指定类型的值
     * @param date
     * @param field 如Calendar.YEAR
     * @return
     */
    public static int getValue(Date date,int field) {
    	Calendar calendar = new GregorianCalendar();
    	calendar.setTime(date);
    	return calendar.get(field);
    }

    /**
     * 获取天
     * 
     * @param date
     * @return
     */
    public static int getDay(Date date) {
        Calendar calendar = new GregorianCalendar();
        calendar.setTime(date);
        return calendar.get(Calendar.DATE);
    }

    /**
     * 年份加减N年
     * 
     * @param date
     * @param day
     * @return
     */
    public static Date yearAdd(Date date, int year) {
        Calendar calendar = new GregorianCalendar();
        calendar.setTime(date);
        calendar.add(Calendar.YEAR, year);
        date = calendar.getTime();
        return date;
    }

    /**
     * 日期加N天
     * 
     * @param date
     * @param day
     * @return
     */
    @SuppressWarnings("static-access")
    public static Date dateAdd(Date date, int day) {
        Calendar calendar = new GregorianCalendar();
        calendar.setTime(date);
        calendar.add(calendar.DATE, day);// 把日期往后增加一天.整数往后推,负数往前移动
        date = calendar.getTime(); // 这个时间就是日期往后推一天的结果
        return date;
    }
    
    /**
     * 日期加月
     * @param date
     * @param month
     * @return
     */
    @SuppressWarnings("static-access")
    public static Date monthAdd(Date date, int month) {
        Calendar calendar = new GregorianCalendar();
        calendar.setTime(date);
        calendar.add(calendar.MONTH, month);
        date = calendar.getTime();
        return date;
    }

    /**
     * 时间加N分钟
     * 
     * @param date
     * @param min
     * @return
     */
    @SuppressWarnings("static-access")
    public static Date minAdd(Date date, int min) {
        Calendar calendar = new GregorianCalendar();
        calendar.setTime(date);
        calendar.add(calendar.MINUTE, min);
        date = calendar.getTime();
        return date;
    }

    /**
     * 获取当前月份的第一天，格式为（ yyyy-MM-dd 00:00:00）
     * 
     * @return
     */
    public static Date getCurrentMonthFirstDay() {
        Calendar calendar = new GregorianCalendar();
        calendar.set(Calendar.DATE, 1);
        Date date = calendar.getTime();
        return convertStringToDate(convertDateToString(date, true));
    }

    /**
     * 获取当前月份的下一个月的第一天，格式为（ yyyy-MM-dd 00:00:00）
     * 
     * @return
     */
    public static Date getNextMonthFirstDay() {
        Calendar calendar = new GregorianCalendar();
        calendar.set(Calendar.DATE, 1);
        int month = calendar.get(Calendar.MONTH) + 1;
        if (month == 12) {
            // 处理跨年的情况
            calendar.set(Calendar.YEAR, calendar.get(Calendar.YEAR) + 1);
            calendar.set(Calendar.MONTH, 0);
        }
        else {
            calendar.set(Calendar.MONTH, month);
        }
        calendar.set(Calendar.DATE, 1);

        Date date = calendar.getTime();
        return convertStringToDate(convertDateToString(date, true));
    }

    /**
     * 取unix时间戳
     * 
     * @param date
     *            日期
     * @return Long
     */
    public static Long getUnixtime(Date date) {
        Date dateTime = convertStringToDateTime(convertDateTimeToString(date, true));
        Long unixTime = dateTime.getTime() / 1000;
        return unixTime;
    }

    /**
     * 取两个日期的间隔天数
     * 
     * @param beginDate
     * @param endDate
     * @return
     */
    public static int getDaySub(Date beginDate, Date endDate) {
        long diff = endDate.getTime() - beginDate.getTime();// 这样得到的差值是微秒级别
        int days = (int) (diff / (1000 * 60 * 60 * 24));
        return days;
    }

    public static Date[] getRecentThreeYear() {
        Calendar calendar = new GregorianCalendar();
        // 获取当前年份
        int year = calendar.get(Calendar.YEAR);
        // 当前年份12月31日
        calendar.set(year, 11, 31);

        Date data1 = calendar.getTime();

        // 三年前的1月1日
        calendar.set(year - 2, 0, 1);
        Date data2 = calendar.getTime();

        Date[] date = { data2, data1 };
        return date;

    }


    public static int[] getRecent3Year() {
        Calendar calendar = new GregorianCalendar();
        // 获取当前年份
        int year = calendar.get(Calendar.YEAR);

        int[] result = { year - 2, year };

        return result;
    }

    /**
     * 经营深度分析使用，获取今年部分+去年前年，两个完整年份的数据 例如2015年，返回201301
     * 
     * @return
     */
    public static int getRecent3YearMonth() {
        Calendar calendar = new GregorianCalendar();
        // 获取当前年份
        int year = calendar.get(Calendar.YEAR);

        return (year - 2) * 100 + 1;
    }

    public static int getCurrentYear() {
        Calendar calendar = new GregorianCalendar();

        return calendar.get(Calendar.YEAR);
    }

    public static int getCurrentMonth() {
        Calendar calendar = new GregorianCalendar();

        return calendar.get(Calendar.MONTH) + 1;
    }

    /**
     * 获取年月，形如201511
     * 
     * @return
     */
    public static int getCurrentYearAndMonth() {
        Calendar calendar = new GregorianCalendar();
        int year = calendar.get(Calendar.YEAR);
        int month = calendar.get(Calendar.MONTH) + 1;
        return Integer.valueOf(String.valueOf(year) + String.valueOf(month));
    }
    /**
     * 将字符串转成日期只截取前8位
     * 如:20160322   20160322990000000
     * @param str
     * @return
     */
    public static String getString2Date(String str){
    	if(str.length()>=8){
	    	String year=str.substring(0, 4);
	    	String month=str.substring(4, 6);
	    	String day=str.substring(6, 8);
	    	return year+"-"+month+"-"+day;
    	}
    	return null;
    }
    
    public static long getDateTime(String dateString) {
        SimpleDateFormat sdf = null; 
        sdf = new SimpleDateFormat("yyyy年MM月dd日");
        Date date = new Date();
        try {
            date = sdf.parse(dateString);
        }
        catch (ParseException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return date.getTime();
    }
    
    /**
     * 获取查询hbase的年月，需要当前月份+1：例如201602、201613
     * @return
     */
    public static String getYearAndMonth() {
        Calendar calendar = new GregorianCalendar();
        int year = calendar.get(Calendar.YEAR);
        int month = calendar.get(Calendar.MONTH) + 2;
        return year + (month < 10 ? "0"+month:month+"");
    }

    public static  String getLastMonthDayForYearAndMonth(){
    	
        Calendar calendar = new GregorianCalendar();
        int year = calendar.get(Calendar.YEAR);
        int month = calendar.get(Calendar.MONTH);
        String ny = year + (month < 10 ? "0"+month:month+"");
        return ny;
    }
    
    
    /**
     * 获取去年的第一天
     * 
     * @return
     */
    public static String getLastYearFirstMonth() {
        Calendar calendar = new GregorianCalendar();
        int year = calendar.get(Calendar.YEAR)-1;
        String yearandmonth = year+"01";
        return yearandmonth;
    }
    
    /**
     * 获取上一个月份，格式为yyyymm 
     * @return
     */
    public static String getLastMoth(){
    	Calendar calendar = new GregorianCalendar();
    	calendar.add(Calendar.MONTH, -1);
    	int year = calendar.get(Calendar.YEAR);
        int month = calendar.get(Calendar.MONTH) + 1;
        String ny = year + (month < 10 ? "0"+month:month+"");
    	return ny;
    }
    
  /**
   * 由出生日期获得年龄  
   * @param birthDay
   * @return
   * @throws Exception
   */
    public static int getAge(Date birthDay) throws Exception {  
        Calendar now = Calendar.getInstance();  
  
        if (now.before(birthDay)) {  
            throw new IllegalArgumentException(  
                    "The birthDay is after Now.It's unbelievable!");  
        }  
        int yearNow = now.get(Calendar.YEAR);  
        int monthNow = now.get(Calendar.MONTH);  
        int dayOfMonthNow = now.get(Calendar.DAY_OF_MONTH);  
        Calendar birth = Calendar.getInstance();  
        birth.setTime(birthDay);  
        int yearBirth = birth.get(Calendar.YEAR);  
        int monthBirth = birth.get(Calendar.MONTH);  
        int dayOfMonthBirth = birth.get(Calendar.DAY_OF_MONTH);  
  
        int age = yearNow - yearBirth;  
        //月份超过的还需要加一岁 
        if (monthNow >= monthBirth) {  
        	if (monthNow == monthBirth) {  
        		if (dayOfMonthNow >= dayOfMonthBirth) age++;  
        	}else{  
        		age++;  
        	}  
        } 
        return age;  
    } 
    
    
    public static void main(String[] args) {
        // 取当前日期(时分秒为00:00:00)
        Date tody = CalendarUtil.getCurrDate();
        // 取得前日期+1天
        Date afterProcessingTime = CalendarUtil.dateAdd(tody, 1);
        System.out.println(convertDateTimeToString(afterProcessingTime, true));

        System.out.println(tody);

        System.out.println(getLastYearFirstMonth());
        
        System.out.println(getLastMonthDayForYearAndMonth());
        System.out.println(getLastMoth());
        System.out.println(convertStringToDate("201712", "yyyyMM"));

    }
    
}

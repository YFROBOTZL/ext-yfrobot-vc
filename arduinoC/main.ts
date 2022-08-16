/** 
 * @file yfrobot
 * @brief YFROBOT's sensors Mind+ library.
 * @n This is a MindPlus graphics programming extension for YFROBOT's module.
 * 
 * @copyright    YFROBOT,2022
 * @copyright    MIT Lesser General Public License
 * 
 * @author [email](yfrobot@qq.com)
 * @date  2022-05-07
*/

enum RTCMODULE {
  //% block="PCF8563"
  PCF8563,
  //% block="DS1307"
  DS1307,
  //% block="DS3231"
  DS3231
}

enum RTCDATETIME {
    //% block="Year"
    year,
    //% block="Month"
    month,
    //% block="Day"
    day,
    //% block="Hour"
    hour,
    //% block="Minute"
    minute,
    //% block="Second"
    second,
    //% block="Day of the week"
    dayOfTheWeek
  }

//% color="#fecc11" iconWidth=40 iconHeight=40
namespace rtc {
  //% block="RTC [MODULE] initliallize" blockType="command"
  //% MODULE.shadow="dropdown" MODULE.options="RTCMODULE" MODULE.defl="RTCMODULE.PCF8563"
  export function init(parameter: any, block: any) {
    // let intpin = parameter.INTPIN.code;
    let module = parameter.MODULE.code;
    
    Generator.addInclude("includeRTClib", "#include \"RTClib.h\"");
    if (module === "PCF8563") {
        Generator.addObject("rtcObject", "RTC_PCF8563", `rtc`);
    } else if (module === "DS1307") {
        Generator.addObject("rtcObject", "RTC_DS1307", `rtc`);
    } else if (module === "DS3231") {
        Generator.addObject("rtcObject", "RTC_DS3231", `rtc`);
    }
    Generator.addSetup(`initSetup`, `if (! rtc.begin()) {\n    while (1) delay(10);\n  }`);
  }

  //% block="RTC set date and time this sketch was compiled" blockType="command"
  export function setDateTimeCompiled(parameter: any, block: any) {
    Generator.addCode("rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));");
  }

  //% block="RTC set date and time [YEAR]-[MONTH]-[DAY] [HOUR]:[MINUTE]:[SECOND]" blockType="command"
  //% YEAR.shadow="number" YEAR.defl="2022"
  //% MONTH.shadow="number" MONTH.defl="5"
  //% DAY.shadow="number" DAY.defl="7"
  //% HOUR.shadow="number" HOUR.defl="10"
  //% MINUTE.shadow="number" MINUTE.defl="20"
  //% SECOND.shadow="number" SECOND.defl="0"
  export function setDateTime(parameter: any, block: any) {
    let year = parameter.YEAR.code;
    let month = parameter.MONTH.code;
    let day = parameter.DAY.code;
    let hour = parameter.HOUR.code;
    let minute = parameter.MINUTE.code;
    let second = parameter.SECOND.code;
    
    Generator.addCode(`rtc.adjust(DateTime(${year}, ${month}, ${day}, ${hour}, ${minute}, ${second}));`);
  }

  //% block="RTC get date and time [DATETIME]" blockType="reporter"
  //% DATETIME.shadow="dropdown" DATETIME.options="RTCDATETIME" DATETIME.defl="RTCDATETIME.year"
  export function getDateTime(parameter: any, block: any) {
    let datetime = parameter.DATETIME.code;
    Generator.addCode(`rtc.now().${datetime}()`);
  }
}

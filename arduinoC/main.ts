/** 
 * @file yfrobot
 * @brief YFROBOT's sensors Mind+ library.
 * @n This is a MindPlus graphics programming extension for YFROBOT's module.
 * 
 * @copyright    YFROBOT,2022
 * @copyright    MIT Lesser General Public License
 * 
 * @author [email](yfrobot@qq.com)
 * @date  2022-08-17
*/

enum SERIAL {
    //% block="Hardware"
    Hardware,
    //% block="Software"
    Software
}

//% color="#fecc11" iconWidth=40 iconHeight=40
namespace vc {
  
  //% block="VC Hardware [SERIAL] recognize speech and receive data " blockType="reporter"
  //% SERIAL.shadow="dropdown" SERIAL.options="SER"
  export function vcSpeechRecognitionHardware(parameter: any, block: any) {
    let serial = parameter.SERIAL.code;

    Generator.addInclude("include_variable_inBuf", "uint8_t inBuf[5];  //数据数组");

    Generator.addInclude("include_HardwareSerial", `#define yfrobotSerial ${serial}`);
    
    Generator.addSetup(`vc_initSetup`, `yfrobotSerial.begin(115200);`);
    Generator.addInclude(`defineserialReceiveData`, `PROGMEM uint8_t serialReceiveData();`)
    Generator.addInclude(`defineserialReceiveDataFun`, ``+
        `uint8_t serialReceiveData() {\n`+
        `    int datalen = yfrobotSerial.available();\n`+
        `    if (datalen >= 5) { // 接收到一组数据\n`+
        `      while (datalen--) {\n`+
        `        inBuf[4 - datalen] = yfrobotSerial.read();\n`+
        `      }\n`+
        `      return inBuf[1];\n`+
        `    } else {\n`+
        `      return 0x01;  // 默认未接收到数据时，返回1\n`+
        `    }\n`+
        `}`
    );

    Generator.addCode('serialReceiveData()');
  }

    
  //% block="VC Software RX[rx]TX[tx] recognize speech and receive data " blockType="reporter"
  //% rx.shadow="dropdown" rx.options="SSRXD"
  //% tx.shadow="dropdown" tx.options="SSTXD"
  export function vcSpeechRecognitionSoftware(parameter: any, block: any) {
    let rxpin = parameter.rx.code;
    let txpin = parameter.tx.code;

    Generator.addInclude("include_variable_inBuf", "uint8_t inBuf[5];  //数据数组");

    Generator.addInclude("include_SoftwareSerial", `#include <SoftwareSerial.h>\n`+
        `SoftwareSerial mySerial(${rxpin}, ${txpin}); // RX, TX\n`+
        `#define yfrobotSerial mySerial\n`
    );
    

    Generator.addSetup(`vc_initSetup`, `yfrobotSerial.begin(115200);`);
    Generator.addInclude(`defineserialReceiveData`, `PROGMEM uint8_t serialReceiveData();`)
    Generator.addInclude(`defineserialReceiveDataFun`, ``+
        `uint8_t serialReceiveData() {\n`+
        `    int datalen = yfrobotSerial.available();\n`+
        `    if (datalen >= 5) { // 接收到一组数据\n`+
        `      while (datalen--) {\n`+
        `        inBuf[4 - datalen] = yfrobotSerial.read();\n`+
        `      }\n`+
        `      return inBuf[1];\n`+
        `    } else {\n`+
        `      return 0x01;  // 默认未接收到数据时，返回1\n`+
        `    }\n`+
        `}`
    );

    Generator.addCode('serialReceiveData()');

  }

}

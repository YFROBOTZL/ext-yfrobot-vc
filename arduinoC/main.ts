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

// esp32 MicroBit 软串口不支持 115200；后续产品统一更改为9600波特率
enum BAUDLIST {
    //% block="9600"
    9600,
    //% block="115200"
    115200
}


//% color="#ea8958" iconWidth=40 iconHeight=40
namespace vc {
    
  //% block="VC Software Baud[BAUD] RX[rx]TX[tx] recognize speech and receive data " blockType="reporter"
  //% BAUD.shadow="dropdown" BAUD.options="BAUDLIST" BAUD.defl="BAUDLIST.9600"
  //% rx.shadow="dropdown" rx.options="SSRXD"
  //% tx.shadow="dropdown" tx.options="SSTXD"
  export function vcSpeechRecognitionSoftware(parameter: any, block: any) {
    let baud = parameter.BAUD.code;
    let rxpin = parameter.rx.code;
    let txpin = parameter.tx.code;

    Generator.addInclude("include_SoftwareSerial", `#include <SoftwareSerial.h>\n`+
        `SoftwareSerial mySerial(${rxpin}, ${txpin}); // RX, TX\n`+
        `#define yfrobotSerial mySerial\n`
    );
    Generator.addSetup(`vc_initSetup`, `yfrobotSerial.begin(${baud});`);

    Generator.addInclude(`defineserialReceiveData`, `uint8_t serialReceiveData();`)
    Generator.addInclude(`defineserialReceiveDataFun`, ``+
        `uint8_t serialReceiveData() {\n`+
        `  uint8_t c;\n`+
        `  static uint8_t inBuf[3];   //数据数组\n`+         // static 必须有，在测试ESPONE 主板时，没有无法正常工作
        `  static uint8_t offset;\n`+
        `  static uint32_t checksum;\n`+
        `  static enum _serial_state { IDLE, HEADER_5A } c_state;\n\n`+
        `  while (yfrobotSerial.available()) {\n`+
        `    c = yfrobotSerial.read();     // 读串口缓冲区\n`+
        `    if (c_state == IDLE) {        // 串口状态空闲,等待 HEADER 5A 状态的到来\n`+
        `      if (c == 0x5A) {            // 判断是否进入 HEADER 5A\n`+
        `        checksum = c;             // 校验和 1  -  head\n`+
        `        c_state = HEADER_5A;      // 进入 HEADER_5A 状态\n`+
        `        offset = 0;\n`+
        `      } else  c_state = IDLE;     // 返回IDLE状态\n`+
        `    } else if (c_state == HEADER_5A && offset < 3) {\n`+
        `      checksum += c;              // 校验和 2  -  data\n`+
        `      inBuf[offset] = c;\n`+
        `      offset++;\n`+
        `    } else if (c_state == HEADER_5A && offset >= 3) {\n`+
        `      c_state = IDLE;             // 返回IDLE状态\n`+
        `      if ((checksum & 0xFF) == c) {\n`+
        `        return inBuf[0];          // 返回指令值\n`+
        `      }\n`+
        `    }\n`+
        `  }\n`+
        `  return 0x01;                    // 未接收数据，默认返回0x01\n`+
        `}`
    );

    Generator.addCode('serialReceiveData()');
  }
    
  //% block="VC Hardware Serial Baud[BAUD] recognize speech and receive data " blockType="reporter"
  //% BAUD.shadow="dropdown" BAUD.options="BAUDLIST" BAUD.defl="BAUDLIST.9600"
  export function vcSpeechRecognitionHardware(parameter: any, block: any) {
    let baud = parameter.BAUD.code;
    Generator.addInclude("include_HardwareSerial", `#define yfrobotSerial Serial`);
    
    Generator.addSetup(`vc_initSetup`, `yfrobotSerial.begin(${baud});`);
    Generator.addInclude(`defineserialReceiveData`, `uint8_t serialReceiveData();`)
    Generator.addInclude(`defineserialReceiveDataFun`, ``+
        `uint8_t serialReceiveData() {\n`+
        `  uint8_t c;\n`+
        `  static uint8_t inBuf[3];   //数据数组\n`+         // static 必须有，在测试ESPONE 主板时，没有无法正常工作
        `  static uint8_t offset;\n`+
        `  static uint32_t checksum;\n`+
        `  static enum _serial_state { IDLE, HEADER_5A } c_state;\n\n`+
        `  while (yfrobotSerial.available()) {\n`+
        `    c = yfrobotSerial.read();     // 读串口缓冲区\n`+
        `    if (c_state == IDLE) {        // 串口状态空闲,等待 HEADER 5A 状态的到来\n`+
        `      if (c == 0x5A) {            // 判断是否进入 HEADER 5A\n`+
        `        checksum = c;             // 校验和 1  -  head\n`+
        `        c_state = HEADER_5A;      // 进入 HEADER_5A 状态\n`+
        `        offset = 0;\n`+
        `      } else  c_state = IDLE;     // 返回IDLE状态\n`+
        `    } else if (c_state == HEADER_5A && offset < 3) {\n`+
        `      checksum += c;              // 校验和 2  -  data\n`+
        `      inBuf[offset] = c;\n`+
        `      offset++;\n`+
        `    } else if (c_state == HEADER_5A && offset >= 3) {\n`+
        `      c_state = IDLE;             // 返回IDLE状态\n`+
        `      if ((checksum & 0xFF) == c) {\n`+
        `        return inBuf[0];          // 返回指令值\n`+
        `      }\n`+
        `    }\n`+
        `  }\n`+
        `  return 0x01;                    // 未接收数据，默认返回0x01\n`+
        `}`
    );

    Generator.addCode('serialReceiveData()');
  }

}

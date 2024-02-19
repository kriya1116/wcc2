#include <WiFi.h>
#include <WiFiUdp.h>
#include <OSCMessage.h>
#include <Servo.h>

const char *ssid = "OnePlus 10 R";     // 你的网络SSID
const char *password = "nalini88";  // 你的网络密码

WiFiUDP Udp; // 创建UDP对象
const IPAddress outIp(192,168,227,44); // 目标设备的IP地址
const unsigned int outPort = 9000; // 目标设备的端口

void setup() {
  Serial.begin(115200); // 初始化串口通信，设置波特率为115200
  
  WiFi.begin(ssid, password); // 连接到WiFi网络
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi connected");
  Udp.begin(outPort); // 开始监听指定端口的UDP通信
}

void loop() {
  int sensorValue = analogRead(A0); // 读取模拟引脚的值

  // 创建OSC消息
  OSCMessage msg("/sensor/value");
  msg.add(sensorValue);
  //Serial.println(sensorValue);

  // 通过UDP发送OSC消息
  Udp.beginPacket(outIp, outPort);
  msg.send(Udp);
  Udp.endPacket();
  msg.empty(); // 清空消息内容，为下一条消息准备

  delay(100); // 等待100毫秒
}

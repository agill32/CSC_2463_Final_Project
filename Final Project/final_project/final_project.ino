const int ledPin = 11;
const int buttonUp = 2;
const int buttonDown = 3;
const int buttonRight = 4;
const int buttonLeft = 5;

int butUpStat = 0;
int butDownStat = 0;
int butRightStat = 0;
int butLeftStat = 0;
String rawVal = "";
int rawValInt = 0;

void setup() {
  Serial.begin(9600);
  delay(100);
  pinMode(ledPin, OUTPUT);
  pinMode(buttonUp, INPUT_PULLUP);
  pinMode(buttonDown, INPUT_PULLUP);
  pinMode(buttonRight, INPUT_PULLUP);
  pinMode(buttonLeft, INPUT_PULLUP);
}

void loop() {
  butUpStat = digitalRead(buttonUp);
  butDownStat = digitalRead(buttonDown);
  butRightStat = digitalRead(buttonRight);
  butLeftStat = digitalRead(buttonLeft);

  if (butUpStat == HIGH)
  {  Serial.println("W"); }
  delay(10);
  if (butDownStat == HIGH)
  {  Serial.println("S"); }
  delay(10);
  if (butRightStat == HIGH)
  {  Serial.println("D"); }
  delay(10);
  if (butLeftStat == HIGH)
  {  Serial.println("A"); }
  delay(10);

  byte brightness;
  if (Serial.available()) {
    if (Serial.read() != "\n")
      { rawVal = Serial.read();
        rawValInt = rawVal.toInt();
        brightness = map(rawValInt, 0, 60, 0, 255);
        analogWrite(ledPin, brightness);
      }
  }
  else 
  { analogWrite(ledPin, 0); }
}

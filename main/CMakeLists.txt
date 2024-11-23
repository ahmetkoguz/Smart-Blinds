idf_component_register(
  SRCS 
    "routes/pushBtn.c"
    "routes/helloWorld.c"
    "routes/magnetometer.c"
    "routes/servo.c"
    "routes/raise.c"
    "routes/pin.c"
    "routes/lower.c"
    "routes/setSchedule.c"
    "routes/doSchedule.c"
    "main.c"
  INCLUDE_DIRS 
    "."
    "routes"
  )

spiffs_create_partition_image(spiffs ../site/dist FLASH_IN_PROJECT)                    
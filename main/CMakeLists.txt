idf_component_register(
  SRCS 
    "routes/pushBtn.c"
    "routes/helloWorld.c"
    "routes/magnetometer.c"
    "routes/servo.c"
    "routes/raise.c"
    "routes/lower.c"
    "routes/stop.c"
    "routes/setSchedule.c"
    "main.c"
  INCLUDE_DIRS 
    "."
    "routes"
  )

spiffs_create_partition_image(spiffs ../site/dist FLASH_IN_PROJECT)                    
#ifndef ROUTES_H
#define ROUTES_H

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include "cJSON.h"
#include "esp_log.h"
#include "esp_http_server.h"
#include "../app.h"

/******************** Init Functions ****************/
void init_btn(void);
void init_servo(void);
void init_lower(void);
void init_stop(void);
void init_raise(void);
void init_nvs(void);
void adc_init_lower(void);

/******************** Interrupt Setup Functions ****************/
void init_reed_sensor_interrupt_raise(void);

/******************** Timer Setup Functions ****************/
void setup_adc_timer_lower(void);

/******************** HTTP Callbacks ****************/
esp_err_t on_raise(httpd_req_t *req);
esp_err_t on_lower(httpd_req_t *req);
esp_err_t on_set_schedule(httpd_req_t *req);
esp_err_t on_hello_world(httpd_req_t *req);
esp_err_t on_magnetometer(httpd_req_t *req);
esp_err_t on_web_socket_btn_push_url(httpd_req_t *req);
esp_err_t on_servo_url(httpd_req_t *req);
esp_err_t on_pin_handle(httpd_req_t *req);

/******************** Toggle Functions ****************/
void toggle_lower(bool is_on);
void toggle_raise(bool is_on);

/******************** Utility Functions ****************/
char* read_string_from_nvs(const char* key);
void write_string_to_nvs(const char* key, const char* value);
void schedule_handler();
void setSystemTime(char* curr_time);

#endif // ROUTES_H

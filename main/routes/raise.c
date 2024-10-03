#include "_routes.h"
#include "driver/gpio.h"

#define RAISE_PIN 23

void init_raise(void)
{
  esp_rom_gpio_pad_select_gpio(RAISE_PIN);
  gpio_set_direction(RAISE_PIN, GPIO_MODE_OUTPUT);
}

void toggle_raise(bool is_on)
{
  gpio_set_level(RAISE_PIN, is_on);
}

esp_err_t on_raise(httpd_req_t *req)
{
  char buffer[100];
  memset(&buffer, 0, sizeof(buffer));
  httpd_req_recv(req, buffer, req->content_len);
  printf("got here %s\n", buffer);
  cJSON *payload = cJSON_Parse(buffer);
  cJSON *is_on_json = cJSON_GetObjectItem(payload, "is_on");
  bool is_on = cJSON_IsTrue(is_on_json);
  cJSON_Delete(payload);
  toggle_raise(is_on);
  httpd_resp_set_status(req, "204 NO CONTENT");
  httpd_resp_send(req, NULL, 0);
  return ESP_OK;
}
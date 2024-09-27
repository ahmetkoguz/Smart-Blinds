#include "_routes.h"
#include "driver/gpio.h"

#define LOWER_PIN 22

void init_lower(void)
{
  esp_rom_gpio_pad_select_gpio(LOWER_PIN);
  gpio_set_direction(LOWER_PIN, GPIO_MODE_OUTPUT);
}

void toggle_lower(bool is_on)
{
  // gpio_set_level(LOWER_PIN, is_on);
  gpio_set_level(LOWER_PIN, true);
}

esp_err_t on_lower(httpd_req_t *req)
{
  char buffer[100];
  memset(&buffer, 0, sizeof(buffer));
  httpd_req_recv(req, buffer, req->content_len);
  printf("got here %s\n", buffer);
  cJSON *payload = cJSON_Parse(buffer);
  cJSON *is_on_json = cJSON_GetObjectItem(payload, "is_on");
  bool is_on = cJSON_IsTrue(is_on_json);
  cJSON_Delete(payload);
  toggle_lower(is_on);
  httpd_resp_set_status(req, "204 NO CONTENT");
  httpd_resp_send(req, NULL, 0);
  return ESP_OK;
}
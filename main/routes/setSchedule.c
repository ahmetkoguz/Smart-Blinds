#include "_routes.h"
#include "driver/gpio.h"
#include "esp_log.h"

static const char *TAG = "SERVER";

esp_err_t on_set_schedule(httpd_req_t *req)
{
  char buffer[100];
  memset(&buffer, 0, sizeof(buffer));
  httpd_req_recv(req, buffer, req->content_len);
  printf("got here %s\n", buffer);
  cJSON *payload = cJSON_Parse(buffer);

  cJSON *lower_json = cJSON_GetObjectItem(payload, "lower");
  char* lowerTime  = lower_json->valuestring;
  ESP_LOGI(TAG, "Lower: %s", lowerTime);

  cJSON *raise_json = cJSON_GetObjectItem(payload, "raise");
  char* raiseTime  = raise_json->valuestring;
  ESP_LOGI(TAG, "Raise: %s", raiseTime);

  cJSON *weekdays_json = cJSON_GetObjectItem(payload, "weekdays");
  cJSON_Print(weekdays_json);
  // char* weekdays  = weekdays_json->valuestring;

  cJSON_Delete(payload);
  httpd_resp_set_status(req, "204 NO CONTENT");
  httpd_resp_send(req, NULL, 0);
  return ESP_OK;
}
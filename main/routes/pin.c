#include "_routes.h"
#include "driver/gpio.h"
#include "esp_log.h"
#include "nvs_flash.h"
#include "nvs.h"
#include <inttypes.h>

static const char *TAG = "SERVER";

esp_err_t on_pin_handle(httpd_req_t *req) {
  cJSON *payload = NULL;

  if (req->method == HTTP_GET) {
    printf("pin method: %d\n", req->method);
    printf("pin get seen\n");
    payload = cJSON_CreateObject();

    // Read schedule info from non-volatile storage (nvs)
    char* pin = read_string_from_nvs("pin");

    // Add schedule to http response payload
    cJSON_AddStringToObject(payload, "pin", pin);

    if(payload == NULL) {
      httpd_resp_set_status(req, "204 NO CONTENT");
      httpd_resp_send(req, NULL, 0);
    }
    else { // If payload is not empty, send response
      char* data = cJSON_Print(payload);
      printf("payload found: %s\n", data);
      httpd_resp_send(req, data, strlen(data));
      return ESP_OK; // Set request status to successful
    }
  }
  else { // POST
    char buffer[100];
    memset(&buffer, 0, sizeof(buffer));
    printf("pin req content len: %d\n", req->content_len);
    httpd_req_recv(req, buffer, req->content_len);

    payload = cJSON_Parse(buffer);

    cJSON *pin_json = cJSON_GetObjectItem(payload, "pin");
    // char* pin  = cJSON_Print(pin_json);
    char* pin  = pin_json->valuestring;
    printf("pin: %s\n", pin);
    write_string_to_nvs("pin", pin);

    cJSON_Delete(payload);
    httpd_resp_set_status(req, "204 NO CONTENT");
    httpd_resp_send(req, NULL, 0);
  }
  return ESP_OK;
}
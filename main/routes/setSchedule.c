#include "_routes.h"
#include "driver/gpio.h"
#include "esp_log.h"
#include "nvs_flash.h"
#include "nvs.h"
#include <inttypes.h>

static const char *TAG = "SERVER";

void init_nvs(void) {
  // Initialize NVS
  esp_err_t err = nvs_flash_init();
  if (err == ESP_ERR_NVS_NO_FREE_PAGES || err == ESP_ERR_NVS_NEW_VERSION_FOUND) {
      // NVS partition was truncated and needs to be erased
      // Retry nvs_flash_init
      ESP_ERROR_CHECK(nvs_flash_erase());
      err = nvs_flash_init();
  }
  ESP_ERROR_CHECK( err );
}

void write_string_to_nvs(const char* key, const char* value) {
    nvs_handle_t my_handle;
    esp_err_t err;

    // Open NVS storage
    err = nvs_open("storage", NVS_READWRITE, &my_handle);
    if (err != ESP_OK) {
        ESP_LOGE(TAG, "Error opening NVS!");
        return;
    }

    // Write the string to NVS
    err = nvs_set_str(my_handle, key, value);
    if (err != ESP_OK) {
        ESP_LOGE(TAG, "Failed to write string %s to NVS!", key);
    } else {
        ESP_LOGI(TAG, "String %s written to %s in NVS", value, key);
    }

    // Commit the changes
    err = nvs_commit(my_handle);
    if (err != ESP_OK) {
        ESP_LOGE(TAG, "Failed to commit NVS!");
    }

    // Close NVS
    nvs_close(my_handle);
}

// Function to read string from NVS
char* read_string_from_nvs(const char* key) {
    nvs_handle_t my_handle;
    esp_err_t err;

    // Open NVS storage
    err = nvs_open("storage", NVS_READONLY, &my_handle);
    if (err != ESP_OK) {
        ESP_LOGE(TAG, "Error opening NVS!");
        return NULL;
    }

    // Read the string from NVS
    size_t required_size = 0;  // To get the size of the stored string
    err = nvs_get_str(my_handle, key, NULL, &required_size);
    if (err == ESP_OK) {
        char* value = malloc(required_size);
        err = nvs_get_str(my_handle, key, value, &required_size);
        if (err == ESP_OK) {
            ESP_LOGI(TAG, "String read from NVS: %s", value);
            return value;
        } else {
            ESP_LOGE(TAG, "Error reading string from NVS!");
        }
        free(value);
    } else if (err == ESP_ERR_NVS_NOT_FOUND) {
        ESP_LOGE(TAG, "The value is not found in NVS!");
    } else {
        ESP_LOGE(TAG, "Error reading size!");
    }

    // Close NVS
    nvs_close(my_handle);
    return NULL;
}

// Schedule backend endpoint
esp_err_t on_set_schedule(httpd_req_t *req)
{
  cJSON *payload = NULL;

  if (req->method == HTTP_GET) {
    printf("method: %d\n", req->method);
    printf("get seen\n");
    payload = cJSON_CreateObject();

    // Read schedule info from non-volatile storage (nvs)
    char* lowerTime = read_string_from_nvs("lower");
    char* raiseTime = read_string_from_nvs("raise");
    char* weekdays = read_string_from_nvs("weekdays");

    // Add schedule to http response payload
    cJSON_AddStringToObject(payload, "lower", lowerTime);
    cJSON_AddStringToObject(payload, "raise", raiseTime);
    cJSON_AddStringToObject(payload, "weekdays", weekdays);

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
    // printf("req content len: %d\n", req->content_len);
    httpd_req_recv(req, buffer, req->content_len);
    printf("set schedule got here %s\n", buffer);

    payload = cJSON_Parse(buffer);
    cJSON *lower_json = cJSON_GetObjectItem(payload, "lower");
    char* lowerTime  = lower_json->valuestring;
    ESP_LOGI(TAG, "Lower: %s", lowerTime);
    write_string_to_nvs("lower", lowerTime);

    cJSON *raise_json = cJSON_GetObjectItem(payload, "raise");
    char* raiseTime  = raise_json->valuestring;
    ESP_LOGI(TAG, "Raise: %s", raiseTime);
    write_string_to_nvs("raise", raiseTime);

    cJSON *weekdays_json = cJSON_GetObjectItem(payload, "weekdays");
    char* weekdays  = weekdays_json->valuestring;
    ESP_LOGI(TAG, "Weekdays: %s", weekdays);
    write_string_to_nvs("weekdays", weekdays);

    cJSON_Delete(payload);
    httpd_resp_set_status(req, "204 NO CONTENT");
    httpd_resp_send(req, NULL, 0);
  }
  return ESP_OK;
}
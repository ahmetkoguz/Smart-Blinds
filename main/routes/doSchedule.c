#include <stdio.h>
#include <string.h>
#include <time.h>
#include "nvs_flash.h"
#include "nvs.h"
#include "esp_log.h"
#include "_routes.h"
#include "freertos/task.h"
#include "freertos/FreeRTOS-Kernel.h"

// Declarations for the functions from raise.c and lower.c
void check_and_perform_scheduled_actions() {
    // Read time from NVS
    char* lowerTime = read_string_from_nvs("lower");
    char* raiseTime = read_string_from_nvs("raise");
    char* weekdays = read_string_from_nvs("weekdays");

    // Check for NULL pointers
    if (lowerTime == NULL || raiseTime == NULL || weekdays == NULL) {
        printf("Failed to read scheduled times from NVS");
        return;
    }

    // Assuming time is stored in "HH:MM" format
    time_t now;
    struct tm timeinfo;
    char current_time[6];

    // Get current time
    time(&now);
    localtime_r(&now, &timeinfo);
    strftime(current_time, sizeof(current_time), "%H:%M", &timeinfo);

    // Get current weekday (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    int current_weekday = timeinfo.tm_wday;

    // Check if today is one of the scheduled weekdays
    if (weekdays[current_weekday] == '1') {
        // Check if it's time to raise the blinds
        if (strcmp(current_time, raiseTime) == 0) {
            printf("Raising blinds at scheduled time: %s", raiseTime);
            toggle_raise(1);
        }
        // Check if it's time to lower the blinds
        if (strcmp(current_time, lowerTime) == 0) {
            printf("Lowering blinds at scheduled time: %s", lowerTime);
            toggle_lower(1);
        }
    }
}

void app_main() {
    // Initialize NVS
    esp_err_t ret = nvs_flash_init();
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND) {
        ESP_ERROR_CHECK(nvs_flash_erase());
        ret = nvs_flash_init();
    }
    ESP_ERROR_CHECK(ret);

    // Example scheduler loop   
    while (1) {
        check_and_perform_scheduled_actions();
        vTaskDelay(pdMS_TO_TICKS(60000)); // Check every minute
    }
}

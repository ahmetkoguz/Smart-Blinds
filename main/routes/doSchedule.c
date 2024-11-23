#include <stdio.h>
#include <string.h>
#include <time.h>
#include "nvs_flash.h"
#include "nvs.h"
#include "esp_log.h"
#include "_routes.h"
#include "freertos/task.h"
#include "esp_sleep.h"

static const char *TAG = "SERVER";

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

    time(&now);
    localtime_r(&now, &timeinfo);
    // Is time set? If not, tm_year will be (1970 - 1900).
    if (timeinfo.tm_year < (2016 - 1900)) {
        // ESP_LOGI(TAG, "Time is not set yet. Connecting to WiFi and getting time over NTP.");
        obtain_time();
        // update 'now' variable with current time
        time(&now);
    }

    strftime(current_time, sizeof(current_time), "%H:%M", &now);

    // Get current weekday (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    int current_weekday = timeinfo.tm_wday;

    printf("Current weekday: %d, current time: %s\n", current_weekday, current_time);

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

void schedule_handler() {
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
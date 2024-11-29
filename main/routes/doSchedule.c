#include <stdio.h>
#include <string.h>
#include <time.h>
#include "nvs_flash.h"
#include "nvs.h"
#include "esp_log.h"
#include "_routes.h"
#include "freertos/task.h"
#include "esp_sleep.h"
#include <sys/time.h>

// Declarations for the functions from raise.c and lower.c
void check_and_perform_scheduled_actions() {
    // Read time from NVS
    char* lowerTime = read_string_from_nvs("lower");
    char* raiseTime = read_string_from_nvs("raise");
    char* weekdays = read_string_from_nvs("weekdays");
    // char* curr_time = read_string_from_nvs("curr_time");

    // Check for NULL pointers
    if (lowerTime == NULL || raiseTime == NULL || weekdays == NULL) {
        printf("Failed to read scheduled times from NVS");
        return;
    }

    time_t now;
    struct tm time_info;

    time(&now); // Get current system time
    localtime_r(&now, &time_info); // Convert time_t to struct tm for easier handling

    char time_str[6];  // hh:mm requires 6 bytes (including null terminator)
    char day_str[10];  // Weekday name requires up to 10 bytes (e.g., "Wednesday")

    strftime(time_str, sizeof(time_str), "%H:%M", &time_info);
    strftime(day_str, sizeof(day_str), "%A", &time_info);

    printf("Current weekday and time: %s %s\n", day_str, time_str);

    // Check if today is one of the scheduled weekdays (problem if both at same time?)
    if (strstr(weekdays, day_str)) {
        // Check if it's time to raise the blinds
        if (strcmp(time_str, raiseTime) == 0) {
            printf("Raising blinds at scheduled time: %s\n", raiseTime);
            toggle_raise(1);
        }
        // Check if it's time to lower the blinds
        if (strcmp(time_str, lowerTime) == 0) {
            printf("Lowering blinds at scheduled time: %s\n", lowerTime);
            toggle_lower(1);
        }
    }
}

void schedule_handler() {
    // Scheduler loop   
    while (1) {
        check_and_perform_scheduled_actions();
        vTaskDelay(pdMS_TO_TICKS(60000)); // Check every minute
    }
}
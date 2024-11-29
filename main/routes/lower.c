#include "_routes.h"
#include "driver/gpio.h"
#include "driver/adc.h"
#include "esp_timer.h"

#define LOWER_PIN 5
#define LOWER_ADC_THRESHOLD 4095  
#define LOWER_MOTOR_COUNT 5

typedef struct {
    int count;
    int prev_adc;
} info_struct;

void adc_init_lower(void)
{
    // Configure ADC width
    adc1_config_width(ADC_WIDTH_BIT_12);

    // Configure ADe channel for the raise/lower operation 
    adc1_config_channel_atten(ADC1_CHANNEL_0, ADC_ATTEN_DB_12);  // Sensor PIN VP
}

// Timer callback function for checking ADC values for the lower motor
void check_adc_lower(void *arg) {
    info_struct* info = (info_struct*)arg;

    int adc_value = adc1_get_raw(ADC1_CHANNEL_0);  // Read MOSFET ADC value
    // printf("ADC value: %d\n", adc_value);
    // printf("Count: %d, Prev: %d\n", info -> count, info -> prev_adc);

    if (adc_value >= LOWER_ADC_THRESHOLD && info -> prev_adc == 0) {
        // ADC threshold exceeded, stop the lower motor
        if(info -> count > LOWER_MOTOR_COUNT) {
            gpio_set_level(LOWER_PIN, 0);
            // printf("Lower motor ADC threshold exceeded. Stopping motor. ADC value: %d\n", adc_value);
        }

        printf("Lower detected sensor, new count %d\n", info -> count);
        info -> count += 1;
    }

    info -> prev_adc = adc_value;
}

// Function to set up the periodic timer for ADC checks
void setup_adc_timer_lower() {
    info_struct* info = malloc(sizeof(info_struct));
    info -> count = 0;
    info -> prev_adc = 0;

    const esp_timer_create_args_t periodic_timer_args = {
        .callback = &check_adc_lower,
        .name = "periodic_adc_timer_lower",
        .arg = info
    };

    esp_timer_handle_t periodic_timer;
    ESP_ERROR_CHECK(esp_timer_create(&periodic_timer_args, &periodic_timer));

    // Start the timer with a period of 100ms (100,000 microseconds)
    ESP_ERROR_CHECK(esp_timer_start_periodic(periodic_timer, 100000));
}

// Initialization function for the lower motor control
void init_lower(void) {
    esp_rom_gpio_pad_select_gpio(LOWER_PIN);
    gpio_set_direction(LOWER_PIN, GPIO_MODE_OUTPUT);

    adc_init_lower();  // Initialize the ADC
}

void toggle_lower(bool is_on) {
    if (is_on) {
        gpio_set_level(LOWER_PIN, 1);
    } 
    else {
        // If is_on is false, stop the motor
        gpio_set_level(LOWER_PIN, 0);
    }
}

esp_err_t on_lower(httpd_req_t *req) {
    char buffer[100];
    memset(&buffer, 0, sizeof(buffer));
    httpd_req_recv(req, buffer, req->content_len);
    printf("lower got here %s\n", buffer);
    cJSON *payload = cJSON_Parse(buffer);
    cJSON *is_on_json = cJSON_GetObjectItem(payload, "is_on");
    bool is_on = cJSON_IsTrue(is_on_json);
    cJSON_Delete(payload);
    // Set up the periodic timer for ADC checks
    setup_adc_timer_lower();
    toggle_lower(is_on);
    httpd_resp_set_status(req, "204 NO CONTENT");
    httpd_resp_send(req, NULL, 0);
    return ESP_OK;
}

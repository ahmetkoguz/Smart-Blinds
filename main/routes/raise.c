#include "_routes.h"
#include "driver/gpio.h"
#include "driver/adc.h"
#include "esp_timer.h"

#define RAISE_PIN 18
#define REED_PIN 21

// Interrupt Service Routine (ISR) for the reed sensor
void IRAM_ATTR reed_sensor_isr_handler_raise(void* arg) {
    // Reed sensor triggered, stop the raise motor immediately
    gpio_set_level(RAISE_PIN, 0); // Adding printf here breaks, need to keep isr very minimal
}

// Function to set up the reed sensor interrupt
void init_reed_sensor_interrupt_raise() {
    gpio_config_t io_conf = {
        .intr_type = GPIO_INTR_NEGEDGE,  // Trigger on falling edge
        .mode = GPIO_MODE_INPUT,
        .pin_bit_mask = (1ULL << REED_PIN),  // Pin mask for reed sensor
        .pull_down_en = GPIO_PULLDOWN_ENABLE,
        .pull_up_en = GPIO_PULLUP_DISABLE
    };
    gpio_config(&io_conf);

    // Install GPIO ISR handler service
    gpio_install_isr_service(0);

    // Attach the interrupt handler
    gpio_isr_handler_add(REED_PIN, reed_sensor_isr_handler_raise, NULL);
}

// Initialization function for the raise motor control
void init_raise(void) {
    esp_rom_gpio_pad_select_gpio(RAISE_PIN);
    gpio_set_direction(RAISE_PIN, GPIO_MODE_OUTPUT);

    // Initialize reed sensor interrupt
    init_reed_sensor_interrupt_raise();
}

void toggle_raise(bool is_on) {
    if (is_on) {
        int reed_sensor_state = gpio_get_level(REED_PIN); // Check reed sensor state

        // Check if ADC value is below the threshold and reed sensor is not triggered
        if (reed_sensor_state == 0) {
            // If below the threshold and reed sensor not triggered, allow the motor to raise
            gpio_set_level(RAISE_PIN, 1);
        } 
        else {
            // If reed sensor triggered, stop the motor
            printf("Raise reed detected\n");
            gpio_set_level(RAISE_PIN, 0);
        }
    } 
    else {
        // If is_on is false, stop the motor
        gpio_set_level(RAISE_PIN, 0);
    }
}

esp_err_t on_raise(httpd_req_t *req) {
    char buffer[100];
    memset(&buffer, 0, sizeof(buffer));
    httpd_req_recv(req, buffer, req->content_len);
    printf("raise got here %s\n", buffer);
    cJSON *payload = cJSON_Parse(buffer);
    cJSON *is_on_json = cJSON_GetObjectItem(payload, "is_on");
    bool is_on = cJSON_IsTrue(is_on_json);
    cJSON_Delete(payload);
    toggle_raise(is_on);
    httpd_resp_set_status(req, "204 NO CONTENT");
    httpd_resp_send(req, NULL, 0);
    return ESP_OK;
}
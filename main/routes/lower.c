#include "_routes.h"
#include "driver/gpio.h"
#include "driver/adc.h"
#include "esp_timer.h"

#define LOWER_PIN 22
#define REED_PIN 21
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
    adc1_config_channel_atten(ADC1_CHANNEL_0, ADC_ATTEN_DB_12); 
}

// Interrupt Service Routine (ISR) for the reed sensor
void IRAM_ATTR reed_sensor_isr_handler_lower(void* arg) {
    // Reed sensor triggered, stop the lower motor immediately
    gpio_set_level(LOWER_PIN, 0);
    printf("Reed sensor triggered! Stopping lower motor.\n");
}

// Function to set up the reed sensor interrupt
void init_reed_sensor_interrupt_lower() {
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
    gpio_isr_handler_add(REED_PIN, reed_sensor_isr_handler_lower, (void*) REED_PIN);
}

// Timer callback function for checking ADC values for the lower motor
void check_adc_lower(void *arg) {
    info_struct* info = (info_struct*)arg;

    int adc_value = adc1_get_raw(ADC1_CHANNEL_0);  // Read MOSFET ADC value
    printf("ADC value: %d\n", adc_value);
    printf("Count: %d, Prev: %d\n", info -> count, info -> prev_adc);

    if (adc_value >= LOWER_ADC_THRESHOLD && info -> prev_adc == 0) {
        // ADC threshold exceeded, stop the lower motor
        if(info -> count > LOWER_MOTOR_COUNT) {
            gpio_set_level(LOWER_PIN, 0);
            printf("Lower motor ADC threshold exceeded. Stopping motor. ADC value: %d\n", adc_value);
        }

        info -> count += 1;
    }

    info -> prev_adc = adc_value;
}

// Function to set up the periodic timer for ADC checks
void setup_adc_timer_lower() {
    info_struct info;
    info.count = 0;
    info.prev_adc = 0;

    const esp_timer_create_args_t periodic_timer_args = {
        .callback = &check_adc_lower,
        .name = "periodic_adc_timer_lower",
        .arg = &info
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

    // Initialize reed sensor interrupt
    init_reed_sensor_interrupt_lower();

    // Set up the periodic timer for ADC checks
    setup_adc_timer_lower();
}

void toggle_lower(bool is_on) {
    if (is_on) {
        // Read ADC value
        int adc_value = adc1_get_raw(ADC1_CHANNEL_0); 
        int reed_sensor_state = gpio_get_level(REED_PIN); // Check reed sensor state

        printf("reed: %d, adc_val: %d\n", reed_sensor_state, adc_value);

        // Check if ADC value is below the threshold and reed sensor is not triggered
        if (adc_value < LOWER_ADC_THRESHOLD && reed_sensor_state == 0) {
            // If below the threshold and reed sensor not triggered, allow the motor to lower
            gpio_set_level(LOWER_PIN, 1);
        } 
        else {
            // If threshold reached or reed sensor triggered, stop the motor
            printf("Lower ADC limit reached: %d\n", adc_value);
            gpio_set_level(LOWER_PIN, 0);
        }
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

#include "_routes.h"
#include "driver/gpio.h"
#include "driver/adc.h"
#include "esp_timer.h"

#define RAISE_PIN 23
#define REED_PIN 21
#define RAISE_ADC_THRESHOLD 4095  
#define RAISE_MOTOR_COUNT 5
#define BUTTON_PIN 19

typedef struct {
    int count;
    int prev_adc;
} info_struct;

void init_button(void) {
    gpio_config_t io_conf = {
        .intr_type = GPIO_INTR_NEGEDGE,  // Interrupt on falling edge (button press)
        .mode = GPIO_MODE_INPUT,
        .pin_bit_mask = (1ULL << BUTTON_PIN),
        .pull_down_en = GPIO_PULLDOWN_DISABLE,
        .pull_up_en = GPIO_PULLUP_ENABLE  // Enable internal pull-up resistor
    };
    gpio_config(&io_conf);

    // Attach the button interrupt handler
    gpio_isr_handler_add(BUTTON_PIN, button_isr_handler, NULL);
}

void adc_init_raise(void)
{
    // Configure ADC width
    adc1_config_width(ADC_WIDTH_BIT_12);

    // Configure ADC channel for the raise/lower operation 
    adc1_config_channel_atten(ADC1_CHANNEL_0, ADC_ATTEN_DB_12); // Set attenuation for GPIO36
}

// Interrupt Service Routine (ISR) for the reed sensor
void IRAM_ATTR reed_sensor_isr_handler_raise(void* arg) {
    // Reed sensor triggered, stop the raise motor immediately
    gpio_set_level(RAISE_PIN, 0);
    printf("Reed sensor triggered! Stopping raise motor.\n");
}

volatile bool button_pressed = false;

void IRAM_ATTR button_isr_handler(void* arg) {
    // Debounce the button if necessary
    static uint32_t last_isr_time = 0;
    uint32_t isr_time = xTaskGetTickCountFromISR();
    if (isr_time - last_isr_time > pdMS_TO_TICKS(200)) {
        button_pressed = true;
        last_isr_time = isr_time;
    }
}

void handle_button_press(void) {
    if (button_pressed) {
        button_pressed = false;  // Clear the flag

        printf("Button pressed! Raising blinds to the top.\n");

        // Start the raise action
        toggle_raise(true);

        // The blinds will raise until the top reed sensor is triggered
        // The existing reed sensor ISR will handle stopping the motor
    }
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
    gpio_isr_handler_add(REED_PIN, reed_sensor_isr_handler_raise, (void*) REED_PIN);
}

// Timer callback function for checking ADC values for the raise motor
void check_adc_raise(void *arg) {
    // info_struct* info = (info_struct*)arg;

    // int adc_value = adc1_get_raw(ADC1_CHANNEL_0);  // Read MOSFET ADC value
    // // printf("ADC value: %d\n", adc_value);
    // // printf("Count: %d, Prev: %d\n", info -> count, info -> prev_adc);

    // if (adc_value >= RAISE_ADC_THRESHOLD && info -> prev_adc == 0) {
    //     // ADC threshold exceeded, stop the lower motor
    //     if(info -> count > RAISE_MOTOR_COUNT) {
    //         gpio_set_level(RAISE_PIN, 0);
    //         // printf("Lower motor ADC threshold exceeded. Stopping motor. ADC value: %d\n", adc_value);
    //     }

    //     info -> count += 1;
    // }

    // info -> prev_adc = adc_value;
}

// Function to set up the periodic timer for ADC checks
void setup_adc_timer_raise() {
    info_struct info;
    info.count = 0;
    info.prev_adc = 0;

    const esp_timer_create_args_t periodic_timer_args = {
        .callback = &check_adc_raise,
        .name = "periodic_adc_timer_raise",
        .arg = &info
    };

    esp_timer_handle_t periodic_timer;
    ESP_ERROR_CHECK(esp_timer_create(&periodic_timer_args, &periodic_timer));

    // Start the timer with a period of 100ms (100,000 microseconds)
    ESP_ERROR_CHECK(esp_timer_start_periodic(periodic_timer, 100000));
}

// Initialization function for the raise motor control
void init_raise(void) {
    esp_rom_gpio_pad_select_gpio(RAISE_PIN);
    gpio_set_direction(RAISE_PIN, GPIO_MODE_OUTPUT);

    adc_init_raise();  // Initialize the ADC

    // Initialize reed sensor interrupt
    init_reed_sensor_interrupt_raise();

    gpio_install_isr_service(0);  // Only call once in your program
    init_button();
    
    // Set up the periodic timer for ADC checks
    setup_adc_timer_raise();
}

void toggle_raise(bool is_on) {
    if (is_on) {
        // Read ADC value
        int adc_value = adc1_get_raw(ADC1_CHANNEL_0); // Use the appropriate ADC channel
        int reed_sensor_state = gpio_get_level(REED_PIN); // Check reed sensor state

        printf("reed: %d, adc_val: %d\n", reed_sensor_state, adc_value);

        // Check if ADC value is below the threshold and reed sensor is not triggered
        if (adc_value < RAISE_ADC_THRESHOLD && reed_sensor_state == 0) {
            // If below the threshold and reed sensor not triggered, allow the motor to raise
            gpio_set_level(RAISE_PIN, 1);
        } 
        else {
            // If threshold reached or reed sensor triggered, stop the motor
            printf("Raise ADC limit reached: %d\n", adc_value);
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
    printf("got here %s\n", buffer);
    cJSON *payload = cJSON_Parse(buffer);
    cJSON *is_on_json = cJSON_GetObjectItem(payload, "is_on");
    bool is_on = cJSON_IsTrue(is_on_json);
    cJSON_Delete(payload);
    toggle_raise(is_on);
    httpd_resp_set_status(req, "204 NO CONTENT");
    httpd_resp_send(req, NULL, 0);
    return ESP_OK;
}

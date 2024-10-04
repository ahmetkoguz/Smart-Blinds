#include "_routes.h"
#include "driver/gpio.h"
#include "driver/adc.h"

#define LOWER_PIN 22
#define REED_PIN 21

void adc_init_lower(void)
{
    // Configure ADC width
    adc1_config_width(ADC_WIDTH_BIT_12);

    // Configure ADC channel for the raise/lower operation (ADC1_CHANNEL_0 corresponds to GPIO36)
    adc1_config_channel_atten(ADC1_CHANNEL_0, ADC_ATTEN_DB_12); // Set attenuation for GPIO36
}


void init_lower(void)
{
  esp_rom_gpio_pad_select_gpio(LOWER_PIN);
  gpio_set_direction(LOWER_PIN, GPIO_MODE_OUTPUT);
  
  adc_init_lower();  // Initialize the ADC

  esp_rom_gpio_pad_select_gpio(REED_PIN);
  gpio_set_direction(REED_PIN, GPIO_MODE_INPUT);
}



void toggle_lower(bool is_on)
{
    if (is_on)
    {
        // Read ADC value
        int adc_value = adc1_get_raw(ADC1_CHANNEL_0); // Use the appropriate ADC channel
        int lower_adc_limit = 5;  // Set your limit here

        int reed_sensor_state = gpio_get_level(REED_PIN); //check reed
        printf("reed: %d, adc_val: %d\n", reed_sensor_state, adc_value);

        // Check if ADC value exceeds the limit
        if (adc_value < lower_adc_limit && reed_sensor_state == 0)
        {
            // If below the limit, allow the motor to lower
            gpio_set_level(LOWER_PIN, 1);
        }
        else
        {
            // If limit reached, stop the motor
            printf("Lower ADC limit reached: %d\n", adc_value);
            gpio_set_level(LOWER_PIN, 0);
        }
    }
    else
    {
        // If is_on is false, stop the motor
        gpio_set_level(LOWER_PIN, 0);
    }
}


esp_err_t on_lower(httpd_req_t *req)
{
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
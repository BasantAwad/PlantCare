# Green Thumb Guardian - Smart Plant Care Application

A comprehensive plant care application featuring AI-powered plant identification, intelligent chatbot assistance, store locator, and plant health monitoring.

## 🌱 Features

- **Plant Identification**: Upload photos to identify plants using PlantNet API
- **AI Chatbot**: Get personalized plant care advice using OpenAI GPT
- **Store Locator**: Find nearby plant nurseries and garden centers using Google Maps
- **Weather Integration**: Get weather-based plant care recommendations
- **Health Monitoring**: Track your plants' health and care schedules
- **Community Features**: Connect with other plant enthusiasts

## 🚀 Quick Start

### 1. Setup API Keys

Edit `js/api-config.js` and replace the placeholder API keys with your actual keys:

```javascript
const API_CONFIG = {
    PLANTNET: {
        API_KEY: 'YOUR_PLANTNET_API_KEY', // Get from https://my.plantnet.org/
        BASE_URL: 'https://my-api.plantnet.org/v2/identify',
        PROJECT: 'all'
    },
    OPENAI: {
        API_KEY: 'YOUR_OPENAI_API_KEY', // Get from https://platform.openai.com/
        BASE_URL: 'https://api.openai.com/v1/chat/completions',
        MODEL: 'gpt-3.5-turbo'
    },
    GOOGLE_MAPS: {
        API_KEY: 'YOUR_GOOGLE_MAPS_API_KEY', // Get from https://console.cloud.google.com/
        BASE_URL: 'https://maps.googleapis.com/maps/api/js'
    },
    WEATHER: {
        API_KEY: 'YOUR_WEATHER_API_KEY', // Get from https://openweathermap.org/
        BASE_URL: 'https://api.openweathermap.org/data/2.5/weather'
    }
};
```

### 2. API Key Setup Instructions

#### PlantNet API
1. Visit [PlantNet API](https://my.plantnet.org/)
2. Create an account and request an API key
3. Replace `YOUR_PLANTNET_API_KEY` with your actual key

#### OpenAI API
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account and generate an API key
3. Replace `YOUR_OPENAI_API_KEY` with your actual key
4. Ensure you have credits in your OpenAI account

#### Google Maps API
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Create credentials (API key)
5. Replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual key
6. Update the Google Maps script URL in HTML files

#### Weather API
1. Visit [OpenWeatherMap](https://openweathermap.org/)
2. Create a free account
3. Generate an API key
4. Replace `YOUR_WEATHER_API_KEY` with your actual key

### 3. Run the Application

1. Open `index.html` in a web browser
2. The application will automatically test all integrations
3. Check the browser console for test results

## 🧪 Testing

The application includes comprehensive integration testing:

- **Automatic Testing**: Tests run automatically when you open the application
- **Manual Testing**: Use `window.IntegrationTester` in browser console
- **Test Coverage**: All APIs, navigation, file validation, and error handling

### Running Tests Manually

```javascript
// In browser console
const tester = new IntegrationTester();
tester.runAllTests();
```

## 📁 File Structure

```
├── index.html              # Homepage
├── plant-id.html          # Plant identification page
├── plant-stores.html      # Store locator page
├── mygarden.html          # My garden page
├── community.html         # Community page
├── js/
│   ├── api-config.js      # API configuration and classes
│   ├── chatbot.js         # Chatbot interface and functionality
│   └── test-integrations.js # Integration testing suite
└── README.md              # This file
```

## 🔧 API Integration Details

### Plant Identification (PlantNet)
- **Endpoint**: `https://my-api.plantnet.org/v2/identify`
- **Method**: POST with FormData
- **Features**: Multi-language support, confidence scores, plant details

### Chatbot (OpenAI)
- **Model**: GPT-3.5-turbo
- **Features**: Context-aware responses, conversation history, plant-specific advice

### Store Locator (Google Maps)
- **APIs Used**: Maps JavaScript API, Places API
- **Features**: Real-time location, store filtering, ratings display

### Weather Service (OpenWeatherMap)
- **Features**: Current weather, plant care recommendations based on conditions

## 🛠️ Error Handling

The application includes comprehensive error handling:

- **API Failures**: Graceful fallbacks and user-friendly error messages
- **Network Issues**: Retry mechanisms and offline indicators
- **File Validation**: Image type and size validation
- **User Input**: Input sanitization and validation

## 🌐 Browser Compatibility

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Support**: Responsive design for mobile devices
- **Required Features**: ES6+, Fetch API, Geolocation API

## 🔒 Security Notes

- **API Keys**: Never commit real API keys to version control
- **HTTPS**: Use HTTPS in production for secure API calls
- **CORS**: Configure proper CORS settings for your domain

## 🚨 Troubleshooting

### Common Issues

1. **"API key not configured" warning**
   - Solution: Add your actual API keys to `js/api-config.js`

2. **"Google Maps API failed to load"**
   - Solution: Check your Google Maps API key and ensure required APIs are enabled

3. **"Plant identification failed"**
   - Solution: Verify PlantNet API key and check internet connection

4. **"Chatbot not responding"**
   - Solution: Check OpenAI API key and account credits

### Debug Mode

Enable debug mode by opening browser developer tools and checking the console for detailed error messages.

## 📱 Mobile Optimization

The application is fully responsive and optimized for mobile devices:
- Touch-friendly interface
- Optimized image uploads
- Mobile-specific UI adjustments
- Geolocation support for store finder

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the troubleshooting section above
- Review API documentation for each service
- Test integrations using the built-in testing suite

---

**Note**: This application requires internet connectivity and valid API keys for full functionality. Some features may work with limited functionality if certain APIs are unavailable.
>>>>>>> e7392ce (first)


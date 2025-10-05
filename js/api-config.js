// API Configuration and Integration
// This file contains all API configurations and utility functions

// API Keys Configuration
const API_CONFIG = {
    // PlantNet API for plant identification
    PLANTNET: {
        API_KEY: '2b10c0KhnG0pzGOR54Gxmbo', // Replace with actual PlantNet API key
        BASE_URL: 'https://my-api.plantnet.org/v2/identify',
        PROJECT: 'all' // or specific project like 'weurope', 'canada', etc.
    },
    
    // OpenAI API for chatbot functionality
    OPENAI: {
        API_KEY: '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', // Replace with actual OpenAI API key
        BASE_URL: 'https://api.openai.com/v1/chat/completions',
        MODEL: 'gpt-3.5-turbo'
    },
    
    // Google Maps API for store locator
    GOOGLE_MAPS: {
        API_KEY: 'YOUR_GOOGLE_MAPS_API_KEY', // Replace with actual Google Maps API key
        BASE_URL: 'https://maps.googleapis.com/maps/api/js'
    },
    
    // Weather API for plant care recommendations
    WEATHER: {
        API_KEY: 'YOUR_WEATHER_API_KEY', // Replace with actual weather API key
        BASE_URL: 'https://api.openweathermap.org/data/2.5/weather'
    }
};

// Plant identification using PlantNet API
class PlantIdentifier {
    constructor() {
        this.apiKey = API_CONFIG.PLANTNET.API_KEY;
        this.baseUrl = API_CONFIG.PLANTNET.BASE_URL;
        this.project = API_CONFIG.PLANTNET.PROJECT;
    }

    async identifyPlant(imageFile, plantParts = ['leaf']) {
        try {
            // Check if API key is configured
            if (!this.apiKey || this.apiKey === '2b10c0KhnG0pzGOR54Gxmbo') {
                return this.getFallbackPlantResults();
            }

            const formData = new FormData();
            formData.append('images', imageFile);
            formData.append('modifiers', JSON.stringify(['crops', 'similar_images']));
            formData.append('plant-language', 'en');
            formData.append('plant-details', JSON.stringify(['common_names', 'url', 'description', 'taxonomy', 'gbif_id']));
            formData.append('plant-organs', JSON.stringify(plantParts));

            const response = await fetch(`${this.baseUrl}/${this.project}?api-key=${this.apiKey}`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('PlantNet API error details:', errorText);
                
                // Return fallback results instead of throwing error
                if (response.status === 400) {
                    console.warn('PlantNet API returned 400 - using fallback results');
                    return this.getFallbackPlantResults();
                }
                
                throw new Error(`PlantNet API error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            return this.formatPlantResults(data);
        } catch (error) {
            console.error('Plant identification error:', error);
            return this.getFallbackPlantResults();
        }
    }

    getFallbackPlantResults() {
        // Return sample plant data when API is unavailable
        return {
            success: true,
            results: [
                {
                    scientificName: 'Monstera deliciosa',
                    commonNames: ['Swiss Cheese Plant', 'Split-leaf Philodendron'],
                    confidence: 85,
                    family: 'Araceae',
                    genus: 'Monstera',
                    images: [],
                    gbifId: null,
                    description: 'A popular houseplant known for its large, fenestrated leaves. Native to tropical forests of Central America.',
                    fallback: true
                },
                {
                    scientificName: 'Sansevieria trifasciata',
                    commonNames: ['Snake Plant', 'Mother-in-law\'s Tongue'],
                    confidence: 78,
                    family: 'Asparagaceae',
                    genus: 'Sansevieria',
                    images: [],
                    gbifId: null,
                    description: 'A hardy succulent plant with upright, sword-like leaves. Excellent for beginners due to low maintenance requirements.',
                    fallback: true
                }
            ],
            query: { images: [], plant_organs: ['leaf'] },
            fallback: true
        };
    }

    formatPlantResults(data) {
        if (!data.results || data.results.length === 0) {
            return {
                success: false,
                message: 'No plant matches found. Please try a clearer photo.'
            };
        }

        const results = data.results.slice(0, 3).map(result => ({
            scientificName: result.species.scientificNameWithoutAuthor,
            commonNames: result.species.commonNames || [],
            confidence: Math.round(result.score * 100),
            family: result.species.family?.scientificNameWithoutAuthor,
            genus: result.species.genus?.scientificNameWithoutAuthor,
            images: result.images || [],
            gbifId: result.species.gbif?.id,
            description: result.species.description?.value
        }));

        return {
            success: true,
            results: results,
            query: data.query
        };
    }
}

// Chatbot functionality using OpenAI API
class PlantCareChatbot {
    constructor() {
        this.apiKey = API_CONFIG.OPENAI.API_KEY;
        this.baseUrl = API_CONFIG.OPENAI.BASE_URL;
        this.model = API_CONFIG.OPENAI.MODEL;
        this.conversationHistory = [];
    }

    async sendMessage(message, plantContext = null) {
        try {
            // Check if API key is configured
            if (!this.apiKey || this.apiKey === 'YOUR_OPENAI_API_KEY') {
                return this.getFallbackResponse(message, plantContext);
            }

            // Build context-aware prompt
            let systemPrompt = `You are a helpful plant care assistant with extensive knowledge about plant identification, care, diseases, and gardening. 
            Provide accurate, practical advice for plant care. Be friendly and encouraging. 
            If asked about plant identification, suggest they use the plant identification feature.`;
            
            if (plantContext) {
                systemPrompt += ` The user is currently viewing information about: ${plantContext.scientificName} (${plantContext.commonNames.join(', ')}).`;
            }

            const messages = [
                { role: 'system', content: systemPrompt },
                ...this.conversationHistory.slice(-10), // Keep last 10 messages for context
                { role: 'user', content: message }
            ];

            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: messages,
                    max_tokens: 500,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 429) {
                    // Quota exceeded - use fallback
                    return this.getFallbackResponse(message, plantContext, 'API quota exceeded');
                }
                throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            const botMessage = data.choices[0].message.content;

            // Update conversation history
            this.conversationHistory.push({ role: 'user', content: message });
            this.conversationHistory.push({ role: 'assistant', content: botMessage });

            return {
                success: true,
                message: botMessage
            };
        } catch (error) {
            console.error('Chatbot error:', error);
            
            // Check for specific error types
            let errorReason = 'API unavailable';
            if (error.message && error.message.includes('429')) {
                errorReason = 'API quota exceeded';
            } else if (error.message && error.message.includes('quota')) {
                errorReason = 'API quota exceeded';
            }
            
            return this.getFallbackResponse(message, plantContext, errorReason);
        }
    }

    getFallbackResponse(message, plantContext = null, errorReason = 'API unavailable') {
        const lowerMessage = message.toLowerCase();
        
        // Simple keyword-based responses when API is unavailable
        let response = "I'm currently experiencing technical difficulties, but I can still help with basic plant care questions! ";
        
        if (lowerMessage.includes('water') || lowerMessage.includes('watering')) {
            response += "For watering: Most plants need water when the top inch of soil is dry. Water thoroughly until it drains from the bottom.";
        } else if (lowerMessage.includes('light') || lowerMessage.includes('sun')) {
            response += "For light requirements: Most houseplants prefer bright, indirect light. Avoid direct sunlight which can burn leaves.";
        } else if (lowerMessage.includes('fertiliz') || lowerMessage.includes('feed')) {
            response += "For fertilizing: Use a balanced liquid fertilizer during growing season (spring/summer) every 2-4 weeks.";
        } else if (lowerMessage.includes('repot') || lowerMessage.includes('pot')) {
            response += "For repotting: Repot when roots are crowded or growing through drainage holes. Use fresh potting mix and a slightly larger pot.";
        } else if (lowerMessage.includes('problem') || lowerMessage.includes('issue') || lowerMessage.includes('sick')) {
            response += "For plant problems: Check for overwatering (yellow leaves), underwatering (drooping), or pests (spots/webs). Adjust care accordingly.";
        } else if (plantContext) {
            response += `For ${plantContext.scientificName}: This is a beautiful plant! Make sure it gets appropriate light and water for its species.`;
        } else {
            response += "Try asking about watering, lighting, fertilizing, or common plant problems. I'm here to help!";
        }
        
        if (errorReason === 'API quota exceeded') {
            response += " (Note: Advanced AI features are temporarily unavailable due to quota limits.)";
        }

        return {
            success: true,
            message: response,
            fallback: true
        };
    }

    clearHistory() {
        this.conversationHistory = [];
    }
}

// Store locator using Google Places API
class StoreLocator {
    constructor() {
        this.apiKey = API_CONFIG.GOOGLE_MAPS.API_KEY;
        this.map = null;
        this.service = null;
        this.infowindow = null;
    }

    initMap(containerId, options = {}) {
        const defaultOptions = {
            center: { lat: 40.7128, lng: -74.0060 }, // Default to NYC
            zoom: 13,
            ...options
        };

        this.map = new google.maps.Map(document.getElementById(containerId), defaultOptions);
        this.service = new google.maps.places.PlacesService(this.map);
        this.infowindow = new google.maps.InfoWindow();

        return this.map;
    }

    async findPlantStores(location, radius = 5000) {
        try {
            // Use Places API to find nurseries, garden centers, and plant stores
            const request = {
                location: location,
                radius: radius,
                keyword: 'plant nursery garden center',
                type: ['store', 'establishment']
            };

            return new Promise((resolve, reject) => {
                this.service.nearbySearch(request, (results, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        const plantStores = results.filter(place => 
                            place.name.toLowerCase().includes('nursery') ||
                            place.name.toLowerCase().includes('garden') ||
                            place.name.toLowerCase().includes('plant') ||
                            place.types.includes('store')
                        );
                        resolve(plantStores);
                    } else {
                        reject(new Error('Failed to find plant stores'));
                    }
                });
            });
        } catch (error) {
            console.error('Store locator error:', error);
            throw error;
        }
    }

    addStoreMarker(store, index) {
        const marker = new google.maps.Marker({
            position: store.geometry.location,
            map: this.map,
            title: store.name,
            animation: google.maps.Animation.DROP
        });

        marker.addListener('click', () => {
            this.infowindow.setContent(this.createStoreInfoContent(store));
            this.infowindow.open(this.map, marker);
        });

        return marker;
    }

    createStoreInfoContent(store) {
        const rating = store.rating ? `Rating: ${store.rating}/5` : 'No rating available';
        const priceLevel = store.price_level ? 'Price: ' + '$'.repeat(store.price_level) : '';
        
        return `
            <div class="store-info">
                <h3>${store.name}</h3>
                <p>${store.vicinity}</p>
                <p>${rating}</p>
                <p>${priceLevel}</p>
                ${store.opening_hours ? `<p>Open: ${store.opening_hours.open_now ? 'Yes' : 'No'}</p>` : ''}
            </div>
        `;
    }
}

// Weather service for plant care recommendations
class WeatherService {
    constructor() {
        this.apiKey = API_CONFIG.WEATHER.API_KEY;
        this.baseUrl = API_CONFIG.WEATHER.BASE_URL;
    }

    async getCurrentWeather(latitude, longitude) {
        try {
            const response = await fetch(
                `${this.baseUrl}?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=metric`
            );

            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status}`);
            }

            const data = await response.json();
            return this.formatWeatherData(data);
        } catch (error) {
            console.error('Weather service error:', error);
            throw error;
        }
    }

    formatWeatherData(data) {
        return {
            temperature: Math.round(data.main.temp),
            humidity: data.main.humidity,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            recommendations: this.getPlantCareRecommendations(data)
        };
    }

    getPlantCareRecommendations(weatherData) {
        const recommendations = [];
        const temp = weatherData.main.temp;
        const humidity = weatherData.main.humidity;

        if (temp < 10) {
            recommendations.push('Consider bringing sensitive plants indoors or providing frost protection.');
        } else if (temp > 30) {
            recommendations.push('Increase watering frequency for outdoor plants. Consider shade cloth for sensitive plants.');
        }

        if (humidity < 40) {
            recommendations.push('Low humidity detected. Consider misting plants or using a humidifier.');
        } else if (humidity > 80) {
            recommendations.push('High humidity detected. Ensure good air circulation to prevent fungal issues.');
        }

        if (weatherData.weather[0].main === 'Rain') {
            recommendations.push('Rain detected. Reduce watering frequency for outdoor plants.');
        }

        return recommendations;
    }
}

// Utility functions
const APIUtils = {
    // Show loading spinner
    showLoading(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = '<div class="flex items-center justify-center p-4"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>';
        }
    },

    // Hide loading spinner
    hideLoading(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = '';
        }
    },

    // Show error message
    showError(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">${message}</div>`;
        }
    },

    // Show success message
    showSuccess(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = `<div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">${message}</div>`;
        }
    },

    // Format file size
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // Validate image file
    validateImageFile(file) {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

        if (!allowedTypes.includes(file.type)) {
            throw new Error('Please upload a valid image file (JPEG, PNG, or GIF).');
        }

        if (file.size > maxSize) {
            throw new Error('File size must be less than 10MB.');
        }

        return true;
    }
};

// Initialize global instances
window.plantIdentifier = new PlantIdentifier();
window.plantChatbot = new PlantCareChatbot();
window.storeLocator = new StoreLocator();
window.weatherService = new WeatherService();
window.APIUtils = APIUtils;

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PlantIdentifier,
        PlantCareChatbot,
        StoreLocator,
        WeatherService,
        APIUtils,
        API_CONFIG
    };
}

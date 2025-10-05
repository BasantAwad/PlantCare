// Chatbot Interface and Functionality
// This file handles the chatbot UI and interactions

class ChatbotInterface {
    constructor() {
        this.isOpen = false;
        this.chatContainer = null;
        this.messagesContainer = null;
        this.inputContainer = null;
        this.currentPlantContext = null;
        this.init();
    }

    init() {
        this.createChatbotHTML();
        this.bindEvents();
        this.addWelcomeMessage();
    }

    createChatbotHTML() {
        // Create chatbot container
        this.chatContainer = document.createElement('div');
        this.chatContainer.id = 'chatbot-container';
        this.chatContainer.className = 'fixed bottom-20 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 transform transition-all duration-300 ease-in-out translate-y-full opacity-0 z-50';
        
        this.chatContainer.innerHTML = `
            <div class="flex flex-col h-full">
                <!-- Chat Header -->
                <div class="bg-green-600 text-white p-4 rounded-t-lg flex justify-between items-center">
                    <div class="flex items-center">
                        <i data-feather="message-circle" class="h-5 w-5 mr-2"></i>
                        <h3 class="font-semibold">Plant Care Assistant</h3>
                    </div>
                    <button id="close-chatbot" class="text-white hover:text-gray-200">
                        <i data-feather="x" class="h-5 w-5"></i>
                    </button>
                </div>
                
                <!-- Messages Container -->
                <div id="chatbot-messages" class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    <!-- Messages will be added here -->
                </div>
                
                <!-- Input Container -->
                <div class="p-4 border-t border-gray-200 bg-white rounded-b-lg">
                    <div class="flex space-x-2">
                        <input 
                            type="text" 
                            id="chatbot-input" 
                            placeholder="Ask about plant care..." 
                            class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <button 
                            id="send-message" 
                            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <i data-feather="send" class="h-4 w-4"></i>
                        </button>
                    </div>
                    <div class="mt-2 text-xs text-gray-500">
                        Try: "How often should I water my plant?" or "What's wrong with my plant?"
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.chatContainer);
        this.messagesContainer = document.getElementById('chatbot-messages');
        this.inputContainer = document.getElementById('chatbot-input');
    }

    bindEvents() {
        // Toggle chatbot
        const chatbotButton = document.querySelector('.chatbot-icon, [data-feather="message-circle"]').closest('button');
        const closeButton = document.getElementById('close-chatbot');
        const sendButton = document.getElementById('send-message');
        const input = document.getElementById('chatbot-input');

        if (chatbotButton) {
            chatbotButton.addEventListener('click', () => this.toggle());
        }

        if (closeButton) {
            closeButton.addEventListener('click', () => this.close());
        }

        if (sendButton) {
            sendButton.addEventListener('click', () => this.sendMessage());
        }

        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!this.chatContainer.contains(e.target) && 
                !e.target.closest('.chatbot-icon') && 
                this.isOpen) {
                this.close();
            }
        });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.chatContainer.classList.remove('translate-y-full', 'opacity-0');
        this.chatContainer.classList.add('translate-y-0', 'opacity-100');
        this.isOpen = true;
        this.inputContainer.focus();
        
        // Refresh feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }

    close() {
        this.chatContainer.classList.add('translate-y-full', 'opacity-0');
        this.chatContainer.classList.remove('translate-y-0', 'opacity-100');
        this.isOpen = false;
    }

    addWelcomeMessage() {
        const welcomeMessage = {
            type: 'bot',
            content: "Hi! I'm your plant care assistant. I can help you with plant identification, care tips, disease diagnosis, and general gardening advice. What would you like to know?",
            timestamp: new Date()
        };
        
        this.addMessage(welcomeMessage);
    }

    async sendMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();
        
        if (!message) return;

        // Add user message
        this.addMessage({
            type: 'user',
            content: message,
            timestamp: new Date()
        });

        // Clear input
        input.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Send to chatbot API
            const response = await window.plantChatbot.sendMessage(message, this.currentPlantContext);
            
            // Remove typing indicator
            this.hideTypingIndicator();

            if (response.success) {
                this.addMessage({
                    type: 'bot',
                    content: response.message,
                    timestamp: new Date()
                });
            } else {
                this.addMessage({
                    type: 'bot',
                    content: response.message,
                    timestamp: new Date(),
                    error: true
                });
            }
        } catch (error) {
            console.error('Chatbot error:', error);
            this.hideTypingIndicator();
            this.addMessage({
                type: 'bot',
                content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
                timestamp: new Date(),
                error: true
            });
        }
    }

    addMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = `flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = `max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
            message.type === 'user' 
                ? 'bg-green-600 text-white' 
                : message.error 
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : 'bg-white text-gray-800 border border-gray-200'
        }`;
        
        messageContent.innerHTML = `
            <div class="text-sm">${this.formatMessage(message.content)}</div>
            <div class="text-xs mt-1 opacity-70">${this.formatTime(message.timestamp)}</div>
        `;
        
        messageElement.appendChild(messageContent);
        this.messagesContainer.appendChild(messageElement);
        
        // Scroll to bottom
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    formatMessage(content) {
        // Convert markdown-like formatting to HTML
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
    }

    formatTime(timestamp) {
        return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    showTypingIndicator() {
        const typingElement = document.createElement('div');
        typingElement.id = 'typing-indicator';
        typingElement.className = 'flex justify-start';
        
        typingElement.innerHTML = `
            <div class="bg-white text-gray-800 border border-gray-200 px-4 py-2 rounded-lg">
                <div class="flex space-x-1">
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                </div>
            </div>
        `;
        
        this.messagesContainer.appendChild(typingElement);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    setPlantContext(plant) {
        this.currentPlantContext = plant;
        
        // Add context message
        if (plant) {
            this.addMessage({
                type: 'bot',
                content: `I see you're looking at ${plant.scientificName}. I can help you with specific care questions about this plant!`,
                timestamp: new Date()
            });
        }
    }

    clearHistory() {
        window.plantChatbot.clearHistory();
        this.messagesContainer.innerHTML = '';
        this.addWelcomeMessage();
    }

    // Quick action buttons
    addQuickActions() {
        const quickActions = [
            { text: "Watering schedule", query: "What's the best watering schedule for my plant?" },
            { text: "Plant problems", query: "Help me diagnose plant problems" },
            { text: "Fertilizing", query: "When and how should I fertilize my plants?" },
            { text: "Repotting", query: "How do I know when to repot my plant?" }
        ];

        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'mt-4 space-y-2';
        
        quickActions.forEach(action => {
            const button = document.createElement('button');
            button.className = 'w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm transition-colors';
            button.textContent = action.text;
            button.addEventListener('click', () => {
                document.getElementById('chatbot-input').value = action.query;
                this.sendMessage();
            });
            actionsContainer.appendChild(button);
        });

        this.messagesContainer.appendChild(actionsContainer);
    }
}

// Plant identification specific chatbot features
class PlantIdentificationChatbot extends ChatbotInterface {
    constructor() {
        super();
        this.identificationResults = null;
    }

    setIdentificationResults(results) {
        this.identificationResults = results;
        
        if (results && results.success) {
            this.addMessage({
                type: 'bot',
                content: `Great! I identified ${results.results.length} possible matches. I can help you learn more about any of these plants. Which one interests you most?`,
                timestamp: new Date()
            });
            
            // Add quick action buttons for each result
            results.results.forEach((result, index) => {
                const button = document.createElement('button');
                button.className = 'block w-full text-left px-3 py-2 bg-green-50 hover:bg-green-100 rounded-md text-sm mb-2 border border-green-200';
                button.innerHTML = `
                    <div class="font-medium">${result.scientificName}</div>
                    <div class="text-xs text-gray-600">${result.commonNames.join(', ') || 'No common names'}</div>
                    <div class="text-xs text-green-600">${result.confidence}% confidence</div>
                `;
                button.addEventListener('click', () => {
                    this.currentPlantContext = result;
                    this.addMessage({
                        type: 'user',
                        content: `Tell me about ${result.scientificName}`,
                        timestamp: new Date()
                    });
                    this.sendMessage();
                });
                this.messagesContainer.appendChild(button);
            });
        }
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on plant identification page
    if (window.location.pathname.includes('plant-id')) {
        window.chatbot = new PlantIdentificationChatbot();
    } else {
        window.chatbot = new ChatbotInterface();
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ChatbotInterface,
        PlantIdentificationChatbot
    };
}

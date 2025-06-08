#!/bin/bash

# Start all Guessify applications
echo "🎵 Starting Guessify Applications..."

# Function to start an app in a new terminal tab/window
start_app() {
    local app_name=$1
    local port=$2
    local path=$3
    
    echo "Starting $app_name on port $port..."
    
    # For macOS Terminal
    if [[ "$OSTYPE" == "darwin"* ]]; then
        osascript -e "tell application \"Terminal\" to do script \"cd '$PWD/$path' && npm start\""
    # For Linux with gnome-terminal
    elif command -v gnome-terminal &> /dev/null; then
        gnome-terminal --tab --title="$app_name" -- bash -c "cd '$PWD/$path' && npm start; exec bash"
    # Fallback - run in background
    else
        cd "$path" && npm start &
        cd ..
    fi
}

# Start Backend (port 8000)
echo "🔧 Starting Backend Server..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    osascript -e "tell application \"Terminal\" to do script \"cd '$PWD/backend' && npm run dev\""
elif command -v gnome-terminal &> /dev/null; then
    gnome-terminal --tab --title="Backend" -- bash -c "cd '$PWD/backend' && npm run dev; exec bash"
else
    cd backend && npm run dev &
    cd ..
fi

# Wait a moment for backend to start
sleep 2

# Start Marketing Website (port 3000)
start_app "Marketing Website" 3000 "marketing-website"

# Wait a moment
sleep 1

# Start Create App (port 3001)
start_app "Create App" 3001 "create-app"

# Wait a moment
sleep 1

# Start Play App (port 3002)
start_app "Play App" 3002 "play-app"

echo ""
echo "🚀 All applications are starting..."
echo ""
echo "📱 Applications will be available at:"
echo "   🌐 Marketing Website: http://localhost:3000"
echo "   ⚙️  Create App:        http://localhost:3001"
echo "   🎮 Play App:          http://localhost:3002"
echo "   🔧 Backend API:       http://localhost:8000"
echo ""
echo "✨ Happy coding!"

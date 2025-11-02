# Debate Timer

A professional debate timing and management system built with React, TypeScript, and Vite. This application provides comprehensive features for managing debates, including timer functionality, topic selection, team management, and configurable settings.

## Features

### 🎯 Topic Selection
- **Random Topic Selection**: Upload a file containing topics and randomly select one
- **Specific Topic Entry**: Manually enter or select a debate topic
- **Topic History**: Keep track of recently used topics
- **File Upload Support**: Accept .txt and .csv files with one topic per line

### ⏱️ Timer Management
- **Centralized Timer Display**: Large, prominent timer with visual indicators
- **Phase Management**: Research phase, speaking phase, and completion tracking
- **Color-Coded Warnings**: Visual alerts when time is running low
- **Timer Controls**: Start, pause, resume, stop, and next speaker functionality
- **Progress Visualization**: Circular progress ring showing time remaining

### 👥 Team Management
- **Dual Team Display**: Side-by-side team panels showing current and upcoming speakers
- **Speaker Information**: Names, roles, and time limits for each speaker
- **Speaking Order**: Configurable sequence with clear visual hierarchy
- **Current Speaker Highlighting**: Clear indication of who is currently speaking

### ⚙️ Settings Configuration
- **Research Time Settings**: Configurable research phase duration
- **Speaking Time Limits**: Individual time limits per speaker
- **Auto-Advance Options**: Automatic progression to next speaker
- **Warning Thresholds**: Configurable visual and timing warnings
- **Team Customization**: Set team names and speaker details

### 📱 Responsive Design
- **Desktop Optimized**: Full-featured interface for desktop use
- **Tablet Support**: Adaptive layout for tablet devices
- **Mobile Friendly**: Responsive design for mobile screens
- **Touch Interactions**: Optimized for touch-screen devices

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite (fast development and optimized builds)
- **Styling**: CSS Modules for component-scoped styles
- **State Management**: React Context + useReducer pattern
- **Icons**: React Icons library
- **Type Safety**: Full TypeScript implementation

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd DebateTimer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

1. Build the application:
```bash
npm run build
```

2. Preview the production build:
```bash
npm run preview
```

## Usage

### Starting a Debate

1. **Select a Topic**: Choose between random topic selection or specific topic entry
2. **Configure Settings**: Set research time, speaking times, and team arrangements
3. **Start the Debate**: Begin with the research phase or jump straight to speaking
4. **Manage Timing**: Use timer controls to pause, resume, or advance speakers
5. **Monitor Progress**: Track speaking times and debate progression

### Topic File Format

When using random topic selection, upload a `.txt` or `.csv` file with the following format:

```
Technology enhances human connection more than it isolates us
Social media does more harm than good to society
Artificial intelligence will be more beneficial than harmful to humanity
Climate change is the most pressing issue facing our generation
```

**File Requirements:**
- One topic per line
- Maximum file size: 1MB
- UTF-8 encoding
- Empty lines and comments (lines starting with #) are ignored

### Timer Controls

- **Start/Pause/Resume**: Control timer playback
- **Stop**: End current timer session
- **Next Speaker**: Advance to the next speaker manually
- **Reset**: Reset timer to initial state

### Visual Indicators

- **Green**: Normal time remaining
- **Yellow**: Warning zone (25% time remaining)
- **Orange**: Critical zone (10% time remaining)
- **Red**: Overtime (time exceeded)

## Project Structure

```
src/
├── components/           # React components
│   ├── Timer/           # Timer display and controls
│   ├── TeamDisplay/     # Team panels and speaker info
│   ├── TopicDisplay/    # Topic header component
│   ├── StartScreen/     # Topic selection interface
│   └── DebateScreen/    # Main debate interface
├── context/             # React context providers
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── styles.d.ts          # CSS module type declarations
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with React and TypeScript
- Styled with CSS Modules
- Icons from React Icons
- Development powered by Vite
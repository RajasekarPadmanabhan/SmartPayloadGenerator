# Smart Payload Generator

A modern web application built with Next.js 14 and Material UI that generates JSON or XML payloads from XSD schemas with intelligent dummy data and optional filter conditions.

## Features

- 🔄 **XSD Schema Parsing**: Upload and parse XSD schema files
- 📊 **Smart Data Generation**: Generate realistic dummy data that conforms to schema structure
- 🎯 **Filter Conditions**: Apply optional filter conditions to customize generated data
- 📄 **Multiple Output Formats**: Generate both JSON and XML payloads
- 🎨 **Modern UI**: Beautiful, responsive interface built with Material UI
- ⚡ **Fast Performance**: Built with Next.js 14 App Router for optimal performance

## Technologies Used

- **Frontend**: Next.js 14 (App Router), React 19, Material UI
- **Language**: JavaScript (no TypeScript)
- **XML Processing**: fast-xml-parser, xml2js
- **Styling**: Material UI (no Tailwind CSS)

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd smart-payload-generator
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. **Upload XSD Schema**: Click "Create Payload" and upload a valid XSD schema file (.xsd extension)
2. **Add Filter Conditions** (Optional): Enter conditions like `price < 500 and inStock = true`
3. **Choose Output Format**: Select JSON or XML format
4. **Generate Payload**: Click "Generate Payload" to create valid data
5. **Download**: Download the generated payload for use in your applications

### Example Filter Conditions

- `price < 500 and inStock = true`
- `grade = 'A' and department = 'Engineering'`
- `age >= 25 and profession = 'Developer'`

## Project Structure

```
├── app/
│   ├── components/
│   │   ├── PayloadGenerator.js    # Main payload generator component
│   │   └── ThemeProvider.js       # Material UI theme configuration
│   ├── utils/
│   │   ├── xsdParser.js          # XSD schema parsing logic
│   │   └── payloadGenerator.js    # Payload generation logic
│   ├── globals.css               # Global styles
│   ├── layout.js                 # Root layout with theme provider
│   └── page.js                   # Main page component
├── public/                       # Static assets
├── .github/
│   └── copilot-instructions.md   # Copilot coding guidelines
└── package.json                  # Dependencies and scripts
```

## Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality

### Code Style

- Use functional components with React hooks
- Follow Material UI design patterns
- Implement proper error handling
- Use semantic HTML and accessible components
- Follow React best practices

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/your-username/smart-payload-generator/issues) on GitHub.

# Examples

This directory contains examples demonstrating the usage of the big-screen-frame library.

## Directory Structure

```
examples/
├── core/                  # Core functionality examples
│   ├── layout/           # Layout examples
│   │   ├── scale-screen/ # Scale screen examples
│   │   ├── grid/        # Grid layout examples
│   │   └── flex/        # Flex layout examples
│   └── theme/           # Theme system examples
├── components/           # Component examples
│   ├── basic/           # Basic components
│   │   ├── button/
│   │   └── input/
│   └── business/        # Business components
│       ├── charts/      # Chart components
│       └── decorations/ # Decoration components
├── application/         # Application examples
│   ├── config/         # Configuration examples
│   ├── router/         # Router usage
│   └── store/          # Store management
├── assets/             # Static assets
│   ├── images/
│   └── styles/
└── shared/             # Shared resources
    ├── components/
    └── utils/
```

## Examples Organization

Each example directory follows this structure:

```
example-name/
├── README.md           # Documentation and usage guide
├── App.vue            # Main example component
├── main.ts            # Entry point
└── components/        # Example-specific components
```

## Documentation Standards

Each example's README.md should include:

1. **Overview**: Brief description of the feature
2. **Usage**: How to use the feature
3. **API Reference**: Available props, events, and methods
4. **Best Practices**: Recommended usage patterns
5. **Common Issues**: Known issues and solutions

## Running Examples

1. Start the development server:

```bash
pnpm dev
```

2. Visit the examples in your browser:

- Core Examples: http://localhost:xxxx/core
- Component Examples: http://localhost:xxxx/components
- Application Examples: http://localhost:xxxx/application

## Contributing

When adding new examples:

1. Follow the directory structure
2. Include comprehensive documentation
3. Ensure the example is self-contained
4. Add necessary comments in code
5. Test the example thoroughly

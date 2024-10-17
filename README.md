# Wheel of Names

A web-based application for randomly selecting participants during meetings using a spinning wheel. This tool is designed to make meetings more interactive, fair, and engaging.

## Table of Contents

- [Wheel of Names](#wheel-of-names)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Demo](#demo)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Customization](#customization)
  - [Data Persistence](#data-persistence)
  - [Contributing](#contributing)
  - [License](#license)
  - [Acknowledgments](#acknowledgments)

## Features

- **User-Friendly Interface**: Simple and intuitive design for easy use during meetings.
- **Random Selection Mechanism**: Spins a wheel to randomly select a participant.
- **Customization**: Users can input any number of names and customize the wheel's appearance.
- **Local Storage with Expiration**: Saves participant names between sessions with an expiration mechanism to ensure privacy.
- **Responsive Design**: Works seamlessly on desktops, tablets, and smartphones.

## Demo

[Live Demo](#) *(Add the URL to your live demo if available.)*

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/wheel-of-names.git
   ```

2. **Navigate to the Project Directory**

   ```bash
   cd wheel-of-names
   ```

3. **Open `index.html` in Your Browser**

   - Simply open the `index.html` file in your preferred web browser.
   - No additional setup is required.

## Usage

1. **Enter Participant Names**

   - Type or paste the names of participants into the textarea provided.
   - Enter one name per line.

2. **Spin the Wheel**

   - Click the **"Spin the Wheel"** button to start the spinning animation.
   - The wheel will spin and gradually slow down.

3. **View the Selected Participant**

   - An alert will display the name of the selected participant once the wheel stops.

## Customization

- **Colors and Appearance**

  - Modify the `getColor` function in `script.js` to change the color scheme.
  - Update `style.css` to adjust fonts, sizes, and other stylistic elements.

- **Wheel Size**

  - Adjust the `width` and `height` attributes of the canvas in `index.html` for different wheel sizes.

## Data Persistence

- **Local Storage with Expiration**

  - Participant names are saved in the browser's local storage.
  - Data expires after 7 days to ensure privacy.
  - You can adjust the expiration period by changing the `expirationDays` constant in `script.js`.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Commit your changes:

   ```bash
   git commit -m 'Add your commit message'
   ```

4. Push to the branch:

   ```bash
   git push origin feature/your-feature-name
   ```

5. Open a pull request describing your changes.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments

This application was developed to provide an interactive and fair method for selecting participants in meetings. Special thanks to [ChatGPT](https://openai.com/blog/chatgpt) for generating the initial codebase and documentation.
# SwaggerDeck

SwaggerDeck is a lightweight web application that allows you to easily manage, view, and share Swagger API documentation files through a simple web interface. This tool is perfect for developers and API teams who need to manage multiple Swagger/OpenAPI specification files and want a convenient way to access them from a browser.


## Features

- **Upload Management**: Drag and drop or select JSON Swagger specification files for upload
- **Interactive Viewer**: Built-in Swagger UI for viewing and testing API documentation
- **File Operations**: Easily manage your files with options to view, download, and delete
- **Statistics Dashboard**: Track the number of files, total size, and last update time
- **Modern UI**: Clean and responsive interface with intuitive design
- **Security Controls**: File validation and sanitization to prevent malicious files

## Requirements

- Web server with PHP support (Apache/Nginx)
- PHP 7.0 or higher
- Write permissions for the web server user

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/AliHz1337/swagger-deck.git
git clone https://github.com/swagger-api/swagger-ui.git swagger-deck/swagger-ui
```

### 2. Move Files to Web Directory

```bash
sudo mv swagger-deck /var/www/html/
```

### 3. Set Proper Permissions

```bash
sudo chown -R www-data:www-data /var/www/html/swagger-deck
sudo chmod -R 755 /var/www/html/swagger-deck
```

### 4. Ensure the Storage Directory Exists

The application will automatically create the `json_files` directory if it doesn't exist, but you can manually create it with proper permissions:

```bash
sudo mkdir -p /var/www/html/swagger-deck/json_files
sudo chown -R www-data:www-data /var/www/html/swagger-deck/json_files
sudo chmod -R 755 /var/www/html/swagger-deck/json_files
```

### 5. Access the Application

Open your web browser and navigate to:

```
http://your-server-ip/swagger-deck/
```

Or if you're working locally:

```
http://localhost/swagger-deck/
```

## Usage

### Uploading API Documentation Files

1. Open the main page of SwaggerDeck
2. Either drag and drop your JSON file onto the upload area or click "Choose File" to select it
3. The file will be automatically uploaded and appear in the file list

### Viewing API Documentation

1. Find the desired file in the file list
2. Click the "View" button next to the file
3. The Swagger UI will load and display your API documentation

### Downloading Files

1. When viewing a file in Swagger UI, click the "Download File" button in the top right corner
2. Alternatively, in the main file list, you can add a download button (requires minor code modification)

### Deleting Files

1. In the file list, click the "Delete" button next to the file you want to remove
2. The file will be permanently deleted from the server

## Security Considerations

- The application includes basic security measures like file sanitization and MIME type checking
- Only JSON and TXT files are allowed for upload
- File paths are sanitized to prevent directory traversal attacks
- Consider adding authentication if deploying in a production environment

## Customization

You can customize SwaggerDeck by modifying the following files:

- `main.css`: Change the look and feel of the main interface
- `swagger.css`: Modify the Swagger viewer interface styling
- `functions.php`: Adjust upload limits, file handling logic, and security controls
- `index.html`: Customize the main page layout and components

## Troubleshooting

### Permissions Issues

If you encounter permission issues:

```bash
sudo chown -R www-data:www-data /var/www/html/swagger-deck
sudo chmod -R 755 /var/www/html/swagger-deck
```

### Upload Size Limitations

If you need to upload larger files, you may need to modify your PHP configuration:

1. Edit your `php.ini` file
2. Update the following values:
   ```
   upload_max_filesize = 50M
   post_max_size = 50M
   ```
3. Restart your web server

### Missing Swagger UI

If the Swagger UI is not loaded properly:

1. Make sure you've cloned the Swagger UI repository into the `swagger-ui` directory
2. Verify the path in `swagger.html` is correct for loading the Swagger UI assets

## Contributing

Contributions are welcome! Feel free to fork the repository and submit pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Created with ❤️

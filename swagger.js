// JavaScript code for loading and displaying Swagger UI

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const fileName = urlParams.get('file');

    const loadingContainer = document.getElementById('loading-container');
    const errorContainer = document.getElementById('error-container');
    const swaggerUiContainer = document.getElementById('swagger-ui');
    const fileNameElement = document.getElementById('file-name');
    const downloadLink = document.getElementById('download-link');
    const errorMessage = document.getElementById('error-message');

    if (fileName) {
        fileNameElement.textContent = fileName;

        //=======================================================================
        // Set up download link to send POST request
        //=======================================================================
        downloadLink.addEventListener('click', function (e) {
            e.preventDefault();
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = 'functions.php';
            form.target = '_blank';

            const actionInput = document.createElement('input');
            actionInput.type = 'hidden';
            actionInput.name = 'action';
            actionInput.value = 'download';

            const fileInput = document.createElement('input');
            fileInput.type = 'hidden';
            fileInput.name = 'file';
            fileInput.value = fileName;

            form.appendChild(actionInput);
            form.appendChild(fileInput);
            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
        });

        //=======================================================================
        // Check if the file exists using a form submission
        //=======================================================================
        const checkForm = document.createElement('form');
        checkForm.method = 'POST';
        checkForm.action = 'functions.php';
        checkForm.style.display = 'none';

        const checkActionInput = document.createElement('input');
        checkActionInput.type = 'hidden';
        checkActionInput.name = 'action';
        checkActionInput.value = 'exists';

        const checkFileInput = document.createElement('input');
        checkFileInput.type = 'hidden';
        checkFileInput.name = 'file';
        checkFileInput.value = fileName;

        checkForm.appendChild(checkActionInput);
        checkForm.appendChild(checkFileInput);
        document.body.appendChild(checkForm);

        const formData = new URLSearchParams(new FormData(checkForm)).toString();

        fetch('functions.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.exists) {
                    loadingContainer.style.display = 'none';
                    swaggerUiContainer.style.display = 'block';

                    // Initialize Swagger UI
                    SwaggerUIBundle({
                        url: `json_files/${fileName}`,
                        dom_id: '#swagger-ui',
                        presets: [
                            SwaggerUIBundle.presets.apis,
                            SwaggerUIStandalonePreset
                        ],
                        layout: "StandaloneLayout",
                        docExpansion: 'list',
                        defaultModelsExpandDepth: 1,
                        defaultModelExpandDepth: 1
                    });
                } else {
                    // Display error if file does not exist
                    loadingContainer.style.display = 'none';
                    errorContainer.style.display = 'block';
                    errorMessage.textContent = `The file '${fileName}' was not found or is not valid.`;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                loadingContainer.style.display = 'none';
                errorContainer.style.display = 'block';
                errorMessage.textContent = 'Error checking file existence.';
            });

        document.body.removeChild(checkForm);
    } else {
        // Display error if no file is specified
        loadingContainer.style.display = 'none';
        errorContainer.style.display = 'block';
        errorMessage.textContent = 'Please select a file.';
    }
});
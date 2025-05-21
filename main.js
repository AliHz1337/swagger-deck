document.addEventListener('DOMContentLoaded', function () {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const fileList = document.getElementById('file-list');
    const emptyState = document.getElementById('empty-state');
    const uploadButton = document.getElementById('upload-button');

    //=======================================================================
    // Handle file input button click
    //=======================================================================
    uploadButton.addEventListener('click', function () {
        fileInput.click();
    });

    //=======================================================================
    // Handle file selection
    //=======================================================================
    fileInput.addEventListener('change', handleFileSelect);

    //=======================================================================
    // Handle drag and drop events
    //=======================================================================
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
        uploadArea.addEventListener(event, handleDragDrop);
    });

    function handleDragDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        if (event.type === 'dragover') {
            uploadArea.classList.add('drag-over');
        } else {
            uploadArea.classList.remove('drag-over');
        }

        if (event.type === 'drop' && event.dataTransfer.files.length > 0) {
            const files = event.dataTransfer.files;
            handleFiles(files);
        }
    }

    function handleFileSelect(event) {
        const files = event.target.files;
        handleFiles(files);
    }

    function handleFiles(files) {
        if (files.length > 0) {
            emptyState.style.display = 'none';
            Array.from(files).forEach(file => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${file.name}</td>
                    <td>${formatSize(file.size)}</td>
                    <td>${new Date().toLocaleString()}</td>
                    <td>
                        <button class="btn btn-primary action-btn view-btn" onclick="viewFile('${file.name}')">View</button>
                        <button class="btn btn-danger action-btn delete-btn" onclick="deleteFile('${file.name}')">Delete</button>
                    </td>
                `;
                fileList.appendChild(row);
            });

            uploadFiles(files);
            updateStats(files);
        } else {
            emptyState.style.display = 'block';
        }
    }

    //=======================================================================
    // Function to delete a file
    //=======================================================================
    window.deleteFile = function (fileName) {
        const params = new URLSearchParams();
        params.append('action', 'delete');
        params.append('file', fileName);

        fetch('functions.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
        })
            .then(response => response.text())
            .then(result => {
                if (result === 'success') {
                    // alert('File deleted successfully');
                    loadFiles();
                } else {
                    alert('Error deleting file');
                    console.log(result);
                }
            })
            .catch(error => {
                alert('Server error');
                console.log(error);
            });
    };

    // Function to view a file
    window.viewFile = function (fileName) {
        window.location.href = `swagger.html?file=${encodeURIComponent(fileName)}`;
    }

    //=======================================================================
    // Function to update statistics
    //=======================================================================
    function updateStats() {
        const allFiles = fileList.getElementsByTagName('tr');
        const totalFilesElement = document.getElementById('total-files');
        const totalSizeElement = document.getElementById('total-size');
        const lastUploadElement = document.getElementById('last-upload');

        totalFilesElement.textContent = allFiles.length;

        let totalSize = 0;
        let lastUploadTime = 0;

        Array.from(allFiles).forEach(row => {
            const sizeText = row.cells[1].textContent;
            const size = parseSize(sizeText);
            totalSize += size;

            const uploadTime = new Date(row.cells[2].textContent).getTime();
            if (uploadTime > lastUploadTime) {
                lastUploadTime = uploadTime;
            }
        });

        totalSizeElement.textContent = formatSize(totalSize);

        if (lastUploadTime) {
            lastUploadElement.textContent = new Date(lastUploadTime).toLocaleString();
        } else {
            lastUploadElement.textContent = '-';
        }
    }

    //=======================================================================
    // Function to parse size from formatted string
    //=======================================================================
    function parseSize(sizeText) {
        const units = {
            'bytes': 1,
            'KB': 1024,
            'MB': 1024 * 1024
        };
        const [value, unit] = sizeText.split(' ');
        return parseFloat(value) * units[unit];
    }

    // Function to format file size
    function formatSize(bytes) {
        if (bytes < 1024) return bytes + ' bytes';
        const kb = bytes / 1024;
        if (kb < 1024) return kb.toFixed(2) + ' KB';
        const mb = kb / 1024;
        return mb.toFixed(2) + ' MB';
    }

    //=======================================================================
    // Function to upload files
    //=======================================================================
    function uploadFiles(files) {
        const formData = new FormData();
        formData.append('action', 'upload');
        Array.from(files).forEach(file => formData.append('file', file));

        fetch('functions.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.text())
            .then(result => {
                if (result === 'success') {
                    // alert('Files uploaded successfully');
                    loadFiles();
                } else {
                    // alert('Error uploading file');
                    alert(result)
                }
            })
            .catch(error => {
                alert(error);
            });
    }

    //=======================================================================
    // Function to load files
    //=======================================================================
    function loadFiles() {
        const params = new URLSearchParams();
        params.append('action', 'list');

        fetch('functions.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
        })
            .then(response => response.json())
            .then(data => {
                fileList.innerHTML = '';
                if (data.files.length > 0) {
                    emptyState.style.display = 'none';
                    data.files.forEach(file => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                        <td>${file.name}</td>
                        <td>${formatSize(file.size)}</td>
                        <td>${new Date(file.mtime * 1000).toLocaleString()}</td>
                        <td>
                            <button class="btn btn-primary action-btn view-btn" onclick="viewFile('${file.name}')">View</button>
                            <button class="btn btn-danger action-btn delete-btn" onclick="deleteFile('${file.name}')">Delete</button>
                        </td>
                    `;
                        fileList.appendChild(row);
                    });
                    updateStats();
                } else {
                    emptyState.style.display = 'block';
                    updateStats()
                }
            })
            .catch(error => {
                alert(error);
            });
    }

    //=======================================================================
    // Initial load of files
    //=======================================================================
    loadFiles();
});
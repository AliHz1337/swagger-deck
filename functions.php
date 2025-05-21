<?php

//=======================================================================
// Set PHP configurations for file upload limits
//=======================================================================
ini_set('upload_max_filesize', '50M');
ini_set('post_max_size', '50M');

//=======================================================================
// Define the target directory for uploaded files
//=======================================================================
$target_dir = __DIR__ . "/json_files/";

//=======================================================================
// Ensure the target directory exists
//=======================================================================
if (!file_exists($target_dir)) {
    mkdir($target_dir, 0777, true);
}

//=======================================================================
// Function to sanitize file names
//=======================================================================
function sanitize_filename($filename)
{
    return preg_replace("/[^a-zA-Z0-9_\-\.]/", "", basename($filename));
}

//=======================================================================
// Function to check MIME type
//=======================================================================
function is_valid_mime($tmp_name)
{
    $allowed_mime = ["application/json", "text/plain"];
    $mime = mime_content_type($tmp_name);
    return in_array($mime, $allowed_mime, true);
}

//=======================================================================
// Function to upload a file
//=======================================================================
function upload_file()
{
    global $target_dir;

    if (!isset($_FILES["file"])) {
        exit("No file uploaded.");
    }

    $filename = sanitize_filename($_FILES["file"]["name"]);
    $target_file = realpath($target_dir) . DIRECTORY_SEPARATOR . $filename;

    $fileType = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

    // Check file extension
    if (!in_array($fileType, ["json", "txt"])) {
        exit("Only JSON and TXT files are allowed.");
    }

    // Check MIME type
    if (!is_valid_mime($_FILES["file"]["tmp_name"])) {
        exit("Invalid file type.");
    }

    // Check file size
    if ($_FILES["file"]["size"] > 50000000) {
        exit("File is too large.");
    }

    if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
        exit("success");
    } else {
        exit("Error saving the file.");
    }
}

//=======================================================================
// Function to download a file
//=======================================================================
function download_file()
{
    global $target_dir;

    $file = isset($_POST['file']) ? sanitize_filename($_POST['file']) : '';
    $filePath = realpath($target_dir . $file);

    if (!$filePath || strpos($filePath, realpath($target_dir)) !== 0) {
        exit("Invalid file request.");
    }

    if (file_exists($filePath) && is_file($filePath)) {
        header('Content-Description: File Transfer');
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="' . basename($filePath) . '"');
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-Length: ' . filesize($filePath));

        readfile($filePath);
        exit;
    } else {
        exit("File not found.");
    }
}

//=======================================================================
// Function to delete a file
//=======================================================================
function delete_file()
{
    global $target_dir;

    $file = isset($_POST['file']) ? sanitize_filename($_POST['file']) : '';
    $filePath = realpath($target_dir . $file);

    if (!$filePath || strpos($filePath, realpath($target_dir)) !== 0) {
        exit("Invalid file request.");
    }

    if (file_exists($filePath) && is_file($filePath)) {
        if (unlink($filePath)) {
            exit("success");
        } else {
            exit("Error deleting the file.");
        }
    } else {
        exit("File not found.");
    }
}

//=======================================================================
// Function to check if a file exists
//=======================================================================
function file_exists_check()
{
    global $target_dir;

    header('Content-Type: application/json');

    $file = isset($_POST['file']) ? sanitize_filename($_POST['file']) : '';
    $filePath = realpath($target_dir . $file);

    if (!$filePath || strpos($filePath, realpath($target_dir)) !== 0) {
        exit(json_encode(["exists" => false]));
    }

    exit(json_encode(["exists" => file_exists($filePath) && is_file($filePath)]));
}

//=======================================================================
// Function to list all files
//=======================================================================
function list_files()
{
    global $target_dir;

    header('Content-Type: application/json');

    $files = [];
    $totalSize = 0;
    $lastUpload = null;

    if ($handle = opendir($target_dir)) {
        while (($entry = readdir($handle)) !== false) {
            if ($entry !== "." && $entry !== "..") {
                $filePath = $target_dir . $entry;
                if (is_file($filePath) && in_array(strtolower(pathinfo($entry, PATHINFO_EXTENSION)), ["json", "txt"])) {
                    $fileSize = filesize($filePath);
                    $fileMtime = filemtime($filePath);

                    $files[] = [
                        "name" => $entry,
                        "size" => $fileSize,
                        "mtime" => $fileMtime
                    ];

                    $totalSize += $fileSize;
                    $lastUpload = max($lastUpload ?? 0, $fileMtime);
                }
            }
        }
        closedir($handle);
    }

    usort($files, fn($a, $b) => $b['mtime'] - $a['mtime']);

    exit(json_encode([
        "files" => $files,
        "totalSize" => $totalSize,
        "lastUpload" => $lastUpload ? date("Y-m-d H:i:s", $lastUpload) : null
    ]));
}

//=======================================================================
// Main logic to determine which function to call
//=======================================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    switch ($_POST['action']) {
        case 'list':
            list_files();
            break;
        case 'exists':
            file_exists_check();
            break;
        case 'upload':
            upload_file();
            break;
        case 'delete':
            delete_file();
            break;
        case 'download':
            download_file();
            break;
        default:
            exit("Invalid action.");
    }
} else {
    exit("No action specified.");
}

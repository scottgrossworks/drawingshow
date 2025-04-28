<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Define target directory (using actual web path)
$target_dir = dirname(__FILE__);
$json_file = $target_dir . '/all_vids.json';

// Debug information
echo "Current working directory: " . getcwd() . "\n";
echo "Target directory: " . $target_dir . "\n";
echo "JSON file path: " . $json_file . "\n";

// More detailed directory/file checks
echo "Directory exists?: " . (is_dir($target_dir) ? 'Yes' : 'No') . "\n";
echo "Directory writable?: " . (is_writable($target_dir) ? 'Yes' : 'No') . "\n";
echo "PHP process user: " . get_current_user() . "\n";
echo "PHP process ID: " . getmypid() . "\n";

$video_extensions = ['mp4', 'avi', 'mkv'];
$videos = [];
$index = 1;

// Scan directory for video files
foreach (scandir($target_dir) as $file) {
    if (is_file($target_dir . '/' . $file)) {
        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        if (in_array($ext, $video_extensions)) {
            $videos[] = [
                'index' => $index++,
                'name'  => $file,
                'size_kb' => round(filesize($target_dir . '/' . $file) / 1024)
            ];
        }
    }
}

// Convert to JSON
$json_content = json_encode($videos, JSON_PRETTY_PRINT);
if ($json_content === FALSE) {
    die("ERROR: JSON encoding failed\n");
}

// Direct file write with error checking
$result = file_put_contents($json_file, $json_content);
if ($result === FALSE) {
    die("ERROR: Could not write to file: $json_file\n" . 
        "Last PHP error: " . error_get_last()['message'] . "\n");
} else {
    echo "SUCCESS: Wrote " . $result . " bytes to $json_file\n";
    echo "File exists?: " . (file_exists($json_file) ? 'Yes' : 'No') . "\n";
    echo "File size: " . (file_exists($json_file) ? filesize($json_file) : 'N/A') . " bytes\n";
    echo "File permissions: " . substr(sprintf('%o', fileperms($json_file)), -4) . "\n";
}
?>
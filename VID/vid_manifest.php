<?php

$video_extensions = ['mp4', 'avi', 'mkv'];
$videos = [];
$index = 1;

// Scan current directory for video files
foreach (scandir('.') as $file) {
    if (is_file($file)) {
        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        if (in_array($ext, $video_extensions)) {
            $videos[] = [
                'index' => $index++,
                'name'  => $file,
                'size_kb' => round(filesize($file) / 1024)
            ];
        }
    }
}

// Write to all_vids.json
file_put_contents('all_vids.json', json_encode($videos, JSON_PRETTY_PRINT));

echo "SUCCESS!  Generated manifest: all_vids.json\n";
?>
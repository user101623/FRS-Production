import { useEffect, useState, useCallback } from "react";

export default function useVideoStream(username) {
    const [imgSrc, setImgSrc] = useState(`http://127.0.0.1:5000/success/${username}`);

    // Define updateStoppedStatus outside of useEffect to avoid scope issues
    const updateStoppedStatus = useCallback((isStopped) => {
        console.log("Updating status");
        fetch('http://127.0.0.1:5000/update_streaming_status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stopped: isStopped }),
        })
        .then(response => response.json())
        .then(data => console.log('Streaming status updated:', data))
        .catch(error => console.error('Error updating streaming status:', error));
    }, []);

    // Stop the video stream and reset imgSrc
    const clearVideoStream = useCallback(() => {
        console.log("Clearing video stream");
        const videoStream = document.getElementById('videoStream');
        if (videoStream) {
            videoStream.src = ""; // Stop the stream by clearing the src attribute
            console.log('Video stream cleared.');
            updateStoppedStatus(true); // Update the status to stopped
        }
    }, [updateStoppedStatus])

    useEffect(() => {
        // Start streaming when component mounts
        setImgSrc(`http://127.0.0.1:5000/success/${username}`);
        console.log("UseEffect started");

        // Function to check streaming data
        const checkStreamingData = () => {
            console.log('Checking streaming data');
            fetch('http://127.0.0.1:5000/static/json/streaming_data.json')
                .then((response) => response.json())
                .then((json) => {
                    console.log(json.stopped);
                    if (json.stopped) {
                        clearVideoStream(); // Stop the video if "stopped" is true
                        clearInterval(intervalID); // Stop checking
                    }
                });
        }

        // Start checking the streaming data periodically
        const intervalID = setInterval(checkStreamingData, 1000);

        // Cleanup on component unmount
        return () => {
            console.log("Returning");
            // clearVideoStream();
            clearInterval(intervalID); // Clear interval
        };
    }, [username, clearVideoStream]); // Add clearVideoStream as a dependency

    return { imgSrc, clearVideoStream };
}

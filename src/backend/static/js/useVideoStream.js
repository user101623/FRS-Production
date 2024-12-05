import { useEffect, useState, useCallback } from "react";

export default function useVideoStream(username) {
    const [imgSrc, setImgSrc] = useState(`http://127.0.0.1:5000/success/${username}`);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const updateStoppedStatus = useCallback((isStopped) => {
        fetch('http://127.0.0.1:5000/update_streaming_status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stopped: isStopped }),
        })
        .then(response => response.json())
        .then(data => console.log('Streaming status updated:', data))
        .catch(error => console.error('Error updating streaming status:', error));
    }, []);

    const clearVideoStream = useCallback(() => {
        const videoStream = document.getElementById('videoStream');
        if (videoStream) {
            videoStream.src = "";
            updateStoppedStatus(true);
        }
    }, [updateStoppedStatus]);

    useEffect(() => {
        setImgSrc(`http://127.0.0.1:5000/success/${username}`);

        const checkStreamingData = () => {
            fetch('http://127.0.0.1:5000/static/json/streaming_data.json')
                .then((response) => response.json())
                .then((json) => {
                    if (json.stopped) {
                        clearVideoStream();
                        setIsModalOpen(true); // Trigger the modal when stopped is true
                    }
                });
        };

        const intervalID = setInterval(checkStreamingData, 1000);

        return () => {
            clearInterval(intervalID);
        };
    }, [username, clearVideoStream]);

    return { imgSrc, clearVideoStream, isModalOpen, setIsModalOpen };
}
import React from 'react';

export default function VideoModal({ videoUrl, onClose }) {
    if (!videoUrl) return null;

    // Normalize youtube or standard link
    const getEmbedUrl = (url) => {
        if (!url) return '';
        if (url.includes('youtube.com/watch?v=')) {
            return url.replace('watch?v=', 'embed/');
        }
        if (url.includes('youtu.be/')) {
            const id = url.split('youtu.be/')[1]?.split('?')[0];
            return `https://www.youtube.com/embed/${id}?autoplay=1`;
        }
        if (url.includes('vimeo.com/')) {
            const id = url.split('vimeo.com/')[1]?.split('?')[0];
            return `https://player.vimeo.com/video/${id}?autoplay=1`;
        }
        return url;
    };

    const isDirectVideo = videoUrl.match(/\.(mp4|webm|ogg)$/i);
    const embedUrl = getEmbedUrl(videoUrl);

    return (
        <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center"
            style={{ zIndex: 99999 }}
            onClick={onClose}
        >
            <div
                className="bg-black p-2 rounded-3 shadow-lg position-relative"
                style={{ width: '90%', maxWidth: '850px' }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    className="btn btn-sm btn-light position-absolute top-0 end-0 m-2 rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: '32px', height: '32px', zIndex: 10 }}
                    onClick={onClose}
                    aria-label="Close"
                >
                    <i className="fas fa-times"></i>
                </button>

                <div className="ratio ratio-16x9">
                    {isDirectVideo ? (
                        <video controls autoPlay src={embedUrl} className="w-100 h-100 rounded">
                            Your browser does not support video playback.
                        </video>
                    ) : (
                        <iframe
                            src={embedUrl}
                            title="Course Video Preview"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="rounded"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

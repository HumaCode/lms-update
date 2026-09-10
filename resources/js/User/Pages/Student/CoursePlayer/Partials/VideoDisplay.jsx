import React from 'react';

export default function VideoDisplay({ activeLesson, isTheaterMode = false, toggleTheaterMode }) {
    if (!activeLesson) {
        return (
            <div
                className="video_holder d-flex align-items-center justify-content-center bg-black text-muted"
                style={{
                    height: isTheaterMode ? 'min(82vh, 760px)' : '520px',
                    transition: 'height 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                <p>Select a lesson from curriculum to start learning</p>
            </div>
        );
    }

    const rawPath = activeLesson.file_path || activeLesson.url || '';
    const storage = activeLesson.storage || '';
    const fileType = activeLesson.file_type || 'video';

    const isYouTube = storage === 'youtube' || rawPath.includes('youtube.com') || rawPath.includes('youtu.be');
    const isVimeo = storage === 'vimeo' || rawPath.includes('vimeo.com');

    const getYouTubeEmbedUrl = (urlStr) => {
        if (!urlStr) return '';
        if (urlStr.includes('youtube.com/embed/')) return urlStr;
        const match = urlStr.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
        return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : urlStr;
    };

    const getVimeoEmbedUrl = (urlStr) => {
        if (!urlStr) return '';
        if (urlStr.includes('player.vimeo.com')) return urlStr;
        const match = urlStr.match(/vimeo\.com\/(?:video\/)?(\d+)/);
        return match ? `https://player.vimeo.com/video/${match[1]}?autoplay=1` : urlStr;
    };

    const getDirectVideoUrl = (pathStr) => {
        if (!pathStr) return '';
        if (pathStr.startsWith('http://') || pathStr.startsWith('https://')) {
            return pathStr;
        }
        return pathStr.startsWith('/') ? pathStr : `/${pathStr}`;
    };

    return (
        <div
            className="video_holder bg-black overflow-hidden position-relative"
            style={{
                width: '100%',
                height: isTheaterMode ? 'min(82vh, 760px)' : '520px',
                minHeight: isTheaterMode ? '540px' : '400px',
                transition: 'height 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
        >
            {/* Floating Theater Mode Toggle on Video Header */}
            {toggleTheaterMode && (
                <button
                    type="button"
                    onClick={toggleTheaterMode}
                    className="btn btn-dark btn-sm rounded-pill d-inline-flex align-items-center gap-1 shadow"
                    style={{
                        position: 'absolute',
                        top: '14px',
                        right: '14px',
                        zIndex: 20,
                        backgroundColor: 'rgba(15, 23, 42, 0.75)',
                        backdropFilter: 'blur(6px)',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: 500,
                        padding: '5px 12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                    }}
                    title={isTheaterMode ? 'Mode Standar (T)' : 'Mode Teater (T)'}
                >
                    <i className={isTheaterMode ? "fas fa-compress" : "fas fa-film"} style={{ fontSize: '12px' }}></i>
                    <span className="d-none d-sm-inline">{isTheaterMode ? 'Mode Standar' : 'Mode Teater'}</span>
                </button>
            )}
            {fileType === 'video' || isYouTube || isVimeo ? (
                isYouTube ? (
                    <iframe
                        src={getYouTubeEmbedUrl(rawPath)}
                        title={activeLesson.title}
                        className="w-100 h-100"
                        style={{ border: 0 }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                ) : isVimeo ? (
                    <iframe
                        src={getVimeoEmbedUrl(rawPath)}
                        title={activeLesson.title}
                        className="w-100 h-100"
                        style={{ border: 0 }}
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                ) : rawPath ? (
                    <video
                        controls
                        autoPlay
                        key={activeLesson.id}
                        className="w-100 h-100 object-fit-contain"
                        src={getDirectVideoUrl(rawPath)}
                    ></video>
                ) : (
                    <div className="d-flex flex-column align-items-center justify-content-center h-100 text-white p-4 text-center">
                        <i className="fas fa-play-circle fs-1 text-primary mb-3"></i>
                        <h5>{activeLesson.title}</h5>
                        <p className="text-white-50 small">No video source provided for this lesson.</p>
                    </div>
                )
            ) : (
                <div className="d-flex flex-column align-items-center justify-content-center h-100 text-white p-4 text-center">
                    <i className="fas fa-file-alt fs-1 text-info mb-3"></i>
                    <h4>{activeLesson.title}</h4>
                    <p className="text-white-50 small mb-3">Document / Reading Material</p>
                    {rawPath && (
                        <a
                            href={route('student.file-download', activeLesson.id)}
                            className="table_btn text-decoration-none"
                        >
                            <i className="fas fa-download me-2"></i> Download Material
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}

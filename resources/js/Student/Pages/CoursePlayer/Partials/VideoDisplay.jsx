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

    const isResourceLesson = activeLesson.lesson_type === 'resource';
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
                height: isResourceLesson ? 'auto' : (isTheaterMode ? 'min(82vh, 760px)' : '520px'),
                minHeight: isResourceLesson ? '320px' : (isTheaterMode ? '540px' : '400px'),
                padding: isResourceLesson ? '3rem 1rem' : 0,
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
            {activeLesson.lesson_type === 'resource' ? (
                <div className="d-flex flex-column align-items-center justify-content-center h-100 text-white p-4 text-center">
                    <div className="rounded-circle bg-info bg-opacity-25 p-4 mb-3">
                        <i className="fas fa-folder-open text-info display-4"></i>
                    </div>
                    <h4 className="fw-bold text-white mb-2">{activeLesson.title}</h4>
                    <p className="text-white-50 small mb-4" style={{ maxWidth: '500px' }}>
                        {activeLesson.description || 'Materi ini berisi file resource yang dapat diunduh untuk pembelajaran.'}
                    </p>

                    {activeLesson.resources_list && activeLesson.resources_list.length > 0 ? (
                        <div className="d-flex flex-wrap justify-content-center gap-2" style={{ maxWidth: '650px' }}>
                            {activeLesson.resources_list.map((res) => (
                                <a
                                    key={res.id}
                                    href={res.download_url}
                                    download={res.file_name}
                                    className="btn btn-primary px-3 py-2 d-inline-flex align-items-center gap-2 shadow-sm rounded-3 text-white text-decoration-none"
                                >
                                    <i className="fas fa-download text-white"></i>
                                    <span className="text-white fw-medium">{res.file_name}</span>
                                    <span className="badge bg-white text-primary small ms-1 fw-bold">{res.human_size}</span>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <p className="text-white-50 small fst-italic">Belum ada file resource yang dilampirkan.</p>
                    )}
                </div>
            ) : (fileType === 'video' || isYouTube || isVimeo) ? (
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

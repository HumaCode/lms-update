import React from 'react';
import { timeAgo } from '@/Utils/formatters';

export default function AnnouncementsTab({ course, initialAnnouncements = [] }) {
    const announcements = initialAnnouncements;

    if (!announcements || announcements.length === 0) {
        return (
            <div className="py-4 text-center">
                <div className="video_announcement my-4">
                    <h3 className="fw-bold text-dark mb-2">No announcements posted yet</h3>
                    <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '15px' }}>
                        The instructor hasn’t added any announcements to this course yet. Announcements are used to inform you of updates or additions to the course.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="py-3 px-2">
            <h5 className="fw-bold text-dark mb-4">Pengumuman Kursus ({announcements.length})</h5>
            <div className="vstack gap-4">
                {announcements.map((item) => (
                    <div key={item.id} className="card border rounded-3 p-4 shadow-sm bg-white">
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <div
                                className="rounded-circle bg-purple text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                                style={{ width: '48px', height: '48px', backgroundColor: '#6f42c1', fontSize: '18px' }}
                            >
                                {(item.user?.name || 'I').charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h6 className="fw-bold text-dark mb-0">{item.user?.name || 'Instruktur'}</h6>
                                <span className="text-muted small">Diposting {timeAgo(item.created_at)}</span>
                            </div>
                        </div>
                        <h5 className="fw-bold text-dark mb-2">{item.title}</h5>
                        <div
                            className="text-secondary"
                            style={{ lineHeight: '1.6', fontSize: '15px' }}
                            dangerouslySetInnerHTML={{ __html: item.content }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

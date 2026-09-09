-- Data dump converted from database.sql for PostgreSQL (lms_db)

-- 1. Admins
INSERT INTO admins (id, name, email, email_verified_at, password, remember_token, created_at, updated_at)
VALUES (1, 'Admin', 'admin@gmail.com', NULL, '$2y$12$RTxSTA0bti7Zd5wCqWyqCuC45.5FckPOt69raE3uguNRPk/LgLjya', NULL, '2024-09-11 00:13:30', '2024-09-11 00:13:30')
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    password = EXCLUDED.password;

-- 2. Users
INSERT INTO users (id, role, image, name, headline, email, bio, gender, document, email_verified_at, password, facebook, x, linkedin, website, github, approve_status, login_as, remember_token, created_at, updated_at)
VALUES 
	(1, 'student', '/uploads/educore_66e68c56961f2.png', 'Jhon Deo', 'Developer', 'user@gmail.com', 'test about me', 'male', '', NULL, '$2y$12$U490487AQYzp/vbCW1Hh.e8tuyDhfMKray2kn0AppKdtgZbGx7oNa', 'https://facebook.com', NULL, NULL, NULL, NULL, 'approved', NULL, NULL, NULL, '2024-09-15 01:27:18'),
	(2, 'instructor', '/default-files/avatar.png', 'Instructor', 'Developer', 'instructor@gmail.com', NULL, NULL, NULL, NULL, '$2y$12$Z61sabXCBObEiBsn8wX7VurLBQKMAo5np.pZVuHZhre0NedruVmJW', NULL, NULL, NULL, NULL, NULL, 'approved', NULL, NULL, NULL, '2024-09-15 03:31:02'),
	(3, 'student', '/default-files/avatar.png', 'Anika Kirk', NULL, 'qolerewipa@mailinator.com', NULL, NULL, NULL, NULL, '$2y$12$TSVETlRhI6H5MxiKqVhd9O0U7iogcWnRZQRn3j5utAhSHT1zodXaO', NULL, NULL, NULL, NULL, NULL, 'approved', NULL, NULL, '2024-09-11 00:16:34', '2024-09-11 00:16:34'),
	(4, 'instructor', '/default-files/avatar.png', 'Fay Frederick', NULL, 'fukoxyfo@mailinator.com', NULL, NULL, NULL, NULL, '$2y$12$9sHqgCy6mBWL4jGjS2jNnOainnTUwd8KHPTmyrIl/m4c3hbicPw5S', NULL, NULL, NULL, NULL, NULL, 'approved', NULL, NULL, '2024-09-11 00:26:38', '2024-09-11 05:24:16'),
	(5, 'instructor', '/default-files/avatar.png', 'Cade Goodman', NULL, 'giperi@mailinator.com', NULL, NULL, '/uploads/educore_66e14aa220248.pdf', NULL, '$2y$12$RIX/vPZ8tNw2Tqv6.5otF.yJrmArTA.6mQIpmesNiRFzmt9zRSpey', NULL, NULL, NULL, NULL, NULL, 'approved', NULL, NULL, '2024-09-11 01:45:38', '2024-09-12 00:09:10'),
	(6, 'student', '/default-files/avatar.png', 'Ivory Sykes', NULL, 'xeji@mailinator.com', NULL, NULL, '/uploads/educore_66e28f99c04e8.png', NULL, '$2y$12$T9IMjI3Jr0WJyLSEKra8pOC/CLmAwU2KwTvyinU5Kygkf7fQJn7xi', NULL, NULL, NULL, NULL, NULL, 'pending', NULL, NULL, '2024-09-12 00:52:10', '2024-09-12 00:52:10')
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    password = EXCLUDED.password,
    role = EXCLUDED.role,
    approve_status = EXCLUDED.approve_status;

-- 3. Course Languages
INSERT INTO course_languages (id, name, slug, created_at, updated_at)
VALUES 
	(6, 'English', 'english', '2024-09-19 06:12:53', '2024-09-19 06:12:53'),
	(7, 'Turkish', 'turkish', '2024-09-19 06:13:03', '2024-09-19 06:13:03'),
	(8, 'Arabic', 'arabic', '2024-09-19 06:13:11', '2024-09-19 06:13:11')
ON CONFLICT (id) DO NOTHING;

-- 4. Course Levels
INSERT INTO course_levels (id, name, slug, created_at, updated_at)
VALUES 
	(3, 'test 1', 'test-1', '2024-09-16 05:36:56', '2024-09-16 05:36:56'),
	(4, 'test 2', 'test-2', '2024-09-16 05:37:05', '2024-09-16 05:37:05'),
	(5, 'test 3', 'test-3', '2024-09-16 05:37:13', '2024-09-16 05:37:13')
ON CONFLICT (id) DO NOTHING;

-- 5. Course Categories
INSERT INTO course_categories (id, image, icon, name, slug, parent_id, show_at_trending, status, created_at, updated_at)
VALUES 
	(8, '/uploads/educore_66e9343f55cc9.png', 'Quasi magni sit dist', 'Sydney Owen', 'sydney-owen', NULL, true, true, '2024-09-17 01:48:15', '2024-09-17 01:48:15'),
	(9, '/uploads/educore_66e934b0599c1.png', 'fasf asfasdf', 'Web Development', 'web-development', NULL, true, true, '2024-09-17 01:50:08', '2024-09-17 05:06:51'),
	(10, '/uploads/educore_66e953c4b8ce7.png', 'ti ti-olympics', 'Grapics Design', 'grapics-design', NULL, true, true, '2024-09-17 04:02:44', '2024-09-17 04:02:44'),
	(12, NULL, 'ti ti-code', 'HTML', 'html', 9, true, true, '2024-09-18 01:39:34', '2024-09-18 01:41:21'),
	(13, NULL, 'ti ti-brand-figma', 'Figma Design', 'figma-design', 10, true, true, '2024-09-18 01:43:49', '2024-09-18 01:43:49')
ON CONFLICT (id) DO NOTHING;

-- 6. Courses
INSERT INTO courses (id, instructor_id, category_id, course_type, title, slug, seo_description, duration, time_zone, thumbnail, demo_video_storage, demo_video_source, description, capacity, price, discount, certificate, qna, message_for_reviewer, is_approved, status, course_level_id, course_language_id, created_at, updated_at)
VALUES 
	(1, 2, 12, 'course', 'Veniam aliquam qui', 'veniam-aliquam-qui', 'Eu in aut autem dist', '1333', NULL, '/uploads/educore_66ebd38426b02.png', 'upload', 'https://edu-core.test/files/2/test/Screenshot_55.png', 'Voluptate maiores qu', NULL, 632, NULL, true, false, NULL, 'pending', 'draft', 5, 7, '2024-09-19 01:32:20', '2024-09-22 21:59:53'),
	(2, 2, NULL, 'course', 'Autem illo repudiand', 'autem-illo-repudiand', 'Dolores sit ab ipsum', NULL, NULL, '/uploads/educore_66ebed6522b25.png', NULL, NULL, 'Doloremque ut esse', NULL, 594, NULL, true, true, NULL, 'pending', 'draft', NULL, NULL, '2024-09-19 03:22:45', '2024-09-19 03:22:45'),
	(3, 2, NULL, 'course', 'A iste nostrum rerum', 'a-iste-nostrum-rerum', 'Quae sunt sit sapie', NULL, NULL, '/uploads/educore_66ebefc275563.png', NULL, NULL, 'Officia aliquid tota', NULL, 641, NULL, true, true, NULL, 'pending', 'draft', NULL, NULL, '2024-09-19 03:32:50', '2024-09-19 03:32:50'),
	(4, 2, NULL, 'course', 'A iste nostrum rerum', 'a-iste-nostrum-rerum', 'Quae sunt sit sapie', NULL, NULL, '/uploads/educore_66ebeff1ea7f5.png', NULL, NULL, 'Officia aliquid tota', NULL, 641, NULL, true, true, NULL, 'pending', 'draft', NULL, NULL, '2024-09-19 03:33:37', '2024-09-19 03:33:37'),
	(5, 2, NULL, 'course', 'Ut impedit quia qua', 'ut-impedit-quia-qua', 'Velit vel harum qui', NULL, NULL, '/uploads/educore_66ebf008d054d.png', NULL, NULL, 'Ipsum sint minim ne', NULL, 370, NULL, true, true, NULL, 'pending', 'draft', NULL, NULL, '2024-09-19 03:34:00', '2024-09-19 03:34:00'),
	(6, 2, NULL, 'course', 'Ut impedit quia qua', 'ut-impedit-quia-qua', 'Velit vel harum qui', NULL, NULL, '/uploads/educore_66ebf0622b142.png', NULL, NULL, 'Ipsum sint minim ne', NULL, 370, NULL, true, true, NULL, 'pending', 'draft', NULL, NULL, '2024-09-19 03:35:30', '2024-09-19 03:35:30'),
	(7, 2, 13, 'course', 'Est laborum Tempore', 'est-laborum-tempore', 'Perferendis non est', '3000', NULL, '/uploads/educore_66ef9a756d875.png', NULL, NULL, 'Voluptate sed fugiat', 100, 905, NULL, true, true, NULL, 'pending', 'draft', 3, 6, '2024-09-21 22:17:58', '2024-09-21 22:32:05'),
	(8, 2, 12, 'course', 'Test Course', 'test-course', 'test course', '3000', NULL, '/uploads/educore_66f0f002e8656.png', 'youtube', 'https://yt.com', 'this is a test description', NULL, 100, 90, true, true, NULL, 'pending', 'draft', 3, 6, '2024-09-22 22:35:15', '2024-09-23 22:47:32')
ON CONFLICT (id) DO NOTHING;

-- 7. Course Chapters
INSERT INTO course_chapters (id, title, instructor_id, course_id, "order", status, created_at, updated_at)
VALUES 
	(1, 'asfsadf', 2, 8, 1, true, '2024-09-23 01:32:14', '2024-09-23 01:32:14'),
	(2, 'Introduction', 2, 8, 2, true, '2024-09-23 23:26:33', '2024-09-23 23:26:33')
ON CONFLICT (id) DO NOTHING;

-- 8. Course Chapter Lessons
INSERT INTO course_chapter_lessions (id, title, slug, description, instructor_id, course_id, chapter_id, file_path, storage, volume, duration, file_type, downloadable, "order", is_preview, status, lesson_type, created_at, updated_at)
VALUES 
	(1, 'In ad ullam accusant', 'in-ad-ullam-accusant', 'Minima laborum esse', 2, 8, 1, 'fasdfasd', 'vimeo', NULL, 'Anim deserunt conseq', 'file', false, 1, true, true, 'lesson', '2024-09-24 05:55:47', '2024-09-24 05:55:47')
ON CONFLICT (id) DO NOTHING;

-- Reset PostgreSQL Sequences so subsequent inserts auto-increment properly
SELECT setval('admins_id_seq', (SELECT COALESCE(MAX(id), 1) FROM admins));
SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users));
SELECT setval('course_languages_id_seq', (SELECT COALESCE(MAX(id), 1) FROM course_languages));
SELECT setval('course_levels_id_seq', (SELECT COALESCE(MAX(id), 1) FROM course_levels));
SELECT setval('course_categories_id_seq', (SELECT COALESCE(MAX(id), 1) FROM course_categories));
SELECT setval('courses_id_seq', (SELECT COALESCE(MAX(id), 1) FROM courses));
SELECT setval('course_chapters_id_seq', (SELECT COALESCE(MAX(id), 1) FROM course_chapters));
SELECT setval('course_chapter_lessions_id_seq', (SELECT COALESCE(MAX(id), 1) FROM course_chapter_lessions));

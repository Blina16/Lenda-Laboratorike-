const db = require('../db');

async function getAllCourses() {
  const sql = 'SELECT id, name, description, category, created_at, updated_at FROM courses ORDER BY name ASC';
  return db.query(sql);
}

async function getTutorsForCourse(courseId) {
  const sql = `
    SELECT t.id, t.first_name AS name, t.last_name AS surname, t.description AS bio, t.rate
    FROM tutors t
    INNER JOIN tutor_courses tc ON t.id = tc.tutor_id
    WHERE tc.course_id = ?
    ORDER BY t.first_name, t.last_name
  `;
  return db.query(sql, [courseId]);
}

async function getCoursesForTutor(tutorId) {
  const sql = `
    SELECT c.id, c.name, c.description, c.category 
    FROM courses c
    INNER JOIN tutor_courses tc ON c.id = tc.course_id
    WHERE tc.tutor_id = ?
    ORDER BY c.name ASC
  `;
  return db.query(sql, [tutorId]);
}

async function getCourseById(id) {
  const sql = 'SELECT id, name, description, category, created_at, updated_at FROM courses WHERE id = ?';
  const rows = await db.query(sql, [id]);
  return rows[0];
}

async function createCourse({ name, description = '', category = '' }) {
  const sql = 'INSERT INTO courses (name, description, category) VALUES (?, ?, ?)';
  return db.query(sql, [name, description, category]);
}

async function updateCourse(id, { name, description = '', category = '' }) {
  const sql = 'UPDATE courses SET name = ?, description = ?, category = ? WHERE id = ?';
  return db.query(sql, [name, description, category, id]);
}

async function deleteCourse(id) {
  const sql = 'DELETE FROM courses WHERE id = ?';
  return db.query(sql, [id]);
}

async function courseExists(id) {
  const sql = 'SELECT id FROM courses WHERE id = ?';
  const rows = await db.query(sql, [id]);
  return rows.length > 0;
}

async function assignCourseToTutor(tutorId, courseId) {
  const sql = 'INSERT INTO tutor_courses (tutor_id, course_id) VALUES (?, ?)';
  return db.query(sql, [tutorId, courseId]);
}

async function removeCourseFromTutor(tutorId, courseId) {
  const sql = 'DELETE FROM tutor_courses WHERE tutor_id = ? AND course_id = ?';
  return db.query(sql, [tutorId, courseId]);
}

module.exports = {
  getAllCourses,
  getTutorsForCourse,
  getCoursesForTutor,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  courseExists,
  assignCourseToTutor,
  removeCourseFromTutor,
};

const coursesModel = require('../models/coursesModel');

async function getAllCourses(req, res) {
  try {
    const results = await coursesModel.getAllCourses();
    res.json(results);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ 
      error: 'DB_ERROR', 
      message: err.message || 'Failed to fetch courses',
      details: err 
    });
  }
}

async function getTutorsForCourse(req, res) {
  try {
    const { courseId } = req.params;
    const results = await coursesModel.getTutorsForCourse(courseId);
    res.json(results);
  } catch (err) {
    console.error('Error fetching tutors for course:', err);
    res.status(500).json({ error: 'DB_ERROR', message: err.message });
  }
}

async function getCoursesForTutor(req, res) {
  try {
    const { tutorId } = req.params;
    const results = await coursesModel.getCoursesForTutor(tutorId);
    res.json(results);
  } catch (err) {
    console.error('Error fetching tutor courses:', err);
    res.status(500).json({ error: 'DB_ERROR', message: err.message });
  }
}

async function getCourseById(req, res) {
  try {
    const { id } = req.params;
    if (id === 'tutor') {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Course not found' });
    }
    const course = await coursesModel.getCourseById(id);
    if (!course) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Course not found' });
    }
    res.json(course);
  } catch (err) {
    console.error('Error fetching course:', err);
    res.status(500).json({ error: 'DB_ERROR', message: err.message });
  }
}

async function createCourse(req, res) {
  const { name, description, category } = req.body;
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'Course name is required' });
  }
  try {
    const result = await coursesModel.createCourse({ name: name.trim(), description: description || '', category: category || '' });
    const newCourse = {
      id: result.insertId,
      name: name.trim(),
      description: description || '',
      category: category || '',
      created_at: new Date(),
      updated_at: new Date()
    };
    res.status(201).json(newCourse);
  } catch (err) {
    console.error('Error creating course:', err);
    if (err.code === 'ER_NO_SUCH_TABLE' || err.message?.includes("doesn't exist") || err.message?.includes('Table')) {
      return res.status(500).json({ 
        error: 'DB_ERROR', 
        message: 'Courses table does not exist. Please create it using the SQL in MySQL local.session.sql',
        details: err.message 
      });
    }
    if (err.code === 'ER_DUP_ENTRY' || err.message?.includes('unique_course_name')) {
      return res.status(400).json({ error: 'DUPLICATE_ERROR', message: 'A course with this name already exists' });
    }
    res.status(500).json({ 
      error: 'DB_ERROR', 
      message: err.message || 'Failed to create course',
      details: err.code || err.message 
    });
  }
}

async function updateCourse(req, res) {
  const { id } = req.params;
  const { name, description, category } = req.body;
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'Course name is required' });
  }
  try {
    await coursesModel.updateCourse(id, { name: name.trim(), description: description || '', category: category || '' });
    const updated = await coursesModel.getCourseById(id);
    if (!updated) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Course not found' });
    }
    res.json(updated);
  } catch (err) {
    console.error('Error updating course:', err);
    if (err.code === 'ER_DUP_ENTRY' || err.message?.includes('unique_course_name')) {
      return res.status(400).json({ error: 'DUPLICATE_ERROR', message: 'A course with this name already exists' });
    }
    res.status(500).json({ error: 'DB_ERROR', message: err.message });
  }
}

async function deleteCourse(req, res) {
  const { id } = req.params;
  try {
    const exists = await coursesModel.courseExists(id);
    if (!exists) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Course not found' });
    }
    await coursesModel.deleteCourse(id);
    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (err) {
    console.error('Error deleting course:', err);
    res.status(500).json({ error: 'DB_ERROR', message: err.message });
  }
}

async function assignCourseToTutor(req, res) {
  try {
    const { tutorId, courseId } = req.params;
    await coursesModel.assignCourseToTutor(tutorId, courseId);
    res.status(201).json({ success: true, message: 'Course assigned to tutor' });
  } catch (err) {
    console.error('Error assigning course:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'DUPLICATE_ERROR', message: 'Course already assigned to this tutor' });
    }
    res.status(500).json({ error: 'DB_ERROR', message: err.message });
  }
}

async function removeCourseFromTutor(req, res) {
  try {
    const { tutorId, courseId } = req.params;
    await coursesModel.removeCourseFromTutor(tutorId, courseId);
    res.json({ success: true, message: 'Course removed from tutor' });
  } catch (err) {
    console.error('Error removing course:', err);
    res.status(500).json({ error: 'DB_ERROR', message: err.message });
  }
}

module.exports = {
  getAllCourses,
  getTutorsForCourse,
  getCoursesForTutor,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  assignCourseToTutor,
  removeCourseFromTutor,
};

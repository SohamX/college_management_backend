import prisma from '../../config/prisma.js';

const createSubject = async (data) => {
  try {
    const subjects = await prisma.subjects.create({
      data,
    });
    return subjects;
  } catch (error) {
    return error;
  }
};

//needs schema work regarding storing subject ids in students before usage
const updateStudents = async (data) => {
  try {
    const subjects = await prisma.students.update({
      where: {
        roll_no: data.roll_no,
      },
      data,
    });
    return subjects;
  } catch (error) {
    return error;
  }
};
//-------------------*-------------------//

const upsertModule = async (data) => {
  try {
    if (data.module_id == null || data.module_id == undefined) {
      const modules = await prisma.modules.create({
        data,
      });
      return modules;
    } else {
      const modules = await prisma.modules.update({
        where: {
          module_id: data.module_id,
        },
        data,
      });
      return modules;
    }
  } catch (error) {
    return error;
  }
};

const upsertReadingMaterial = async (data) => {
  try {
    if (
      data.reading_material_id == null ||
      data.reading_material_id == undefined
    ) {
      const reading = await prisma.reading_material.create({
        data,
      });
      return reading;
    } else {
      const reading = await prisma.reading_material.update({
        where: {
          reading_material_id: data.reading_material_id,
        },
        data,
      });
      return reading;
    }
  } catch (error) {
    return error;
  }
};

const addSubjectToStudent = async (roll_no, newsubs) => {
  try {
    let { subjects } = await prisma.students.findUnique({
      select: {
        subjects: true,
      },
      where: {
        roll_no: roll_no,
      },
    });

    subjects = subjects ? JSON.parse(subjects) : [];

    newsubs.forEach((sub) => {
      subjects.push(sub);
    });

    await prisma.students.update({
      where: {
        roll_no: roll_no,
      },
      data: {
        subjects: JSON.stringify(subjects),
      },
    });

    return 'Subjects Added';
  } catch (error) {
    return error;
  }
};

const addSubjectToDept = async (students, newsubs) => {
  try {
    await students.forEach((student) => {
      addSubjectToStudent(student.roll_no, newsubs);
    });
    return `Subjects Added to ${students.length} Students`;
  } catch (error) {
    return error;
  }
};

const addSubjectToFaculty = async (email, newsubs) => {
  try {
    let subjects = await getFacultySubjects(email);

    newsubs.forEach((sub) => {
      subjects.push(sub);
    });

    await prisma.Faculty.update({
      where: {
        email: email,
      },
      data: {
        subjects: JSON.stringify(subjects),
      },
    });

    return 'Subjects Added';
  } catch (error) {
    return error;
  }
};

const getFacultySubjects = async (email) => {
  try {
    const { subjects } = await prisma.Faculty.findUnique({
      select: {
        subjects: true,
      },
      where: {
        email: email,
      },
    });

    return subjects ? JSON.parse(subjects) : [];

    // return subjects;
  } catch (error) {
    return error;
  }
};

export default {
  createSubject,
  updateStudents,
  upsertModule,
  upsertReadingMaterial,
  addSubjectToStudent,
  addSubjectToDept,
  addSubjectToFaculty,
  getFacultySubjects,
};

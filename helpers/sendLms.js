const axios = require('axios');
const moment = require('moment');

const sendDataToExternalAPI = async (data) => {
  try {
    const requestBody = {
      name: data['full_name'],
      email: data['contact.email'],
      phone: data['contact.phone'] || data['contact.alternate_phone'],
      course: data['education.course'] || '',
      sub_coursesID: data['customfields.enter_specialization'],
      adminID: data['customfields.university_name'],
      dob: moment(data['customfields.dob']).format('DD/MM/YYYY'),
      password: moment(data['customfields.dob']).format('DDMMYYYY'),
      status: data['customfields.status'],
      yearsOrSemester: ['1st_Semester'],
      username: data['lead_id'],
      fathername: data['customfields.father_name'],
      mothername: data['customfields.mother_name'],
      sex: data['customfields.gender'],
      session_type: data['customfields.admission_type'],
      totalFee: data['customfields.total_course_fee'],
      semesterFee: data['customfields.paid_amount'],
      centreID: data['userFullname'],
    };

    console.log('requestBody:', requestBody); // Log the requestBody for debugging

    const response = await axios.post('https://spu.lmsonline.co/api/studentupdate_insert/', requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },

    });

    return response.data;
  } catch (error) {
    console.error('Error sending data to external API:', error.message);
    throw error;
  }
};

module.exports = {
  sendDataToExternalAPI,
};

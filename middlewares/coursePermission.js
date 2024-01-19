const validateCourseSpecializationMiddleware = (req, res, next) => {
  console.log('Received Request Payload:', req.body);

  // Define your fixed courses and corresponding specializations
  const fixedCourses = {
    BA: [
      'Education',
      'English',
      'Economics',
      'Geography',
      'History',
      'Political science',
      'General',
      'Sociology',
      'Journalism and Mass Communication ',
    ],
    BSC: [
      'Chemistry',
      'Physics',
      'Mathematics',
      'Microbiology',
      'Bio-technology',
      'Zoology',
      'Animation And Multimedia',
      'Interior Designing',
      'Fashion Technology',
      'Hotel Management ',
      'Medical Laboratory Technology',
      'Operation Theater Technology',
      'Radiology & Imaging Technology',
    ],
    BBA: ['Marketing', 'Human Resources Management', 'Finance', 'International Business'],
    BCOM: [''],
    BCA: [''],
    BSW: [''],
    BJMC: [''],
    MBA: [
      'Human resource Management',
      'Financial Planning and Analysis',
      'Marketing',
      'Finance',
      'Operation and Production Management',
      'International Marketing',
      'Health Care Management',
      'Information Technology',
      'Business Analytics & Intelligence',
      'Branding & Advertising',
      'Project Leadership Management',
      'Banking Management',
      'E-commerce Marketing & Management',
      'Mass Communication',
      'Digital Marketing',
      'Risk Management',
      'Business Leadership',
      'Strategic Management',
      'Enterpreneurship',
      'Media & Entertainment Management',
      'Foreign Trade & Global Business Management',
      'Investment Banking & Wealth Management',
      'Supply Chain Management',
    ],
    MA: [
      'Economics',
      'English',
      'Geography',
      'History',
      'Political Science',
      'Sociology',
      'Education',
      'Journalism And Mass Communication',
    ],
    MCOM: [''],
    MCA: [''],
    MSC: [
      'Chemistry',
      'Physics',
      'Mathematics',
      'It',
      'Computer Science',
      'Bio-technology',
      'Zoology',
      'Animation And Multimedia',
      'Interior Designing',
      'Fashion Technology',
      'Medical Laboratory Technology',
      'Optometry',
      'Radiology & Imaging Technology',
    ],
    MSW: [''],
    MLIS: [''],
    // Add more courses as needed
  };

  const { education, customfields } = req.body;
  const course = education?.course || customfields?.enter_specialization;
  let specialization = customfields?.enter_specialization;

  // Check if course is undefined or null
  if (!course) {
    return res.status(400).json({ error: 'Course is required' });
  }

  // Check if the course is in uppercase
  if (course !== course.toUpperCase()) {
    return res.status(400).json({ error: 'Course should be in uppercase' });
  }

  // Check if the course is in the fixedCourses list
  if (!fixedCourses[course]) {
    return res.status(400).json({ error: 'Invalid course' });
  }

  // If specialization is not valid, set it to the default ("General")
  if (!fixedCourses[course].includes(specialization)) {
    specialization = 'General';
  }

  // Update the specialization in the request body
  req.body.customfields.enter_specialization = specialization;

  // Continue to the next middleware or route handler
  next();
};

module.exports = validateCourseSpecializationMiddleware;

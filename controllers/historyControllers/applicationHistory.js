const { ApplicationHistory } = require('@/models/Application');

async function getStudentHistory(studentId) {
  try {
    const history = await ApplicationHistory.find({ applicationId: studentId })
      .populate({
        path: 'applicationId',
        match: { _id: studentId } // Filter only entries relevant to the specific student ID
      })
      .sort({ updatedAt: 'desc' })
      .exec();
    
    const filteredHistory = history.filter(entry => entry.applicationId); // Filter out null values if any
    const count = filteredHistory.length;

    return { history: filteredHistory, count };
  } catch (error) {
    console.error('Error fetching student history:', error.message);
    throw error;
  }
}

module.exports = {
  getStudentHistory,
};

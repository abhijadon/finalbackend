const Team = require('@/models/Team');

const paginatedList = async (Model, req, res) => {
  try {
    const user = req.user;
    const instituteName = req.query.instituteName;
    const universityName = req.query.universityName;
    const userId = req.query.userId;

    let query = { removed: false };

    if (instituteName) {
      query['customfields.institute_name'] = instituteName;
    }
    if (universityName) {
      query['customfields.university_name'] = universityName;
    }

    if (userId) {
      const team = await Team.findOne({ userId }).populate('teamMembers');

      if (team) {
        const userIds = team.teamMembers.map(member => member._id);
        userIds.push(team.userId);
        query['userId'] = { $in: userIds.map(id => id.toString()) }; // Convert to string
      } else {
        return res.status(200).json({
          success: true,
          result: [],
          count: 0,
          message: 'No data found for the specified user',
        });
      }
    } else {
      // If userId is not provided, handle based on user's role
      if (user.role === 'manager') {
        const team = await Team.findOne({ userId: user._id }).populate('teamMembers');

        if (team) {
          query['customfields.institute_name'] = { $in: team.institute };
          query['customfields.university_name'] = { $in: team.university };
          query['institute_name'] = { $in: team.institute };
          query['university_name'] = { $in: team.university };
        } else {
          // No team assigned, return no data
          query['userId'] = null;
        }
      } else if (user.role === 'supportiveassociate' || user.role === 'teamleader') {
        const team = await Team.findOne({ userId: user._id }).populate('teamMembers');

        if (team) {
          const teamMemberIds = team.teamMembers.map(member => member._id);
          query['userId'] = { $in: [user._id, ...teamMemberIds] };
        } else {
          // No team assigned, return no data
          query['userId'] = null;
        }
      } else if (user.role === 'admin' || user.role === 'subadmin') {
        // Admin and subadmin can see all data, no restrictions
      } else {
        query['userId'] = user._id; // Default case for other users
      }
    }

    const resultsPromise = Model.find(query)
      .sort({ created: 'desc' })
      .populate('userId');
    const countPromise = Model.countDocuments(query);

    const [result, count] = await Promise.all([resultsPromise, countPromise]);

    if (count > 0) {
      const formattedResults = result.map(item => ({
        ...item._doc,
        date: item.date ? new Date(item.date).toLocaleDateString('en-US') : null,
        time: item.time,
      }));

      return res.status(200).json({
        success: true,
        result: formattedResults,
        count,
        message: 'Successfully found all documents',
      });
    } else {
      return res.status(200).json({
        success: true,
        result: [],
        count: 0,
        message: 'No data found for the specified criteria',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: [],
      message: error.message,
      error: error,
    });
  }
};

module.exports = paginatedList;

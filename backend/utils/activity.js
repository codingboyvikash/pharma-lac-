import Activity from '../models/Activity.js';

export const logActivity = async (message, type = 'info') => {
  try {
    await Activity.create({ message, type });
  } catch {
    // Activity logging should never break the primary request.
  }
};

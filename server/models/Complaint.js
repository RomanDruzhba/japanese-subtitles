import { DataTypes, Model } from 'sequelize';
import { db } from '../db.js';
import { User } from './User.js';
import { Comment } from './Comment.js';

export class Complaint extends Model {}

Complaint.init({
  complaintText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  isResolved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    index: true
  },
}, {
  sequelize: db,
  modelName: 'complaint',
});

Complaint.belongsTo(User, { as: 'complainant', foreignKey: 'complainantId' }); // пользователь, который жалуется
Complaint.belongsTo(User, { as: 'targetUser', foreignKey: 'targetUserId' }); // пользователь, на которого жалуются
Complaint.belongsTo(Comment, { foreignKey: 'commentId' });

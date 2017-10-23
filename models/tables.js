/*This file defines the postgres purposeful test database table structure */

var Sequelize = require("./pg_database.js").Sequelize;
var db = require("./pg_database.js").db;
var VERBOSE = require("./pg_database.js").VERBOSE;


const User = db.define('users', {
		id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
		name: {type: Sequelize.STRING, allowNull: false}, 
		email: {type: Sequelize.STRING, allowNull: false, unique: true},
		password: {type: Sequelize.STRING, allowNull: false},
		future: {type: Sequelize.TEXT},
		present: {type: Sequelize.TEXT},
		past: {type: Sequelize.TEXT},
	},
	{
		//remove password field when returning from query
	  	instanceMethods: {
		    toJSON: () => {
		      var return_vals = Object.assign({}, this.get());
		      delete return_vals.password;
		      return return_vals;
		    }
		}
	}
);


const Interest = db.define('interests', {
	id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
	interest: {type: Sequelize.STRING, allowNull: false}, 
});


const Skill = db.define('skills', {
	id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
	name: {type: Sequelize.STRING, allowNull: false, unique: true}, 
	level: {type: Sequelize.STRING},
});


const Story = db.define("stories", {
	id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
	title: {type: Sequelize.STRING, allowNull: false}, 
	body: {type: Sequelize.STRING, allowNull: false},
});

const Message = db.define("user_messages", {
	id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
	body: {type: Sequelize.STRING, allowNull:false},
});

const Chat = db.define('chats', {
	id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
});

const User_Chat_Map = db.define("user_chat_map", {
	id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
});
Chat.belongsToMany(User, {through: User_Chat_Map, });

const Message_Chat_Map = db.define("user_chat_map", {
	id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
});
Chat.belongsToMany(Message, {through: Message_Chat_Map, });


const User_Request_Map = db.define("user_request_map", {
	id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
	mentee_message:{type: Sequelize.STRING},
})
User.belongsToMany(User, {through: User_Request_Map, as:"MentorRequests", foreignKey: "mentee_uid"});
User.belongsToMany(User, {through: User_Request_Map, as:"MenteeRequests", foreignKey: "mentor_uid"});
User_Request_Map.belongsTo(Chat, {through: User_Request_Map});


const Mentorship = db.define('mentorship_map', {
	id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
});
/* the foreignKey values are intentionally switched, though this may seem incorrect.
* otherwise the accessors auto-generated by Sequelize (user.getMentors() and user.getMentees()) 
* store keys in the opposite of what we expect. 
*/
User.belongsToMany(User, { through: Mentorship, as: "Mentors", foreignKey: "mentee_uid"});
User.belongsToMany(User, { through: Mentorship, as: "Mentees", foreignKey: "mentor_uid"});

const User_Skill_Map = db.define('user_skill_map', {
	level: {type: Sequelize.STRING}
});
User.belongsToMany(Skill, { through: User_Skill_Map });
Skill.belongsToMany(User, { through: User_Skill_Map });


const User_Inter_Map = db.define('user_inter_map', {
});
User.belongsToMany(Interest, { through: User_Inter_Map });
Interest.belongsToMany(User, { through: User_Inter_Map });


const User_Story_Map = db.define('user_story_map', {
});
User.belongsToMany(Story,{ 
	through: User_Story_Map,
	as:"Author",
});


const db_tables = {
	Users: User,
	Skills: Skill,
	Interests: Interest, 
	Stories: Story,
	Chats: Chat,
	Messages: Message,
	Mentorships: Mentorship,
	User_Request_Map: User_Request_Map,
	User_Skill_Map: User_Skill_Map,
	User_Inter_Map: User_Inter_Map,
};


module.exports = {db_tables, VERBOSE};


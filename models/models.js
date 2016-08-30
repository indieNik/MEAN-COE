
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var donorSchema = new mongoose.Schema({
    _id:String,
	name: String,
	address: {city: String, state: String, zip_code: Number, country:String},
	email: String,
    contact_no: Number
});

var orphanageSchema = new mongoose.Schema({
    _id:String,
	name: String,
	address: { city: String, state: String, zip_code: Number, country:String},
	email: String,
    contact_no: Number,
    authenticated: {type:Boolean, default:false},
    no_of_people: Number,
    government_id:Number
    
});

var donationSchema = new mongoose.Schema({
	donated_by: {type: Schema.Types.String, ref:'Donors'},
	donated_to: {type: Schema.Types.String, ref:'Orphanages'},
    donated_items: [ {item: String, quantity:Number} ],
	donation_date: {type: Date, default: Date.now}
});

var postSchema = new mongoose.Schema({
	posted_by: {type: Schema.Types.String, ref:'Donors'},
	claims: [ {type: Schema.Types.String, ref:'Orphanages'} ],
    items: [ {item: String, quantity:Number} ],
	creation_date: {type: Date, default: Date.now},
    expiry_date: {type: Date, default: Date.now},
    updation_date: {type: Date, default: Date.now},
    activated:{type: Boolean, default: false}
});

var loginSchema = new mongoose.Schema({
    _id:String,
	username: String,
	password: String, //hash created from password
    role: String,
	created_at: {type: Date, default: Date.now}
})

mongoose.model('Donors', donorSchema);
mongoose.model('Orphanages', orphanageSchema);
mongoose.model('Donations', donationSchema);
mongoose.model('Posts', postSchema);
mongoose.model('Login', loginSchema);
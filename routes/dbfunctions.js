const { 
	encrypt, decrypt, dbencrypt, dbdecrypt, dbToSvrText, 
  svrToDbText, getMemberName, 
	sendCricMail, sendCricHtmlMail,
} = require('./functions'); 

const NEWBASEHID = 2000;
var allMemberlist = [];
//var allHodList = [];
var updateStateInHod = []
let debugTest = true;



async function getHodCityList() {
	console.log("Reading city list from database");
	let myData = await M_Hod.find({active: true, city: {"$ne": ""} },{hid: 1, city:1,_id:0}).sort({city: 1,});
	// Now get all the cities
	var allCity = _.map(myData, 'city');
	allCity = _.uniqBy(allCity);
	
	hodCityArray = [];
	for (var i=0; i<allCity.length; ++i) {
		var tmp = myData.filter(x => x.city === allCity[i]);
		hodCityArray.push({ city: allCity[i], hidList: _.map(tmp, 'hid') });
	}	
}

function clearMemberListInMemory() {
   allMemberlist = [];
}

async function memberGetAll() {
	
	//console.log(allMemberlist.length);
	if (allMemberlist.length === 0) {
		console.log("Reading member data from mongoose");
		allMemberlist = await M_Member.find({ceased: false}).sort({lastName: 1, firstName: 1, middleName: 1});
		return _.cloneDeep(allMemberlist);
	}
	else {
		return _.cloneDeep(allMemberlist);
	}
}

async function getNewHodNumber() {
	var lastHodRec = await M_Hod.find({}, {hid: 1}).sort({hid: -1}).limit(1);
   console.log("new hid", lastHodRec);
   myNum = ((lastHodRec.hid > NEWBASEHID) ? lastHodRec.hid : NEWBASEHID) + 1;
   return (myNum);
}

// get list of members who are hod
async function memberGetHodMembers() {
	if (allMemberlist.length === 0) await memberGetAll();
	// Now get hod mid
	var hodList = await M_Hod.find({active: true}, {_id: 0, mid: 1});
	hodList = _.map(hodList, 'mid');
	var hodMembers = allMemberlist.filter( x => hodList.includes(x.mid) )
	return _.cloneDeep(hodMembers);
}

async function memberUpdateOne(memberRec) {
	if (allMemberlist.length === 0) await memberGetAll();
	var newList = allMemberlist.filter(x => x.mid !== memberRec.mid);
	if (!memberRec.ceased) 
		newList = newList.concat([memberRec])
	allMemberlist = _.sortBy(newList, [ 'lastName', 'middleName', 'firstName' ] );	
	await memberRec.save();
}

async function memberUpdateMany(memberRecArray) {
	if (allMemberlist.length === 0) await memberGetAll();
	var midList = _.map(memberRecArray, 'mid');
	var newList = allMemberlist.filter( x => !midList.includes(x.mid) );
	for(var i = 0; i < memberRecArray.length; ++i) {
		await memberRecArray[i].save();
		if (!memberRecArray[i].ceased)
			newList = newList.concat([memberRecArray[i]]);
	}
	allMemberlist = _.sortBy(newList, [ 'lastName', 'middleName', 'firstName' ] );	
}

async function memberAddOne(memberRec) {
	if (allMemberlist.length === 0) await memberGetAll();
	allMemberlist = _.sortBy(allMemberlist.concat([memberRec]), [ 'lastName', 'middleName', 'firstName' ] );	
	await memberRec.save();
}

async function memberAddMany(memberRecArray) {
	if (allMemberlist.length === 0) await memberGetAll();
	allMemberlist = _.sortBy(allMemberlist.concat(memberRecArray), [ 'lastName', 'middleName', 'firstName' ] );	
	for(var i=0; i<memberRecArray.length; ++i) {
		await memberRecArray[i].save();
	}
}

async function memberGetByMidOne(mid) {
	if (allMemberlist.length === 0) await memberGetAll();

	var memberRec = allMemberlist.find(x => x.mid === mid);
	return _.cloneDeep(memberRec);
}

async function memberGetByMobileOne(mobile) {
	if (allMemberlist.length === 0) await memberGetAll();
	//console.log(allMemberlist.length);
	//console.log(mobile);
	
	var memberRec = allMemberlist.find( x => (x.mobile === mobile) || (x.mobile1 === mobile)  );
	//console.log(memberRec);
	
	return _.cloneDeep(memberRec);
}

async function memberGetByEligibleMany(gender="all") {
	if (allMemberlist.length === 0) await memberGetAll();

	switch (gender.toLowerCase()) {
		case "female":  gender = "Female"; break;
		case "male":    gender = "Male"; break;
		default:				gender = "All"; break;
	};
	
	var validDate = new Date();
	validDate.setFullYear(validDate.getFullYear() - ELIGIBLEMARRIAGEYEARS);
	var validTime = validDate.getTime();
	
	console.log(allMemberlist.length);
	var myMembers = allMemberlist.filter(x => (x.emsStatus !== "") &&  (x.emsStatus !== "Married") ); 
	console.log(myMembers.length);
	
	if (gender !== "All") 
		myMembers = myMembers.filter(x => x.gender === gender);
	console.log(myMembers.length);

	myMembers = myMembers.filter(x => x.dob.getTime() <  validTime);
	console.log("Fileter over");
	
	return myMembers;
}



async function memberGetByEmailOne(email) {
	email = dbencrypt(email);
	if (allMemberlist.length === 0) await memberGetAll();
	
	var memberRec = allMemberlist.find( x => (x.email === email) || (x.email1 === email)  );
	//console.log(memberRec);
	
	return _.cloneDeep(memberRec);
}



async function memberGetByMidMany(midList) {
	if (allMemberlist.length === 0) await memberGetAll();

	var memberRecArray = allMemberlist.find(x => midList.includes(x.mid) );
	return _.cloneDeep(memberRecArray);
}


async function memberGetByHidMany(hid) {
	if (allMemberlist.length === 0) await memberGetAll();

	var memberRecArray = allMemberlist.filter(x => x.hid === hid);
	return _.cloneDeep(_.sortBy(memberRecArray, 'order'));
}

async function memberGetAlive() {
	if (allMemberlist.length === 0) await memberGetAll();

	var memberRecArray = allMemberlist.filter(x => !x.ceased);
	return _.cloneDeep(memberRecArray);	
}

async function readHodStateList() {
	console.log("Reading state list from database");
	let myData = await M_Hod.find({active: true, state: {"$ne": ""} },{hid: 1, state:1,_id:0}).sort({state: 1,});
	// Now get all the cities
	var allState = _.map(myData, 'state');
	allState = _.uniqBy(allState);
	
	updateStateInHod = [];
	for (var i=0; i<allState.length; ++i) {
		var tmp = myData.filter(x => x.state === allState[i]);
		updateStateInHod.push({ state: allState[i], hidList: _.map(tmp, 'hid') });
	}	
}

async function getHodStateList() {
	if (updateStateInHod.length === 0) {
		await readHodStateList();
		return updateStateInHod;
	}
	else {
		return updateStateInHod;
	}
}

async function memberGetCount() {
	if (allMemberlist.length === 0) await memberGetAll();
	//return allMemberlist.length;
   return allMemberlist.filter(x => x.prwsMember).length;
}

async function memberGetAllHumad() {
	if (allMemberlist.length === 0) memberGetAll();
	return allMemberlist.filter(x => x.humadMember);
}

async function memberGetHumadCount() {
	if (allMemberlist.length === 0) memberGetAll();
	return allMemberlist.filter(x => x.humadMember).length;
}

async function memberGetAllPjym() {
	if (allMemberlist.length === 0) memberGetAll();
	return allMemberlist.filter(x => x.pjymMember);
}

async function memberGetPjymCount() {
	if (allMemberlist.length === 0) memberGetAll();
	return allMemberlist.filter(x => x.pjymMember).length;
}


async function set_hod_applock(hid, lockId) { 
  await update_hod_applock(hid, lockId);
  return;
}

async function clear_hod_applock(hid) { 
  await update_hod_applock(hid, 0);
  return;
}


async function update_hod_applock(hid, newLockstate) {
  //console.log(hid, newLockstate);
  var hodRec = await M_Hod.findOne({hid: hid});
  if (hodRec) {
     hodRec.applockId = newLockstate;  
     await hodRec.save();
  }
  else {
   console.log(`hod record of hid ${hid} not found`);  
  }
  return;
}

module.exports = {
   clearMemberListInMemory,
   getNewHodNumber,
	memberGetAll, memberGetHodMembers,
	memberAddOne, memberAddMany,
	memberUpdateOne, memberUpdateMany,
	memberGetByMidOne, memberGetByMidMany, memberGetByMobileOne, memberGetByEmailOne,
	memberGetByHidMany, memberGetByEligibleMany,
	memberGetCount,
	memberGetAlive,
	memberGetAllHumad, memberGetHumadCount,
	memberGetAllPjym,
	getHodStateList, memberGetPjymCount,
   getHodCityList,
   set_hod_applock, clear_hod_applock,
}; 


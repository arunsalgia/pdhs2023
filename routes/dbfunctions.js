

var allMemberlist = [];
var allHodList = [];
var hodCityArray = []
let debugTest = true;



async function memberGetAll() {
	if (allMemberlist.length === 0) {
		console.log("Reading member data from mongoose");
		allMemberlist = await M_Member.find({ceased: false}).sort({lastName: 1, firstName: 1, middleName: 1});
		var tmp = allMemberlist.slice(0, 10);
		//for(var i=0; i<10; ++i) {
		//	console.log(allMemberlist[i].lastName, allMemberlist[i].middleName, allMemberlist[i].firstName);
		//}
		return _.cloneDeep(allMemberlist);
	}
	else {
		return _.cloneDeep(allMemberlist);
	}
}

// get list of members who are hod

async function memberGetHodMembers() {
	if (allMemberlist.length === 0) await memberGetAll();
	// Now get hod mid
	var hodList = await M_Hod.find({}, {_id: 0, mid: 1});
	hodList = _.map(hodList, 'mid');
	var hodMembers = allMemberlist.filter( x => hodList.includes(x.mid) )
	return _.cloneDeep(hodMembers);

}

async function memberUpdateOne(memberRec) {
	if (allMemberlist.length === 0) await memberGetAll();
	var newList = allMemberlist.filter(x => x.mid !== memberRec.mid).concat([memberRec])
	allMemberlist = _.sortBy(newList, [ 'lastName', 'middleName', 'firstName' ] );	
	await memberRec.save();
}

async function memberUpdateMany(memberRecArray) {
	if (allMemberlist.length === 0) await memberGetAll();
	var midList = _.map(memberRecArray, 'mid');
	var newList = allMemberlist.filter( x => !midList.includes(x.mid) ).concat(memberRecArray);
	allMemberlist = _.sortBy(newList, [ 'lastName', 'middleName', 'firstName' ] );	
	for(var i = 0; i < memberRecArray.length; ++i) {
		await memberRecArray[i].save();
	}
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

async function readHodCityList() {
	console.log("Reading city list from database");
	let myData = await M_Hod.find({city: {"$ne": ""} },{hid: 1, city:1,_id:0}).sort({city: 1,});
	// Now get all the cities
	var allCity = _.map(myData, 'city');
	allCity = _.uniqBy(allCity);
	
	hodCityArray = [];
	for (var i=0; i<allCity.length; ++i) {
		var tmp = myData.filter(x => x.city === allCity[i]);
		hodCityArray.push({ city: allCity[i], hidList: _.map(tmp, 'hid') });
	}	
}

async function getHodCityList() {
	if (hodCityArray.length === 0) {
		await readHodCityList();
		return hodCityArray;
	}
	else {
		return hodCityArray;
	}
}

module.exports = {
	memberGetAll, memberGetHodMembers,
	memberAddOne, memberAddMany,
	memberUpdateOne, memberUpdateMany,
	memberGetByMidOne, memberGetByMidMany,
	memberGetByHidMany,
	memberGetAlive,
	getHodCityList,
}; 


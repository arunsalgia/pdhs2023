

var allMemberlist = [];
var allHodLisr = [];

let debugTest = true;



async function memberGetAll() {
	if (allMemberlist.length === 0) {
		console.log("Reading member data from mongoose");
		allMemberlist = await M_Member.find({}).sort({lastName: 1, middleName: 1, firstName: 1});
		return allMemberlist;
	}
	else {
		return allMemberlist;
	}
}

async function memberUpdateOne(memberRec) {
	if (allMemberlist.length === 0) await memberGetAll();
	allMemberlist = _.sortBy(allMemberlist.filter(x => x.mid !== memberRec.mod).concat([memberRec]), [ 'lastName', 'middleName', 'firstName' ] );	
	await memberRec.save();
}

async function memberUpdateMany(memberRecArray) {
	if (allMemberlist.length === 0) await memberGetAll();
	var midList = _.map(memberRecArray, 'mid');
	var tmp = allMemberlist.filter( x => !midList.includes(x.mid) );
	allMemberlist = _.sortBy(tmp.concat(memberRecArray), [ 'lastName', 'middleName', 'firstName' ] );	
	for(var i=0; i<memberRecArray.length; ++i) {
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
	return memberRec;
}

async function memberGetByMidMany(midList) {
	if (allMemberlist.length === 0) await memberGetAll();

	var memberRecArray = allMemberlist.find(x => midList.includes(x.mid) );
	return memberRecArray;
}


async function memberGetByHidMany(hid) {
	if (allMemberlist.length === 0) await memberGetAll();

	var memberRecArray = allMemberlist.filter(x => x.hid === hid);
	return memberRecArray;
}

async function memberGetAlive() {
	if (allMemberlist.length === 0) await memberGetAll();

	var memberRecArray = allMemberlist.filter(x => !x.ceased);
	return memberRecArray;	
}


module.exports = {
	memberGetAll,
	memberAddOne, memberAddMany,
	memberUpdateOne, memberUpdateMany,
	memberGetByMidOne, memberGetByMidMany,
	memberGetByHidMany,
	memberGetAlive,
}; 


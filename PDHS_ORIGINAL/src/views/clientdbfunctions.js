import axios from "axios";

import lodashCloneDeep from 'lodash/cloneDeep';
import lodashSortBy from "lodash/sortBy";
import lodashMap from "lodash/map";


/*var allMemberlist = [];
var allHodList = [];
var hodCityArray = []
let debugTest = true;*/


export async function readAllMembers() {
	// now fetch all members
	if (process.env.REACT_APP_PRWS_DB !== "true") return;
	
	localStorage.removeItem("prwsMemberList");
	//console.log(sessionStorage.getItem("prwsMemberList"));
	try {
		let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/member/list/all`;
		let resp = await axios.get(myUrl);
		//var myData = resp.data;
		localStorage.setItem("prwsMemberList", JSON.stringify(resp.data)) ;
	} catch (e) {
		console.log("Error fetching member data");
		console.log(e);
		//setMemberArray([]);		
	}
}


export function memberGetByHidMany(hid) {
	if (process.env.REACT_APP_PRWS_DB !== "true") return [];
	
	var memberRecArray = JSON.parse(localStorage.getItem("prwsMemberList")) ;
	var memberRecArray = memberRecArray.filter(x => x.hid === hid);
	//for(var i=0; i<memberRecArray.length; ++i) {
	//	console.log(memberRecArray[i].mid, memberRecArray[i].email);
	//}
	return _.sortBy(memberRecArray, 'order');
}


export function memberUpdateMany(memberRecArray) {
	if (process.env.REACT_APP_PRWS_DB !== "true") return;
	
	var allMemberlist = JSON.parse(localStorage.getItem("prwsMemberList")) ;
	var midList = lodashMap(memberRecArray, 'mid');
	var newList = allMemberlist.filter( x => !midList.includes(x.mid) ).concat(memberRecArray);
	allMemberlist = lodashSortBy(newList, [ 'lastName', 'middleName', 'firstName' ] );	
	localStorage.removeItem("prwsMemberList");
	localStorage.setItem("prwsMemberList", JSON.stringify(allMemberlist)) ;
}

export function memberUpdateOne(memberRec) {
	if (process.env.REACT_APP_PRWS_DB !== "true") return;
	
	var allMemberlist = JSON.parse(localStorage.getItem("prwsMemberList")) ;
	var allMemberlist = allMemberlist.filter(x => x.mid !== memberRec.mid).concat([memberRec])
	allMemberlist = lodashSortBy(newList, [ 'lastName', 'middleName', 'firstName' ] );	
	localStorage.removeItem("prwsMemberList");
	localStorage.setItem("prwsMemberList", JSON.stringify(allMemberlist)) ;
}

async function memberGetAll() {
	if (allMemberlist.length === 0) {
		console.log("Reading member data from mongoose");
		allMemberlist = await M_Member.find({ceased: false}).sort({lastName: 1, middleName: 1, firstName: 1});
		return allMemberlist;
	}
	else {
		return allMemberlist;
	}
}

// get list of members who are hod

async function orgmemberGetHodMembers() {
	if (allMemberlist.length === 0) await memberGetAll();
	// Now get hod mid
	var hodList = await M_Hod.find({}, {_id: 0, mid: 1});
	hodList = _.map(hodList, 'mid');
	var hodMembers = allMemberlist.filter( x => hodList.includes(x.mid) )
	return hodMembers;

}

async function orgmemberUpdateOne(memberRec) {
	if (allMemberlist.length === 0) await memberGetAll();
	var newList = allMemberlist.filter(x => x.mid !== memberRec.mid).concat([memberRec])
	allMemberlist = _.sortBy(newList, [ 'lastName', 'middleName', 'firstName' ] );	
	await memberRec.save();
}

async function orgmemberUpdateMany(memberRecArray) {
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
	return memberRec;
}

async function memberGetByMidMany(midList) {
	if (allMemberlist.length === 0) await memberGetAll();

	var memberRecArray = allMemberlist.find(x => midList.includes(x.mid) );
	return memberRecArray;
}


async function orgmemberGetByHidMany(hid) {
	if (allMemberlist.length === 0) await memberGetAll();

	var memberRecArray = allMemberlist.filter(x => x.hid === hid);
	return _.sortBy(memberRecArray, 'order');
}

async function memberGetAlive() {
	if (allMemberlist.length === 0) await memberGetAll();

	var memberRecArray = allMemberlist.filter(x => !x.ceased);
	return memberRecArray;	
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
 


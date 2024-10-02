const {
	encrypt, decrypt, dbencrypt, dbToSvrText, svrToDbText, dbdecrypt,
  akshuGetUser, GroupMemberCount,  
	numberDate, 
	getMemberName
} = require('./functions'); 

const { 
	memberGetByMidOne, memberUpdateOne,
	memberGetByHidMany,memberUpdateMany,
} = require('./dbfunctions'); 

var router = express.Router();


async function addApplication(editor_hodmid, editor_mid, appData, appDesc, appOwner) {
	var editorRec = await memberGetByMidOne(Number(editor_mid));
	var editorHodRec = await memberGetByMidOne(Number(editor_hodmid));
	//console.log(editor_hodmid, editorHodRec);
	var justNow = new Date();
	
	let aRec = new M_Application();
	aRec.date = justNow;
	aRec.owner = appOwner;				//OWNER.prws;
	aRec.hid = 0;
	aRec.desc = appDesc;

	aRec.hodMid = editorHodRec.mid
	aRec.hodName = getMemberName(editorHodRec, false);

	aRec.mid = editorRec.mid;
	aRec.name = getMemberName(editorRec, false);

	aRec.isMember = true;
	aRec.data = appData;
	aRec.status = APPLICATIONSTATUS.pending;

	aRec.adminName = '';
	aRec.comments = '';
	
	let baseid =  (((justNow.getFullYear() * 100) + justNow.getMonth() + 1) * 100 + justNow.getDate()) * 1000;
	//console.log(baseid);
	let tmp = await M_Application.find({id: {$gt: baseid}}).limit(1).sort({id: -1});
	
	aRec.id = (tmp.length > 0) ? tmp[0].id + 1 : baseid + 1;
	
	await aRec.save();

	// First find out if application is admin....
	isAdmin = "true"
	console.log(editorRec.mid);
	if (editorRec.mid === 470001)
		// Arun Salgia by default is admin
		isAdmin = "true"
	else {
		let adminRec = await M_Application.findOne({mid: editorRec.mid});
		isAdmin = (adminRec) ? "true" : "false";
	}
	
	// Create a log entry for the given Application
	
	let myLogRec = new M_PrwsLog();
	myLogRec.date = justNow;
	myLogRec.mid = editorRec.mid;
	myLogRec.name = getMemberName(editorHodRec, false);
	myLogRec.desc = "Application " + aRec.id + " by " +  getMemberName(editorHodRec, false)  + " for \"" + appDesc + "\"" ;
	myLogRec.isAdmin = isAdmin;
	myLogRec.action = appDesc;
	myLogRec.data = JSON.stringify(aRec);
	myLogRec.referenceId = aRec.id;
	myLogRec.status = true;
	await myLogRec.save();
	
	//console.log("Mid: ", editorRec.mid);
	//console.log("Nam: ", getMemberName(editorHodRec, false));
	//console.log("Des: ", "Apply for " + appDesc + " by " +  getMemberName(editorHodRec, false));
	
	return aRec;
}

/* GET users listing. */
router.use('/', function(req, res, next) {
  // WalletRes = res;
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR, ERR_NODB); return; }
  next('route');
});

function partFind(name) {
return { $regex: name, $options: "i" }
}


router.get('/list', async function (req, res) {
  setHeader(res);

	let myData = await M_Application.find({}).sort({id: 1});
	//console.log(myData);
	sendok(res, myData);
});		

router.get('/list/:mid', async function (req, res) {
  setHeader(res);
	var {mid } = req.params;

	let myData = await M_Application.find({mid: mid}).sort({id: 1});
	sendok(res, myData);
});		

router.get('/filterlist/:filterData', async function (req, res) {
  setHeader(res);
	var { filterData } = req.params;
	filterData = JSON.parse(filterData);
	console.log(filterData);
	var cond = {owner: filterData.owner};
	if (!filterData.adminPermission)
		cond['mid'] = filterData.mid;
	if (filterData.filterBy !== "All")
		cond['status'] = filterData.filterBy;
	console.log(cond);
	
	let myData = await M_Application.find(cond).sort({id: 1}).skip(filterData.currentPage*filterData.pageSize).limit(filterData.pageSize);
	let totalCount = await M_Application.countDocuments(cond);
	//console.log(myData);
	sendok(res, {totalCount: totalCount, data: myData});
});		


router.get('/get/:id', async function (req, res) {
  setHeader(res);
	var { id } = req.params;
	
	console.log(id);
	let myData = await M_Application.findOne({id: id});
	//console.log(myData);
	sendok(res, myData);
});		


router.get('/add/:appData', async function (req, res) {
  setHeader(res);
	var {appData } = req.params;
	appData = JSON.parse(appData);

	let aRec = new M_Application();
	aRec.owner = appData.owner;
	aRec.desc = appData.desc;
	aRec.name = appData.name;
	aRec.hid = appData.hid;
	aRec.mid = appData.mid;
	aRec.isMember = appData.isMember;
	aRec.data = JSON.stringify(appData.data);
	aRec.status = 'Pending';
	aRec.adminName = '';
	aRec.comments = '';
	//console.log(appData.data);
	
	let justNow = new Date();
	let baseid =  (((justNow.getFullYear() * 100) + justNow.getMonth() + 1) * 100 + justNow.getDate()) * 1000;
	//console.log(baseid);
	let tmp = await M_Application.find({id: {$gt: baseid}}).limit(1).sort({id: -1});
	
	aRec.date = justNow;
	aRec.id = (tmp.length > 0) ? tmp[0].id + 1 : baseid + 1;
	await aRec.save();
	//console.log(aRec);
	
	sendok(res, aRec);
});

router.get('/delete/:editorMid/:applicationId', async function (req, res) {
  setHeader(res);
	var {editorMid, applicationId } = req.params;
	
	// Create a log entry for the given Application
	var editorRec = await memberGetByMidOne(Number(editorMid));
	if (!editorRec) return senderr(res, 601, 'Invalid editor mid');
	
	var aRec = M_Application.findOne({id: applicationId});
	if (!aRec) return senderr(res, 602, 'Invalid Application Id');
	
	await M_Application.deleteOne({id: applicationId});

	let myLogRec = new M_PrwsLog();
	myLogRec.date = new Date();
	myLogRec.mid = editorRec.mid;
	myLogRec.name = getMemberName(editorRec, false);
	myLogRec.desc = "Application " + aRec.id + "deleted by " +  getMemberName(editorRec, false) ;
	myLogRec.isAdmin = true;
	myLogRec.action = "Delete";
	myLogRec.data = "";
	myLogRec.referenceId = aRec.id;
	myLogRec.status = true;
	await myLogRec.save();

	
	sendok(res, "Done");
});


router.get('/junkeditfamilydetails/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_mid, appData } = req.params;
	appData = JSON.parse(appData);

	var editorRec = await memberGetByMidOne(Number(editor_mid));
	
	let aRec = new M_Application();
	aRec.owner = "PRWS";
	aRec.desc = "Edit Family details";
	aRec.name = getMemberName(editorRec);
	aRec.mid = editorRec.mid;
	aRec.isMember = true;
	aRec.data = JSON.stringify(appData.data);
	aRec.status = 'Pending';
	aRec.adminName = '';
	aRec.comments = '';
	//console.log(appData.data);
	
	let justNow = new Date();
	let baseid =  (((justNow.getFullYear() * 100) + justNow.getMonth() + 1) * 100 + justNow.getDate()) * 1000;
	//console.log(baseid);
	let tmp = await M_Application.find({id: {$gt: baseid}}).limit(1).sort({id: -1});
	
	aRec.date = justNow;
	aRec.id = (tmp.length > 0) ? tmp[0].id + 1 : baseid + 1;
	await aRec.save();
	//console.log(aRec);
	
	sendok(res, aRec);
});

router.get('/editfamilydetails/:editor_hodmid/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_mid, editor_hodmid, appData } = req.params;
	var myRec = await addApplication(editor_hodmid, editor_mid, appData, APPLICATIONTYPES.editGeneral, OWNER.prws);	
	sendok(res, myRec);
});

router.get('/updategotra/:editor_hodmid/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_mid, editor_hodmid, appData } = req.params;
	var myRec = await addApplication(editor_hodmid, editor_mid, appData, APPLICATIONTYPES.editGotra, OWNER.prws);	
	sendok(res, myRec);
});

router.get('/humadupgrade/:editor_hodmid/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_mid, editor_hodmid, appData } = req.params;
	var myRec = await addApplication(editor_hodmid, editor_mid, appData, APPLICATIONTYPES.humadUpgrade, OWNER.humad);	
	sendok(res, myRec);
});


router.get('/ceased/:editor_hodmid/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_hodmid, editor_mid, appData } = req.params;
	var myRec = await addApplication(editor_hodmid, editor_mid, appData, APPLICATIONTYPES.memberCeased, OWNER.prws);	
	sendok(res, myRec);
});


router.get('/marriage/:editor_hodmid/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_hodmid, editor_mid, appData } = req.params;
	var myRec = await addApplication(editor_hodmid, editor_mid, appData, APPLICATIONTYPES.marriage, OWNER.prws);	
	sendok(res, myRec);
});

router.get('/unmarriage/:editor_hodmid/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_hodmid, editor_mid, appData } = req.params;
	var myRec = await addApplication(editor_hodmid, editor_mid, appData, APPLICATIONTYPES.unMarriage, OWNER.prws);	
	sendok(res, myRec);
});


router.get('/changedom/:editor_hodmid/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_hodmid, editor_mid, appData } = req.params;
	var myRec = await addApplication(editor_hodmid, editor_mid, appData, APPLICATIONTYPES.changeDom, OWNER.prws);	
	sendok(res, myRec);
});

router.get('/newhod/:editor_hodmid/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_hodmid, editor_mid, appData } = req.params;
	var myRec = await addApplication(editor_hodmid, editor_mid, appData, APPLICATIONTYPES.newHod, OWNER.prws);	
	sendok(res, myRec);
});

router.get('/movemember/:editor_hodmid/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_mid, editor_hodmid, appData } = req.params;
	var myRec = await addApplication(editor_hodmid, editor_mid, appData, APPLICATIONTYPES.transferMember, OWNER.prws);	
	sendok(res, myRec);
});


router.get('/addeditpersonal/:editor_hodmid/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_hodmid, editor_mid, appData } = req.params;
	var xxx = JSON.parse(appData);
	var myRec = await addApplication(editor_hodmid, editor_mid, appData, 
														(xxx.mode === "ADD") ? APPLICATIONTYPES.addMember : APPLICATIONTYPES.editMember, 
														OWNER.prws);	
	sendok(res, myRec);
});

router.get('/editgotra/:editor_hodmid/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_hodmid, editor_mid, appData } = req.params;
	var myRec = await addApplication(editor_hodmid, editor_mid, appData, APPLICATIONTYPES.editGotra, OWNER.prws);	
	sendok(res, myRec);
});



router.get('/reject/:id/:adminMid/:comments', async function (req, res) {
  setHeader(res);
	var {id, adminMid,comments } = req.params;
	
	//console.log(id, comments, adminMid);
	var adminRec = await memberGetByMidOne(Number(adminMid));
	
	let aRec = await M_Application.findOne({id: id});
	aRec.status = APPLICATIONSTATUS.rejected;
	aRec.approvalDate = new Date();
	aRec.adminMid = adminRec.mid;
	aRec.adminName = getMemberName(adminRec, false);
	aRec.comments = comments;
	sendok(res, aRec);
	await aRec.save();
	
	// Now Log the approve action.	
	let myLogRec = new M_PrwsLog();
	myLogRec.date = new Date();
	myLogRec.mid = adminMid;
	myLogRec.name = getMemberName(adminRec, false);
	myLogRec.desc = "Application " + aRec.id + " rejected by " +  getMemberName(adminRec, false)  + " for \"" + aRec.desc + "\"" ;
	myLogRec.isAdmin = isAdmin;
	myLogRec.action = aRec.desc;
	myLogRec.data = JSON.stringify(aRec);
	myLogRec.referenceId = aRec.id;
	myLogRec.status = true;
	await myLogRec.save();
});

router.get('/approve/:appId/:adminMid/:comments', async function (req, res) {
  setHeader(res);
	var {appId, adminMid,comments } = req.params;
	return senderr(res, 602, 'Invalid application type');
	
	//console.log(appId, comments, adminMid);

	let aRec = await M_Application.findOne({id: appId});
	if (!aRec) return senderr(res, 601, 'Application not found');
	
	//var myStatus = {status: false, record: null};
	var retObject = {status: false};
	switch (aRec.desc) {
		case APPLICATIONTYPES.editMember:
			retObject = await approve_editMember(aRec);
			break;
		case APPLICATIONTYPES.memberCeased:
			retObject = await approve_memberCeased(aRec);
			break;
		case APPLICATIONTYPES.newHod:
			retObject = await approve_newHod(aRec);
			break;
		case APPLICATIONTYPES.editGotra:
			retObject = await approve_editGotra(aRec);
			break;
		case APPLICATIONTYPES.editMember:
			retObject = await approve_editMember(aRec);
			break;
		default:
			return senderr(res, 602, 'Invalid application type');
	}
	
	if (!retObject.status) return senderr(res, 603, 'Error approving data');

	// Update application record
	var adminRec = await memberGetByMidOne(Number(adminMid));	
	
	aRec.status = APPLICATIONSTATUS.approved;
	aRec.adminMid = adminRec.mid;
	aRec.adminName = getMemberName(adminRec, false);
	aRec.comments = comments;
	await aRec.save();	
	
	// Now Log the approve action.	
	let myLogRec = new M_PrwsLog();
	myLogRec.date = new Date();
	myLogRec.mid = adminMid;
	myLogRec.name = getMemberName(adminRec, false);
	myLogRec.desc = "Application " + aRec.id + " approved by " +  getMemberName(adminRec, false)  + " for \"" + aRec.desc + "\"" ;
	myLogRec.isAdmin = isAdmin;
	myLogRec.action = aRec.desc;
	myLogRec.data = JSON.stringify(aRec);
	myLogRec.referenceId = aRec.id;
	myLogRec.status = true;
	await myLogRec.save();
	
	sendok(res, aRec);
});

// Approval functions

async function approve_editMember(aRec) {
	var myData = JSON.parse(aRec.data);
	//console.log(myData);
	var myRec = await memberGetByMidOne(myData.oldMemberRec.mid);
	// Update Name details
	myRec.title = myData.memberRec.title;
	myRec.firstName = myData.memberRec.firstName;
	myRec.lastName = myData.memberRec.lastName;
	myRec.middleName = myData.memberRec.middleName;
	myRec.alias = myData.memberRec.alias;
	// Update personal details
	myRec.relation = myData.memberRec.relation;
	myRec.gender = myData.memberRec.gender;
	myRec.dob = myData.memberRec.dob;
	myRec.bloodGroup = myData.memberRec.bloodGroup;
	// Update other details
	myRec.mobile = myData.memberRec.mobile;
	myRec.mobile1 = myData.memberRec.mobile1;
	myRec.email = svrToDbText(myData.memberRec.email);
	// Office details
	myRec.occupation = myData.memberRec.occupation;
	myRec.education = myData.memberRec.education;
	myRec.officeName = myData.memberRec.officeName;
	myRec.officePhone = myData.memberRec.officePhone;

	//console.log(myRec);
	await memberUpdateOne(myRec);
	return {status: true, record: myRec};
}


async function approve_editGotra(appRec) {
	var appData = JSON.parse(appRec.data);
	console.log(appData);
	// First get the HOD record
	var hodRec = await M_Hod.findOne({hid: appData.hid});
	if (!hodRec) return 651;
	
	if (!appData.newData.existingGotra) {
		// New gotra. To be added in database
		return 661;
	}
	
	hodRec.gotra = appData.newData.gotra;
	hodRec.caste = appData.newData.caste;
	hodRec.subCaste = appData.newData.subCaste;
	await hodRec.save();
	
	console.log(hodRec);
	
  return {status: true, record: hodRec};
}


async function org_approve_editMember(aRec) {
	return {status: false};
	
	var myData = JSON.parse(aRec.data);
	//console.log(myData);
	var myRec = await memberGetByMidOne(myData.oldMemberRec.mid);
	// Update Name details
	if (myData.memberRec.title) {
		myRec.title = myData.memberRec.title;
	}
	if (myData.memberRec.firstName) {
		myRec.firstName = myData.memberRec.firstName;
	}
	if (myData.memberRec.lastName) {
		myRec.lastName = myData.memberRec.lastName;
	}	
	if (myData.memberRec.middleName) {
		myRec.middleName = myData.memberRec.middleName;
	}		
	if (myData.memberRec.alias) {
		myRec.alias = myData.memberRec.alias;
	}			
	// Update personal details
	if (myData.memberRec.relation) {
		myRec.relation = myData.memberRec.relation;
	}			
	if (myData.memberRec.gender) {
		myRec.gender = myData.memberRec.gender;
	}			
	if (myData.memberRec.dob) {
		myRec.dob = myData.memberRec.dob;
	}			
	if (myData.memberRec.bloodGroup) {
		myRec.bloodGroup = myData.memberRec.bloodGroup;
	}			
	// Update Marital status
		// to be implemented
	// Update other details
	if (myData.memberRec.mobile) {
		myRec.mobile = myData.memberRec.mobile;
	}	
	if (myData.memberRec.mobile1) {
		myRec.mobile1 = myData.memberRec.mobile1;
	}	
	if (myData.memberRec.email) {
		myRec.email = svrToDbText(myData.memberRec.email);
	}	
	// Office details
	if (myData.memberRec.occupation) {
		myRec.occupation = myData.memberRec.occupation;
	}			
	if (myData.memberRec.education) {
		myRec.education = myData.memberRec.education;
	}			
	if (myData.memberRec.officeName) {
		myRec.officeName = myData.memberRec.officeName;
	}			
	if (myData.memberRec.officePhone) {
		myRec.officePhone = myData.memberRec.officePhone;
	}			

	//console.log(myRec);
	await memberUpdateOne(myRec);
	return {status: true, record: myRec};
}

// Member ceased approve
async function approve_memberCeased(aRec) {
	return {status: false};
	var myData = JSON.parse(aRec.data);
	//console.log(myData);
	// Get all the members of the family
	var otherMembers = await memberGetByHidMany(myData.hid);
	// ceased record and other member record
	var ceasedRec = otherMembers.find(x => x.mid === myData.ceasedMid);
	otherMembers = _.sortBy(otherMembers.filter(x => x.mid !== myData.ceasedMid), 'order');
	// if new Hod, then bring it to the top
	if (myData.newHodMid !== 0) {
		var tmp = otherMembers.find(x => x.mid === myData.newHodMid);
		otherMembers = [tmp].concat(otherMembers.filter(x => x.mid !== myData.newHodMid));
	}
	
	// first ceasedRec Update
	ceasedRec.ceased = true;
	await memberUpdateOne(ceasedRec);
	
	// Now set the relation. HOd is always "Self"
	for (var i = 0; i<myData.midList.length; ++i) {
		var tmpRec = otherMembers.find(x => x.mid === myData.midList[i]);
		if (tmpRec.mid === myData.newHodMid)
			tmpRec.relation = "Self";
		else
			tmpRec.relation = myData.relationList[i];
	}
	
	// set order for balance Family
	for(var i=0; i<otherMembers.length; ++i) {
		otherMembers[i].order = i;
	}
	
	// UPdate spouseMid & emsStatus if required
	if (ceasedRec.spouseMid !== 0) {
		var tmp = otherMembers.find(x => x.mid === ceasedRec.spouseMid);
		tmp.spouseMid = 0;		// SPouse not alive
		tmp.emsStatus = (tmp.gender === "Female") ? "Widow" : "Widower";
	}

	// update all members data
	await memberUpdateMany(otherMembers);
	
	// If new hod then update HOD record
	if (myData.newHodMid !== 0) {
		var hodRec = await M_Hod.findOne({hid: myData.hid});
		hodRec.mid = myData.newHodMid;
		await hodRec.save();
	}
	// All done

	return {status: true, record: ceasedRec};
}

async function approve_changeMaritalStatus(aRec) {
	return {status: false};
	
	// First remove link to spouse and set status as Unmarried
	
	var myData = JSON.parse(aRec.data);
	//console.log(myData);
	// Set member as unmarried
	var myRec = memberGetByMidOne(myData.memberRec.mid);
	myRec.spouseMid = 0;
	myRec.emsStatus = EMSTYPES.unmarried;
	await memberUpdateOne(myRec);
	// Now the same for spouse (if in database)
	if (myData.spouseMemberRec) {
		myRec = memberGetByMidOne(myData.spouseMemberRec.mid);
		myRec.spouseMid = 0;
		myRec.emsStatus = EMSTYPES.unmarried;
		await memberUpdateOne(myRec);
	}
	return {status: true, record: null};
}

// Member new Hod approve
async function approve_newHod(aRec) {
	return {status: false};
	var myData = JSON.parse(aRec.data);
	//console.log(myData);
	
	// Get all the members of the family
	var allMembers = await memberGetByHidMany(myData.hid);
	
	// Bring record of HOD on the top
	var newHodMemberRec = allMembers.find(x => x.mid === myData.newHodMid);
	allMembers = [newHodMemberRec].concat(_.sortBy(allMembers.filter(x => x.mid !== myData.newHodMid), 'order'));

	// set correct order for the Family
	for(var i=0; i<allMembers.length; ++i) {
		allMembers[i].order = i;
	}

	// Now set the relation of others
	for (var i = 0; i<myData.midList.length; ++i) {
		var tmpRec = allMembers.find(x => x.mid === myData.midList[i]);
		if (tmpRec.mid !== myData.newHodMid)
			tmpRec.relation = myData.relationList[i];
		else
			tmpRec.relation = 'Self';
	}

	// update all member records
	await memberUpdateMany(allMembers);
	
	// Update mid of the new hod in HOD record
	var hodRec = await M_Hod.findOne({hid: myData.hid});
	hodRec.mid = myData.newHodMid;
	await hodRec.save();

	// All done
	return {status: true, record: hodRec};
}


router.get('/test', async function (req, res) {
  setHeader(res);
	var {id, adminName,comments } = req.params;
	
	let allRec = await M_Application.find({});
	for(var i=0; i<allRec.length; ++i) {
		var memRec = await memberGetByMidOne(allRec[i].mid);
		//console.log(memRec);
		allRec[i].name = getMemberName(memRec);
		await allRec[i].save();
	}
	sendok(res, allRec);
});


function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
}

module.exports = router;

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


async function setNewHodInArray(memberArray, hodMid, saveRec=false) {
	var memberHodRecArray = memberArray.filter(x => x.mid === hodMid);
	memberArray = memberHodRecArray.concat(memberArray.filter(x => x.mid !== hodMid));
	for(var i=0; i < memberArray.length; ++i) {
		memberArray[i].order = i;
		if (saveRec)
			await memberArray[i].save();
	}
	return memberArray;
}



/* GET users listing. */
router.use('/', function(req, res, next) {
  // WalletRes = res;
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR, ERR_NODB); return; }
	
	console.log("IN APPROVE");
  next('route');
});

function partFind(name) {
return { $regex: name, $options: "i" }
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
	
  return 0;	
}

async function approve_newHod(appRec) {
	var appData = JSON.parse(appRec.data);
	console.log(appData);
	// First get the HOD record
	var hodRec = await M_Hod.findOne({hid: appData.hid});
	if (!hodRec) return 651;
	console.log(hodRec);
	
	
  return 699;	
}

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
	return 0;
}

async function approve_editMember(aRec) {
	var myData = JSON.parse(aRec.data);
	//console.log(myData);
	var myRec = await memberGetByMidOne(myData.oldMemberRec.mid);
	// Update Name details
	myRec.title = myData.memberRec.title;
	myRec.firstName = myData.memberRec.firstName;
	myRec.lastName = myData.memberRec.lastName;
	myRec.middleName = myData.memberRec.middleName;

}


// Member ceased approve
async function approve_memberCeased(aRec) {
	var myData = JSON.parse(aRec.data);
	//console.log(myData);
	// Get all the members of the family
	var otherMembers = await memberGetByHidMany(myData.hid);
	
	// seperate ceased record from the list and update ceased details
	var ceasedRec = otherMembers.find(x => x.mid === myData.ceasedMid);
	ceasedRec.ceased = true;
	// update ceased dated
	await memberUpdateOne(ceasedRec);
	
	// Now work on remining members
	otherMembers = _.sortBy(otherMembers.filter(x => x.mid !== myData.ceasedMid), 'order');
	// if Hod has changed, then bring its record to the top
	if (myData.newHodMid !== 0) {
		var tmp = otherMembers.find(x => x.mid === myData.newHodMid);
		otherMembers = [tmp].concat(otherMembers.filter(x => x.mid !== myData.newHodMid));
	}
	
	// Now set the relation. HOD is always "Self"
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

	return 0;
}



// all application for approval will come here
router.get('/application/:appId/:adminMid/:remarks', async function (req, res) {
	var {appId, adminMid, remarks } = req.params;
  setHeader(res);

	var appRec = await M_Application.findOne({id: appId});
	var adminRec = await memberGetByMidOne(Number(adminMid));
	
	console.log(adminRec);
	console.log(appRec);
	console.log(remarks);
	
	// First check the status is still pending.  If not reject the request
	if (appRec.status !== APPLICATIONSTATUS.pending) return senderr(res, 601, "Incorrect");
	
	console.log(appRec.desc);
	var sts = 0;
	switch(appRec.desc) {
		case APPLICATIONTYPES.editGotra:
			sts = await approve_editGotra(appRec);
			break;
		case APPLICATIONTYPES.newHod:
			sts = await approve_newHod(appRec);
			break;
		default:
			return senderr(res, 699, "Not yet implemented");
			break;
	}
	// check the return status
	if (sts === 0) {
		// Update in application Rec
		appRec.status = APPLICATIONSTATUS.approved;
		appRec.comments = remarks;
		appRec.approvalDate = new Date();
		// update admin Name
		appRec.aminMid = adminRec.mid;
		appRec.adminName = getMemberName(adminRec, false);
		
		sendok(res, appRec);
		await appRec.save();
	}
	else {
		senderr(res, 603, "Error");
	}

});		

/// Delete all below this except last few lines	
/*
router.get('/editfamilydetails/:editor_hodmid/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_mid, editor_hodmid, appData } = req.params;
	console.log(appData);
	let justNow = new Date();

	var editorRec = await memberGetByMidOne(Number(editor_mid));
	var editorHodRec = await memberGetByMidOne(Number(editor_hodmid));
	console.log(editor_hodmid, editorHodRec);
	
	let aRec = new M_Application();
	aRec.date = justNow;
	aRec.owner = OWNER.prws;
	aRec.hid = 0;
	aRec.desc = APPLICATIONTYPES.editGeneral;

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
	console.log(baseid);
	let tmp = await M_Application.find({id: {$gt: baseid}}).limit(1).sort({id: -1});
	
	aRec.id = (tmp.length > 0) ? tmp[0].id + 1 : baseid + 1;
	await aRec.save();
	//console.log(aRec);
	
	sendok(res, aRec);
});

router.get('/updategotra/:editor_hodmid/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_mid, editor_hodmid, appData } = req.params;
	//console.log(appData);
	let justNow = new Date();

	var editorRec = await memberGetByMidOne(Number(editor_mid));
	var editorHodRec = await memberGetByMidOne(Number(editor_hodmid));
	//console.log(editor_hodmid, editorHodRec);
	
	let aRec = new M_Application();
	aRec.date = justNow;
	aRec.owner = OWNER.prws;
	aRec.hid = 0;
	aRec.desc = APPLICATIONTYPES.editGotra;

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
	//console.log(aRec);
	
	sendok(res, aRec);
});

router.get('/humadupgrade/:editor_hodmid/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_mid, editor_hodmid, appData } = req.params;
	//console.log(appData);
	let justNow = new Date();

	var editorRec = await memberGetByMidOne(Number(editor_mid));
	var editorHodRec = await memberGetByMidOne(Number(editor_hodmid));
	//console.log(editor_hodmid, editorHodRec);
	
	let aRec = new M_Application();
	aRec.date = justNow;
	aRec.owner = OWNER.prws;
	aRec.hid = 0;
	aRec.desc = APPLICATIONTYPES.humadUpgrade;

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
	//console.log(aRec);
	
	sendok(res, aRec);
});


router.get('/ceased/:editor_hodmid/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_hodmid, editor_mid, appData } = req.params;
	//console.log(appData);
	let justNow = new Date();

	var editorRec = await memberGetByMidOne(Number(editor_mid));
	var editorHodRec = await memberGetByMidOne(Number(editor_hodmid));
	//console.log(editor_hodmid, editorHodRec);
	
	let aRec = new M_Application();
	aRec.date = justNow;
	aRec.owner = OWNER.prws;
	aRec.hid = 0;
	aRec.desc = APPLICATIONTYPES.memberCeased;

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

	sendok(res, aRec);

	await aRec.save();
	//console.log(aRec);
});


router.get('/marriage/:editor_hodmid/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_hodmid, editor_mid, appData } = req.params;
	//console.log(appData);
	let justNow = new Date();

	var editorRec = await memberGetByMidOne(Number(editor_mid));
	var editorHodRec = await memberGetByMidOne(Number(editor_hodmid));
	//console.log(editor_hodmid, editorHodRec);
	
	let aRec = new M_Application();
	aRec.date = justNow;
	aRec.owner = OWNER.prws;
	aRec.hid = 0;
	aRec.desc = APPLICATIONTYPES.marriage;

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

	sendok(res, aRec);

	await aRec.save();
	//console.log(aRec);
});

router.get('/unmarriage/:editor_hodmid/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_hodmid, editor_mid, appData } = req.params;
	//console.log(appData);
	let justNow = new Date();

	var editorRec = await memberGetByMidOne(Number(editor_mid));
	var editorHodRec = await memberGetByMidOne(Number(editor_hodmid));
	//console.log(editor_hodmid, editorHodRec);
	
	let aRec = new M_Application();
	aRec.date = justNow;
	aRec.owner = OWNER.prws;
	aRec.hid = 0;
	aRec.desc = APPLICATIONTYPES.unMarriage;

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

	sendok(res, aRec);

	await aRec.save();
	//console.log(aRec);
});


router.get('/changedom/:editor_hodmid/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_hodmid, editor_mid, appData } = req.params;
	//console.log(appData);
	let justNow = new Date();

	var editorRec = await memberGetByMidOne(Number(editor_mid));
	var editorHodRec = await memberGetByMidOne(Number(editor_hodmid));
	//console.log(editor_hodmid, editorHodRec);
	
	let aRec = new M_Application();
	aRec.date = justNow;
	aRec.owner = OWNER.prws;
	aRec.hid = 0;
	aRec.desc = APPLICATIONTYPES.changeDom;

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

	sendok(res, aRec);

	await aRec.save();
	//console.log(aRec);
});

router.get('/newhod/:editor_hodmid/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_hodmid, editor_mid, appData } = req.params;
	//console.log(appData);
	let justNow = new Date();

	var editorRec = await memberGetByMidOne(Number(editor_mid));
	var editorHodRec = await memberGetByMidOne(Number(editor_hodmid));
	//console.log(editor_hodmid, editorHodRec);
	
	let aRec = new M_Application();
	aRec.date = justNow;
	aRec.owner = OWNER.prws;
	aRec.hid = 0;
	aRec.desc = APPLICATIONTYPES.newHod;

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

	sendok(res, aRec);

	await aRec.save();
	//console.log(aRec);
});

router.get('/movemember/:editor_hodmid/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_mid, editor_hodmid, appData } = req.params;
	//console.log(appData);
	let justNow = new Date();

	var editorRec = await memberGetByMidOne(Number(editor_mid));
	var editorHodRec = await memberGetByMidOne(Number(editor_hodmid));
	//console.log(editor_hodmid, editorHodRec);
	
	let aRec = new M_Application();
	aRec.date = justNow;
	aRec.owner = OWNER.prws;
	aRec.hid = 0;
	aRec.desc = APPLICATIONTYPES.transferMember;

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
	//console.log(aRec);
	
	sendok(res, aRec);
});


router.get('/addeditpersonal/:editor_hodmid/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_hodmid, editor_mid, appData } = req.params;
	//console.log(appData);
	var xxx = JSON.parse(appData);
	
	let justNow = new Date();

	var editorRec = await memberGetByMidOne(Number(editor_mid));
	var editorHodRec = await memberGetByMidOne(Number(editor_hodmid));
	//console.log(editor_hodmid, editorHodRec);
	
	let aRec = new M_Application();
	aRec.date = justNow;
	aRec.owner = OWNER.prws;
	aRec.hid = 0;
	aRec.desc = (xxx.mode === "ADD") ? APPLICATIONTYPES.addMember : APPLICATIONTYPES.editMember ;

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

	sendok(res, aRec);

	await aRec.save();
	//console.log(aRec);
});

router.get('/editgotra/:editor_hodmid/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_hodmid, editor_mid, appData } = req.params;
	//console.log(appData);
	var xxx = JSON.parse(appData);
	
	let justNow = new Date();

	var editorRec = await memberGetByMidOne(Number(editor_mid));
	var editorHodRec = await memberGetByMidOne(Number(editor_hodmid));

	let aRec = new M_Application();
	aRec.date = justNow;
	aRec.owner = OWNER.prws;
	aRec.hid = 0;
	aRec.desc = APPLICATIONTYPES.editGotra;

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

	sendok(res, aRec);

	await aRec.save();
	//console.log(aRec);
});



router.get('/reject/:id/:adminMid/:comments', async function (req, res) {
  setHeader(res);
	var {id, adminMid,comments } = req.params;
	
	//console.log(id, comments, adminMid);
	var adminRec = await memberGetByMidOne(Number(adminMid));
	
	let aRec = await M_Application.findOne({id: id});
	aRec.status = APPLICATIONSTATUS.rejected;
	aRec.adminMid = adminRec.mid;
	aRec.adminName = getMemberName(adminRec, false);
	aRec.comments = comments;
	await aRec.save();
	//console.log(aRec);
	
	sendok(res, aRec);
});

router.get('/approve/:id/:adminMid/:comments', async function (req, res) {
  setHeader(res);
	var {id, adminMid,comments } = req.params;
	
	//console.log(id, comments, adminMid);

	let aRec = await M_Application.findOne({id: id});
	if (!aRec) return senderr(res, 601, 'Application not found');
	
	var myStatus = {status: false, record: null};
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
	sendok(res, aRec);
		
	//console.log(aRec);
	await aRec.save();	
});

*/
// Approval functions

// Member new Hod approve
async function approve_newHod(aRec) {
	var myData = JSON.parse(aRec.data);
	//console.log(myData);
	// Get all the members of the family
	var otherMembers = await memberGetByHidMany(myData.hid);
	// ceased record and other member record
	var newHodRec = otherMembers.find(x => x.mid === myData.newHodMid);
	otherMembers = _.sortBy(otherMembers.filter(x => x.mid !== myData.newHodMid), 'order');

	// HOD is Self and has order 0 (at top)
	newHodRec.relation = 'Self';
	newHodRec.order = 0;

	// Now set the relation of others
	for (var i = 0; i<myData.midList.length; ++i) {
		var tmpRec = otherMembers.find(x => x.mid === myData.midList[i]);
		tmpRec.relation = myData.relationList[i];
	}

	// set order for balance Family
	for(var i=0; i<otherMembers.length; ++i) {
		otherMembers[i].order = i+1;
	}

	// update all members data
	await memberUpdateOne(newHodRec);
	await memberUpdateMany(otherMembers);
	
	// Update new hod in HOD record
	var hodRec = await M_Hod.findOne({hid: myData.hid});
	hodRec.mid = myData.newHodMid;
	await hodRec.save();

	// All done
	return {status: true, record: newHodRec};
}



function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
}

module.exports = router;

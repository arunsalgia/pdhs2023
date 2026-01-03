const {
	encrypt, decrypt, dbencrypt, dbToSvrText, svrToDbText, dbdecrypt,
  akshuGetUser, GroupMemberCount,  
	numberDate, 
	getMemberName
} = require('./functions'); 

const { 
   clearMemberListInMemory,
   setHumadMemberActiveflag, setPjymMemberActiveflag,
   getNewHodNumber,
	memberGetByMidOne, memberUpdateOne,
	memberGetByHidMany,memberUpdateMany,
   set_hod_applock, clear_hod_applock,
} = require('./dbfunctions'); 

var router = express.Router();

async function updateNewHidMidInHumad(oldMid, newHid, newMid) {
   var humadRec = await M_Humad.findOne({mid: oldMid});
   if (humadRec) {
     humadRec.hid = newHid;
     humadRec.mid = newMid;
     await humadRec.save();
   }
}

async function updateNewHidMidInPjym(oldMid, newHid, newMid) {
   var pjymRec = await M_Pjym.findOne({mid: oldMid});
   if (pjymRec) {
     pjymRec.hid = newHid;
     pjymRec.mid = newMid;
     await pjymRec.save();
   }
}

async function addApplication(hodmid, editor_mid, appData, appDesc, appOwner) {
	var editorRec = await memberGetByMidOne(Number(editor_mid));
	var editorHodRec = await memberGetByMidOne(Number(hodmid));
	console.log(hodmid, editorHodRec);
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
	console.log(aRec);
   
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
	myLogRec.mid = editorHodRec.mid;
	myLogRec.name = getMemberName(editorHodRec, false);
	myLogRec.desc = "Application " + aRec.id + " by " +  getMemberName(editorRec, false)  + " for \"" + appDesc + "\"" ;
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
  //console.log("at top of applic");
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
	//console.log(filterData);
	var cond = {owner: filterData.owner};
	if (!filterData.adminPermission)
		cond['mid'] = filterData.mid;
	if (filterData.filterBy !== "All")
		cond['status'] = filterData.filterBy;
	//console.log(cond);
	
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

   // set the family lock
   var xxx = JSON.parse(appData);
   //console.log(xxx);
   await set_hod_applock(xxx.hid, myRec.id);   
	sendok(res, myRec);
});

router.get('/updategotra/:editor_hodmid/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_mid, editor_hodmid, appData } = req.params;
	var myRec = await addApplication(editor_hodmid, editor_mid, appData, APPLICATIONTYPES.editGotra, OWNER.prws);	

   // set the family lock
   var xxx = JSON.parse(appData);
   await set_hod_applock(xxx.hid, myRec.id);   
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

   // set the family lock
   var xxx = JSON.parse(appData);
   await set_hod_applock(xxx.hid, myRec.id);   
	sendok(res, myRec);
});


router.get('/marriage/:editor_hodmid/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_hodmid, editor_mid, appData } = req.params;
	var myRec = await addApplication(editor_hodmid, editor_mid, appData, APPLICATIONTYPES.marriage, OWNER.prws);	

   // set the family lock
   var xxx = JSON.parse(appData);
   console.log(xxx.memberRec);
   await set_hod_applock(xxx.hid, myRec.id);   
   // Lock record of Spouse family
   if (xxx.spouseMemberRec) await set_hod_applock(xxx.spouseMemberRec.hid, myRec.id);   
	sendok(res, myRec);
});

router.get('/unmarriage/:editor_hodmid/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_hodmid, editor_mid, appData } = req.params;
	var myRec = await addApplication(editor_hodmid, editor_mid, appData, APPLICATIONTYPES.unMarriage, OWNER.prws);	

   // set the family lock
   var xxx = JSON.parse(appData);
   await set_hod_applock(xxx.hid, myRec.id);   
	sendok(res, myRec);
});


router.get('/changedom/:editor_hodmid/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_hodmid, editor_mid, appData } = req.params;
	var myRec = await addApplication(editor_hodmid, editor_mid, appData, APPLICATIONTYPES.changeDom, OWNER.prws);	

   // set the family lock
   var xxx = JSON.parse(appData);
   await set_hod_applock(xxx.hid, myRec.id);   
	sendok(res, myRec);
});

router.get('/newhod/:editor_hodmid/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_hodmid, editor_mid, appData } = req.params;
	var myRec = await addApplication(editor_hodmid, editor_mid, appData, APPLICATIONTYPES.newHod, OWNER.prws);	

   // set the family lock
   var xxx = JSON.parse(appData);
   await set_hod_applock(xxx.hid, myRec.id);   
	sendok(res, myRec);
});

router.get('/movemember/:editor_hodmid/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_mid, editor_hodmid, appData } = req.params;
	var myRec = await addApplication(editor_hodmid, editor_mid, appData, APPLICATIONTYPES.transferMember, OWNER.prws);	

   // set the family lock
   var xxx = JSON.parse(appData);
   await set_hod_applock(xxx.hid, myRec.id);   
	sendok(res, myRec);
});


router.get('/addeditpersonal/:editor_hodmid/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_hodmid, editor_mid, appData } = req.params;
	var xxx = JSON.parse(appData);
	var myRec = await addApplication(editor_hodmid, editor_mid, appData, 
														(xxx.mode === "ADD") ? APPLICATIONTYPES.addMember : APPLICATIONTYPES.editMember, 
														OWNER.prws);
   console.log(xxx.hid);                                         
   await set_hod_applock(xxx.hid, myRec.id);
	sendok(res, myRec);
});

router.get('/editgotra/:editor_hodmid/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_hodmid, editor_mid, appData } = req.params;
	var myRec = await addApplication(editor_hodmid, editor_mid, appData, APPLICATIONTYPES.editGotra, OWNER.prws);	

   // set the family lock
   var xxx = JSON.parse(appData);
   await set_hod_applock(xxx.hid, myRec.id);   
	sendok(res, myRec);
});


router.get('/delete/:editorMid/:applicationId', async function (req, res) {
  setHeader(res);
	var {editorMid, applicationId } = req.params;
	
	// Create a log entry for the given Application
	var editorRec = await memberGetByMidOne(Number(editorMid));
	if (!editorRec) return senderr(res, 601, 'Invalid editor mid');
	
	var aRec = await M_Application.findOne({id: applicationId});
	if (!aRec) return senderr(res, 602, 'Invalid Application Id');
	
	await M_Application.deleteOne({id: applicationId});

   // Now remove the family lock
   var tmp = JSON.parse(aRec.data);
   await clear_hod_applock(tmp.hid);
   
   // Required for marriage application
   if (tmp.spouseMemberRec)
      await clear_hod_applock(tmp.spouseMemberRec.hid);

	//console.log(aRec);
   var hodRec = await M_Hod.findOne({hid: tmp.hid});
   var hodMemberRec = await memberGetByMidOne(hodRec.mid);
	let myLogRec = new M_PrwsLog();
	myLogRec.date = new Date();
	myLogRec.mid = hodMemberRec.mid;
	myLogRec.name = getMemberName(hodMemberRec, false);         // **** This will have HOD name and not editor name
	myLogRec.desc = "Application " + aRec.id + " deleted by " +  getMemberName(editorRec, false) ;
	myLogRec.isAdmin = true;
	myLogRec.action = "Delete";
	myLogRec.data = "";
	myLogRec.referenceId = aRec.id;
	myLogRec.status = true;
	await myLogRec.save();

	
	sendok(res, "Done");
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
	
   // Now remove the family lock
   var tmp = JSON.parse(aRec.data);
   await clear_hod_applock(tmp.hid);  
   
   // Required for marriage application
   if (tmp.spouseMemberRec)
      await clear_hod_applock(tmp.spouseMemberRec.hid);
   
	// Now Log the approve action.	
   var hodRec = await M_Hod.findOne({hid: tmp.hid});
   var hodMemberRec = await memberGetByMidOne(hodRec.mid);	let myLogRec = new M_PrwsLog();
	myLogRec.date = new Date();
	myLogRec.mid = hodMemberRec.mid;
	myLogRec.name = getMemberName(hodMemberRec, false);
	myLogRec.desc = "Application " + aRec.id + " rejected by " +  getMemberName(adminRec, false)  + " for \"" + aRec.desc + "\"" ;
	myLogRec.isAdmin = true; //isAdmin;
	myLogRec.action = aRec.desc;
	myLogRec.data = JSON.stringify(aRec);
	myLogRec.referenceId = aRec.id;
	myLogRec.status = true;
	await myLogRec.save();
});

router.get('/approve/:appId/:adminMid/:comments', async function (req, res) {
  setHeader(res);
	var {appId, adminMid,comments } = req.params;
	//console.log(appId, comments, adminMid);

	let aRec = await M_Application.findOne({id: appId});
	if (!aRec) return senderr(res, 601, 'Application not found');
	
	var retObject = {status: false};
   //console.log(aRec.desc);
   
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
		case APPLICATIONTYPES.editGeneral:
			retObject = await approve_editGeneral(aRec);
			break;
      case APPLICATIONTYPES.unMarriage:
			retObject = await approve_unMarriage(aRec);
			break;   
      case APPLICATIONTYPES.transferMember:
			retObject = await approve_transferMember(aRec);
			break;      
      case APPLICATIONTYPES.marriage:
			retObject = await approve_marriage(aRec);
			break;      
		default:
			retObject = {status: false, error: APPROVE_ERRORS.ERROR602};
         break;
	}
	
	if (!retObject.status) {
      var error = (retObject.error) ? retObject.error : APPROVE_ERRORS.ERROR603;
      return senderr(res, error.code, error.desc);
   }
   
	// Update application record
	var adminRec = await memberGetByMidOne(Number(adminMid));	
	
	aRec.status = APPLICATIONSTATUS.approved;
   aRec.approvalDate =new Date();
	aRec.comments = comments;

	aRec.adminMid = adminRec.mid;
	aRec.adminName = getMemberName(adminRec, false);
	await aRec.save();	
	
   // clear lock
   var appData = JSON.parse(aRec.data);
   await clear_hod_applock(appData.hid);
   
   // Required for marriage application
   if (appData.spouseMemberRec)
      await clear_hod_applock(appData.spouseMemberRec.hid); 
   
	// Now Log the approve action.	
	let myLogRec = new M_PrwsLog();
	myLogRec.date = new Date();
	myLogRec.mid = adminMid;
	myLogRec.name = getMemberName(adminRec, false);
	myLogRec.desc = "Application " + aRec.id + " approved by " +  getMemberName(adminRec, false)  + " for \"" + aRec.desc + "\"" ;
	myLogRec.isAdmin = true;  //isAdmin;
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

	var myRec = await memberGetByMidOne(myData.oldMemberRec.mid);
   if (!myRec) return {status: false};
   //console.log(myData);

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


async function approve_unMarriage(aRec) {
	var myData = JSON.parse(aRec.data);
   console.log(myData);
   var myRec = await memberGetByMidOne(myData.memberRec.mid);
   if (!myRec) return {status: false};
   
   myRec.emsStatus = 'Unmarried';
   myRec.spouseMid = 0;
     
	//console.log(myRec);
	await memberUpdateOne(myRec);
	return {status: true, record: myRec};	
}

async function approve_editGeneral(aRec) {
	var myData = JSON.parse(aRec.data);
   if (myData.newHodRec.newCity) return {status: false, error: APPROVE_ERRORS.NEWCITY};
   if (myData.newHodRec.newCountry) return {status: false, error: APPROVE_ERRORS.NEWCOUNTRY};
	console.log(myData);   
   
	var myRec = await M_Hod.findOne({hid: myData.hid});
   console.log(myRec);
	// Update Address details
   myRec.indianResident = myData.newHodRec.indianResident;
   myRec.resAddr1 = myData.newHodRec.resAddr1;
   myRec.resAddr2 = myData.newHodRec.resAddr2;
   myRec.resAddr3 = myData.newHodRec.resAddr3;
   myRec.resAddr4 = myData.newHodRec.resAddr4;
   myRec.resAddr5 = myData.newHodRec.resAddr5;
   myRec.suburb = myData.newHodRec.suburb;
   myRec.city = myData.newHodRec.city;
   myRec.country = myData.newHodRec.country;
   myRec.pinCode = myData.newHodRec.pinCode;
   myRec.district = myData.newHodRec.district;
   myRec.state = myData.newHodRec.state;
   myRec.resPhone1 = myData.newHodRec.resPhone1;
   myRec.resPhone2 = myData.newHodRec.resPhone2;
   myRec.village = myData.newHodRec.village;
   await myRec.save();

	return {status: true, record: myRec};
}


async function approve_editGotra(appRec) {
	var appData = JSON.parse(appRec.data);
	console.log(appData);
	// First get the HOD record
	var hodRec = await M_Hod.findOne({hid: appData.hid});
	if (!hodRec) return {status: false, error: APPROVE_ERRORS.NOHODREC};
	if (!appData.newData.existingGotra) return {status: false, error: APPROVE_ERRORS.NEWGOTRA};

	hodRec.gotra = appData.newData.gotra;
	hodRec.caste = appData.newData.caste;
	hodRec.subCaste = appData.newData.subCaste;
	await hodRec.save();
	
	console.log(hodRec);
   return {status: true, record: hodRec};
}


// Member ceased approve
async function approve_memberCeased(aRec) {
   //console.log("Hello");
	
	var myData = JSON.parse(aRec.data);
	console.log(myData);
	// Get all the members of the family
	var otherMembers = await memberGetByHidMany(myData.hid);
   console.log(otherMembers);
	// ceased record and other member record
	var ceasedRec = otherMembers.find(x => x.mid === myData.ceasedMid);
   console.log(ceasedRec);
   //return {status: false};
	otherMembers = _.sortBy(otherMembers.filter(x => x.mid !== myData.ceasedMid), 'order');
	// if new Hod, then bring it to the top
	if (myData.newHodMid !== 0) {
		var tmp = otherMembers.find(x => x.mid === myData.newHodMid);
		otherMembers = [tmp].concat(otherMembers.filter(x => x.mid !== myData.newHodMid));
	}
	
	// first ceasedRec Update
	ceasedRec.ceased = true;
   ceasedRec.humadMember = false;
   ceasedRec.pjymMember = false;
   ceasedRec.prwsMember = false;
	await memberUpdateOne(ceasedRec);
	
   // Update Humad and Pjym record if required
   await setHumadMemberActiveflag(ceasedRec.mid, false);
   await setPjymMemberActiveflag(ceasedRec.mid, false);
   
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
	var i;
	var myData = JSON.parse(aRec.data);
	//console.log(myData);
	
   
	// Get all the members of the family
	var allMembers = await memberGetByHidMany(myData.hid);
	
	// Bring record of HOD on the top and relation will be Self
	var newHodMemberRec = allMembers.find(x => x.mid === myData.newHodMid);
   newHodMemberRec.relation = 'Self';
   newHodMemberRec.order = 0;
   //console.log(newHodMemberRec.order, newHodMemberRec.mid, newHodMemberRec.firstName, newHodMemberRec.relation);
   
   // Now balance members with new relation and new order
   var balanceMembersRec = [];
   for (i=0; i<myData.midList.length; ++i) {
      var mIdx = allMembers.findIndex( x => x.mid === myData.midList[i] );
      allMembers[mIdx].relation = myData.relationList[i];
      balanceMembersRec.push(allMembers[mIdx]);
      allMembers[mIdx].order = i + 1;
      //console.log(allMembers[mIdx].order, allMembers[mIdx].mid, allMembers[mIdx].firstName, allMembers[mIdx].relation);
   }   
	allMembers = [newHodMemberRec].concat(balanceMembersRec);
 
	// update all member records
	await memberUpdateMany(allMembers);
	
	// Update mid of the new hod in HOD record
	var hodRec = await M_Hod.findOne({hid: myData.hid});
	hodRec.mid = myData.newHodMid;
	await hodRec.save();

	// All done
	return {status: true, record: hodRec};
}


// Member ceased approve
async function approve_transferMember(aRec) {	
   var humadUpdate =[];
   var pjymUpdate = [];
   // get new HID of the new family
   var brandNewHid = await getNewHodNumber();   
   console.log(brandNewHid);
   
   
	var myData = JSON.parse(aRec.data);
	console.log(myData);
   if (!myData.createNewFamily) return {status: false, error: APPROVE_ERRORS.NOMERGE};  // Currently merge family is not supported
   
   // Get all members and hod record
   var hodRec = await M_Hod.findOne({hid: myData.hid});
   if (!hodRec) return {status: false, error: APPROVE_ERRORS.NOHODREC}; 
   
   // get new family hod record
   var newHodRec = null;
   if (myData.createNewFamily)   {
      newHodRec = new M_Hod();
      newHodRec.hid = hodRec.brandNewHid;
      newHodRec.mid = hodRec.mid;
      newHodRec.gotra = hodRec.gotra;
      newHodRec.village = hodRec.village
      newHodRec.resAddr1 = hodRec.resAddr1;
      newHodRec.resAddr2 = hodRec.resAddr2;
      newHodRec.resAddr3 = hodRec.resAddr3;
      newHodRec.resAddr4 = hodRec.resAddr4;
      newHodRec.resAddr5 = hodRec.resAddr5;
      newHodRec.resAddr6 = hodRec.resAddr6;
      newHodRec.suburb = hodRec.suburb;
      newHodRec.city = hodRec.city;
      newHodRec.pinCode = hodRec.pinCode;
      newHodRec.district = hodRec.district;
      newHodRec.state = hodRec.state;
      newHodRec.resPhone1 = hodRec.resPhone1;
      newHodRec.resPhone2 = hodRec.resPhone2;
      newHodRec.caste = hodRec.caste;
      newHodRec.subCaste = hodRec.subCaste;
      newHodRec.division = hodRec.division;
      newHodRec.active = hodRec.active
      newHodRec.indianResident = hodRec.indianResident
      newHodRec.country = hodRec.country
      newHodRec.applock = false;
      newHodRec.applockId = 0;
   }
   else {
      //get HOD of the merged family
   }

   var allMembers = await memberGetByHidMany(myData.hid);
   console.log(allMembers.length);
   
   // First get the newFamily
   var newFamily = allMembers.filter( x => myData.transferMidList.includes(x.mid ) );
   var balanceFamily = allMembers.filter( x => myData.balanceFamilyMid.includes(x.mid) );
   
   // Now update the Balance family.
   // Start with relation
   var i = 0;
   if (myData.balanceFamilyHodMid != hodRec.mid) {
      console.log("Balance family HOD changed");
      // Update relation
      for(i=0; i<myData.balanceFamilyMid.length; ++i) {
        var memIdx = balanceFamily.findIndex(x => x.mid == myData.balanceFamilyMid[i]);
        balanceFamily[memIdx].relation = myData.balanceFamilyRelation[i];
      }
      // Now bring new hod to the top
      var topRec = balanceFamily.find(x => x.mid == myData.balanceFamilyHodMid);
      var remRecs = balanceFamily.filter(x => x.mid != myData.balanceFamilyHodMid);
      balanceFamily = [topRec].concat(remRecs); 
      console.log(balanceFamily);
   }
   // Now update the order
   for(i=0; i < balanceFamily.length; ++i) {
     balanceFamily[i].order = i;
     console.log(`${balanceFamily[i].firstName} ${balanceFamily[i].mid} ${balanceFamily[i].order} ${balanceFamily[i].relation} `); 
   }
   
   // Update balance family mid in hod record
   hodRec.mid = balanceFamily[0].mid;
   console.log(hodRec);
   
   // Now update the new family
   if (myData.createNewFamily) {
      
      
      // First update the new relation
      for(i=0; i<myData.transferMidList.length; ++i) {
         var memIdx = newFamily.findIndex(x => x.mid == myData.transferMidList[i]);
         newFamily[memIdx].relation = myData.transferRelation[i];
      }
      
      // Now Bring new Hod to the top
      var tmp1 = newFamily.find(x => x.mid == myData.newHodMid);
      var tmp2 = newFamily.filter(x => x.mid != myData.newHodMid);
      newFamily = [tmp1].concat(tmp2);
       

      // update Hid, Mid, order and check if Humad / Pjym member
      for(i=0; i<newFamily.length; ++i) {
         var newMid = brandNewHid*FAMILYMF + i + 1;
         
         // check if Humad member
         if (newFamily[i].humadMember) {
            humadUpdate.push({oldMid: newFamily[i].mid, newHid: brandNewHid, newMid: newMid});
         }
         // check if Pjym member
         if (newFamily[i].pjymMember) {
         pjymUpdate.push({oldMid: newFamily[i].mid, newHid: brandNewHid, newMid: newMid});
         }
         
         newFamily[i].hid = brandNewHid;
         newFamily[i].mid = newMid;
         newFamily[i].order = i;
         console.log(newFamily[i].hid, newFamily[i].firstName, newFamily[i].mid, newFamily[i].order, newFamily[i].relation);
      }
      // Update HOD hid and mid in hod record
      newHodRec.hid = brandNewHid;
      newHodRec.mid = newFamily[0].mid
      
      console.log(newHodRec);
   }
   else {
     // currently merge family not supported 
   }
   //return {status: false, error: APPROVE_ERRORS.NOMERGE};
   
   clearMemberListInMemory();
   
	// Save all records starting with  hod records
   if (myData.createNewFamily) {
      await newHodRec.save();
   }
   await hodRec.save();
   // Now save members records
   for(i=0; i<newFamily.length; ++i) {
      await newFamily[i].save();
   }
   for (i=0; i<balanceFamily.length; ++i) {
      await balanceFamily[i].save();
   }
   // now update Humad and Pjym records
   for(i=0; i < humadUpdate.length; ++i) {
      await updateNewHidMidInHumad(humadUpdate[i].oldMid, humadUpdate[i].newHid, humadUpdate[i].newMid);
   }
   for(i=0; i < pjymUpdate.length; ++i) {
      await updateNewHidMidInPjym(pjymUpdate[i].oldMid, pjymUpdate[i].newHid, pjymUpdate[i].newMid);
   }
   
   // update hid & mid of new family in Humad and Pjym records

	// All done
	return {status: true};
}

// Member ceased approve
async function approve_marriage(aRec) {	
	var myData = JSON.parse(aRec.data);
	console.log(myData);
   
   // get HOD record & member records
   var hodRec = await M_Hod.findOne({hid: myData.hid});
   var allMembersRec = await memberGetByHidMany(myData.memberRec.hid);
   
   var memberRec = allMembersRec.find(x => x.mid === myData.memberRec.mid);
   var spouseMemberRec = (myData.spouseMemberRec) ? await memberGetByMidOne(myData.spouseMemberRec.mid) : null;   
   var humadRec = null;
  
   
   if  (!spouseMemberRec) {
     // is not a Member
     return {status: false, error: APPROVE_ERRORS.NONONMEMMARR}; 
   }

   
   // if record of spouse is to be added 
   if (spouseMemberRec) {
      spouseMemberRec.hid = memberRec.hid;
      
      // get new mid for spouse
      var tmp  = _.sortBy(allMembersRec.filter(x => x.mid < x.hid*FAMILYMF + 50), 'mid').reverse();
      spouseMemberRec.mid = tmp[0].mid + 1;
      
      // now set the order
      tmp = _.sortBy(allMembersRec, 'order').reverse();
      spouseMemberRec.order = tmp[0].order + 1;
      
      // set marriage and date
      spouseMemberRec.emsStatus = 'Married';
      spouseMemberRec.dateOfMarriage = myData.dom;
      // update spouse Mid
      spouseMemberRec.spouseMid = memberRec.mid;
      // update new Name
      spouseMemberRec.firstName = myData.marriedName.firstName;
      spouseMemberRec.middleName = myData.marriedName.middleName;
      spouseMemberRec.lastName = myData.marriedName.lastName;
      //spouseMemberRec.mergedName = getMemberName(spouseMemberRec, false);
      
      // update spouse new relation WRT Hod
      
      spouseMemberRec.relation = myData.relation;
      
      // Update PRWS membership
      spouseMemberRec.prwsMember = memberRec.prwsMember;

      if (hodRec.caste != 'Humad') {
         humadRec = M_Humad.findOne({mid: myData.spouseMemberRec.mid, active: true});
         if (humadRec) {
            humadRec.active = false;
            humadRec.mid = spouseMemberRec.mid;
         }
      }
      
      //console.log(spouseMemberRec);
   }
   
   // Update marriage details of member
   memberRec.emsStatus = 'Married';
   memberRec.dateOfMarriage = myData.dom;
   memberRec.spouseMid = (spouseMemberRec) ? spouseMemberRec.mid : 0;
   //console.log(memberRec);

   //return {status: false, error: APPROVE_ERRORS.NOMERGE}; 
   await memberRec.save();
   
   if (spouseMemberRec)
      await spouseMemberRec.save();
   
   if (humadRec)
      await humadRec.save();
   
   return {status: true}; 
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

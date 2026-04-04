const {
	encrypt, decrypt, dbencrypt, dbToSvrText, svrToDbText, dbdecrypt,
      akshuGetUser, GroupMemberCount,  
      sendCricMail, sendCricHtmlMail,
	numberDate,  getDate,
	getMemberName,
} = require('./functions'); 

const { 
   clearMemberListInMemory,
   setHumadMemberActiveflag, setPjymMemberActiveflag,
   getNewHodNumber,
	memberGetByMidOne, memberUpdateOne,
	memberGetByHidMany,memberUpdateMany,
    set_hod_applock, clear_hod_applock, check_hod_applock,
} = require('./dbfunctions'); 

var router = express.Router();

async function updateNewHidMidInHumad(oldMid, newHid, newMid) {
   var humadRecs = await M_Humad.find({mid: oldMid});
   for(var i=0; i<humadRecs.length; ++i) {
     humadRecs[i].hid = newHid;
     humadRecs[i].mid = newMid;
     await humadRecs[i].save();
   }
}

async function updateNewHidMidInPjym(oldMid, newHid, newMid) {
   var pjymRecs = await M_Pjym.find({mid: oldMid});
   for(var i=0; i<pjymRecs.length; ++i) {
     pjymRecs[i].hid = newHid;
     pjymRecs[i].mid = newMid;
     await pjymRecs[i].save();
   }
}

var SEM_ENTERED = 0;

async function addApplication(hodmid, editor_mid, appData, appDesc, appOwner, autoReject = "") {
   while (SEM_ENTERED === 1)  ;             // Wait for other to complete the task
   SEM_ENTERED = 1;
   console.log("Set the flag to 1");
   if (hodmid != 0) {
        var myCheck = await check_hod_applock(Math.floor(hodmid / FAMILYMF));
        console.log(myCheck);
        if (myCheck != 0) {
          // application already pending from this familys
          console.log("Application pending");
          SEM_ENTERED = 0;
          return null;
       }
   }
   //
   var famHid = Math.floor(hodmid / FAMILYMF);
   var editHod =Math.floor(editor_mid / FAMILYMF);
   console.log(famHid, editHod)

   //
   var editorRec = null;
   var editorHodRec = null;
	//var myRec = await addApplication(0, editor_mid, appData, APPLICATIONTYPES.guestMembership, OWNER.prws);	
   
   if (hodmid != 0) {
     editorRec  = await memberGetByMidOne(Number(editor_mid));
     editorHodRec  = await memberGetByMidOne(Number(hodmid));
   }
   console.log(hodmid, editorHodRec);
   var justNow = new Date();
	
	let aRec = new M_Application();
	aRec.date = justNow;
	aRec.owner = appOwner;				//OWNER.prws;
	aRec.hid = 0;
	aRec.desc = appDesc;

	aRec.hodMid = (editorHodRec) ? editorHodRec.mid : 0;
	aRec.hodName = (editorHodRec) ? getMemberName(editorHodRec, false) : '';

	aRec.mid = Number(editor_mid);
	aRec.name = (editorRec) ? getMemberName(editorRec, false) : 'Guest';

	aRec.isMember = (hodmid !== 0);
	aRec.data = appData;
	aRec.status = (autoReject === "") ? APPLICATIONSTATUS.pending : APPLICATIONSTATUS.rejected;

   aRec.approvalDate = new Date(0);
	aRec.adminName = '';
	aRec.comments = autoReject;
	//console.log(aRec);
   
	let baseid =  (((justNow.getFullYear() * 100) + justNow.getMonth() + 1) * 100 + justNow.getDate()) * 1000;
	//console.log(baseid);
	let tmp = await M_Application.find({id: {$gt: baseid}}).limit(1).sort({id: -1});
	
	aRec.id = (tmp.length > 0) ? tmp[0].id + 1 : baseid + 1;
	
   //console.log(aRec);
	await aRec.save();

	// First find out if application is admin....
   /* to be finalised**************************************
	var isAdmin = "true"
   var tmpMid = (editorRec) ? editorRec.mid : 0;
   let adminRec = await M_Application.findOne({mid: tmpMid});
   isAdmin = (adminRec) ? "true" : "false";
   */
   var isAdmin = "true";
	
	// Create a log entry for the given Application
	
	let myLogRec = new M_PrwsLog();
	myLogRec.date = justNow;
	myLogRec.mid = (editorHodRec) ? editorHodRec.mid : Number(editor_mid) ;
	myLogRec.name = (editorHodRec) ? getMemberName(editorHodRec, Number(editor_mid)) : 'Guest';
	myLogRec.desc = "Application " + aRec.id + " by " +  ((editorRec) ? getMemberName(editorRec, false) : 'Guest')  + " for \"" + appDesc + "\"" ;
	myLogRec.isAdmin = isAdmin;
	myLogRec.action = appDesc;
	myLogRec.data = JSON.stringify(aRec);
	myLogRec.referenceId = aRec.id;
	myLogRec.status = true;
	await myLogRec.save();
	//console.log(myLogRec);
	//console.log("Mid: ", editorRec.mid);
	//console.log("Nam: ", getMemberName(editorHodRec, false));
	//console.log("Des: ", "Apply for " + appDesc + " by " +  getMemberName(editorHodRec, false));
	
   if (autoReject !== "") {
      myLogRec = new M_PrwsLog();
      myLogRec.date = justNow;
      myLogRec.mid = (editorHodRec) ? editorHodRec.mid : Number(editor_mid) ;
      myLogRec.name = (editorHodRec) ? getMemberName(editorHodRec, Number(editor_mid)) : 'Guest';
      myLogRec.desc = "Application " + aRec.id + " auto rejected by system "  + " for \"" + autoReject + "\"" ;
      myLogRec.isAdmin = isAdmin;
      myLogRec.action = appDesc;
      myLogRec.data = JSON.stringify(aRec);
      myLogRec.referenceId = aRec.id;
      myLogRec.status = true;
      await myLogRec.save();
      console.log(myLogRec);
     
   } 
   if (famHid !== editHod)
   if (editHod !=- 0) {
    // send mail to famHid
    console.log('Send mail to ', hodmid); 
    var myMsg = `Application ${aRec.id} (${appDesc}) by ${getMemberName(editorRec)} on ${getDate(justNow)}`;
	let htmlText = `<div>
		<h4 style="text-align: left;"><strong>Dear Member,</strong></h4>

		<p>Greetings from Pratapgarh Rajasthan Welfare Samiti</p>
		<p>Please note that an application has been made for your family details by Administrator.</p>
		<p>Application ${aRec.id} (${appDesc}) by ${getMemberName(editorRec)} on ${getDate(justNow)}.</p>
		<p>You can login in PRWS web site www.pjym.in and check the details.</p>
		<p><span style="text-align: left;"><strong>for Pratapgarh Rajasthan Welfare Samiti</strong></span></p>
		</div>`
   
    var myEmail = dbdecrypt(editorRec.email)
    myEmail = 'arunsalgia@gmail.com'
    let resp = await sendCricHtmlMail(myEmail, PRWSMAILHEADER.applicationbyAdmin, htmlText);

    console.log(myMsg);
   }
   
   console.log("Job done. Clearing flag");
   SEM_ENTERED = 0;     // done
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
   console.log(filterData);
   var cond = {};
   if (filterData.adminRec.mid === 0)
      cond = {mid: filterData.mid};
   else
      cond = {mid: {$gte: 0}};
   if (filterData.status !== 'All')
      cond["status"] = filterData.status;
   cond["owner"] = filterData.owner;
   
   	if (filterData.timeRange) {

		var startDate = new Date(filterData.startDate);
		startDate.setHours(0);
		startDate.setMinutes(0);
		startDate.setSeconds(0);
		startDate.setMilliseconds(0);
		
		var endDate = new Date(filterData.endDate);
		endDate.setHours(0);
		endDate.setMinutes(0);
		endDate.setSeconds(0);
		endDate.setMilliseconds(0);

		endDate.setDate(endDate.getDate()+1);
		//console.log(startDate, endDate);

		var tmp = [ { date: { $gte : startDate } }, { date : { $lt:  endDate} } ];
		//console.log(tmp);
		cond['$and'] = tmp;

	}

   console.log(cond);
   // Get Application in reverse order
	let myData = await M_Application.find(cond).sort({id: -1}).skip(filterData.currentPage*filterData.pageSize).limit(filterData.pageSize);
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


router.get('/approve/:appId/:adminMid/:comments', async function (req, res) {
  setHeader(res);
	var {appId, adminMid,comments } = req.params;
	//console.log(appId, comments, adminMid);

	let aRec = await M_Application.findOne({id: appId});
	if (!aRec) return senderr(res, 601, 'Application not found');
	//console.log(aRec);
	//return senderr(res, 601, 'Application not found');
	
	var retObject = {status: false};
   //console.log(aRec.desc);
   
	switch (aRec.desc) {
      case APPLICATIONTYPES.addMember:
         retObject = await approve_addMember(aRec);
			break;
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
         // now get the prwsmem update info from remarks
         var ppp = comments.split("ARUNSALGIA");
         console.log(ppp);
         comments = ppp[1];  // actual comments
			retObject = await approve_editGotra(aRec, ppp[0]);
			break;
		case APPLICATIONTYPES.editGeneral:
         var ppp = comments.split("ARUNSALGIA");
         console.log(ppp);
         comments = ppp[1];  // actual comments
			retObject = await approve_editGeneral(aRec, ppp[0]);
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

      case APPLICATIONTYPES.changeDom:
         retObject = await approve_changeDom(aRec);
			break; 
		default:
			retObject = {status: false, error: APPROVE_ERRORS.ERROR602};
         break;
	}
   //console.log(retObject);
   
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
	
    // send the mail to hod member
	let memberRec = await memberGetByMidOne(aRec.hodMid);
	let justNow = new Date();
	let memberEmail = dbdecrypt(memberRec.email);	
	let htmlText = `<div>
		<h4 style="text-align: left;"><strong>Dear Member,</strong></h4>

		<p>Greetings from Pratapgarh Rajasthan Welfare Samiti</p>
		<p>Application ${aRec.id} (${aRec.desc}) approved by ${aRec.adminName} on ${getDate(justNow)}.</p>
		<p><strong>Comments by admin: ${aRec.comments}</strong></p>
		<p>You can login in PRWS web site www.pjym.in and check the details.</p>
		<p><span style="text-align: left;"><strong>for Pratapgarh Rajasthan Welfare Samiti</strong></span></p>
		</div>`
   
    //console.log(htmlText);
    console.log(memberEmail);
    let resp = await sendCricHtmlMail(memberEmail, PRWSMAILHEADER.applicationApproved, htmlText);
 
   // clear lock
   var appData = JSON.parse(aRec.data);
   await clear_hod_applock(appData.hid);

   // Required for marriage application
   if (appData.spouseMemberRec)
      await clear_hod_applock(appData.spouseMemberRec.hid); 

   // get hod Name
   var hodRec = await M_Hod.findOne({hid: appData.hid});
   var hodMemberRec = await memberGetByMidOne(hodRec.mid);

	// Now Log the approve action.	
	let myLogRec = new M_PrwsLog();
	myLogRec.date = new Date();
	myLogRec.mid = (hodMemberRec) ? hodMemberRec.mid : 0;
	myLogRec.name = (hodMemberRec) ? getMemberName(hodMemberRec, false) : '';
	myLogRec.desc = "Application " + aRec.id + " approved by " +  getMemberName(adminRec, false)  + " for \"" + aRec.desc + "\"" ;
	myLogRec.isAdmin = true;  //isAdmin;
	myLogRec.action = aRec.desc;
	myLogRec.data = JSON.stringify(aRec);
	myLogRec.referenceId = aRec.id;
	myLogRec.status = true;
	await myLogRec.save();
	
	sendok(res, aRec);
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
	myLogRec.desc = `Application ${aRec.id} for "${aRec.desc}" deleted by ${getMemberName(editorRec, false)}`;
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
 
    // send the mail to hod member
	let memberRec = await memberGetByMidOne(aRec.hodMid);
	let justNow = new Date();
	let memberEmail = dbdecrypt(memberRec.email);	
	let htmlText = `<div>
		<h4 style="text-align: left;"><strong>Dear Member,</strong></h4>

		<p>Greetings from Pratapgarh Rajasthan Welfare Samiti</p>
		<p>Application ${aRec.id} (${aRec.desc}) rejected by ${getMemberName(adminRec)} on ${getDate(justNow)}.</p>
		<p><strong>Comments by admin: ${comments}</strong></p>
		<p>You can login in PRWS web site www.pjym.in and check the details.</p>
		<p><span style="text-align: left;"><strong>for Pratapgarh Rajasthan Welfare Samiti</strong></span></p>
		</div>`
   
    console.log(memberEmail);
    let resp = await sendCricHtmlMail(memberEmail, PRWSMAILHEADER.applicationRejected, htmlText);
    
	// Now Log the approve action.	
   var hodRec = await M_Hod.findOne({hid: tmp.hid});
   var hodMemberRec = await memberGetByMidOne(hodRec.mid);	
   
   let myLogRec = new M_PrwsLog();
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

router.get('/guestmembership/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_mid, appData } = req.params;

   console.log(editor_mid)
   var myAppData = JSON.parse(appData);
   console.log(myAppData);
   
   if (myAppData.caste !== CASTETYPES.nonHumad) {
      senderr(res, 601, 'Error');
      return;
   }
	var myRec = await addApplication(0, editor_mid, appData, APPLICATIONTYPES.guestMembership, OWNER.prws, APPROVE_ERRORS.NONHUMAD.desc);	
    //if (!myRec) return senderr(res, APPROVE_ERRORS.HODLOCK.code, APPROVE_ERRORS.HODLOCK.desc);

   //await set_hod_applock(xxx.hid, myRec.id);   
	senderr(res, APPROVE_ERRORS.NONHUMAD.code, APPROVE_ERRORS.NONHUMAD.desc);
});


router.get('/editfamilydetails/:editor_hodmid/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_mid, editor_hodmid, appData } = req.params;
	var myRec = await addApplication(editor_hodmid, editor_mid, appData, APPLICATIONTYPES.editGeneral, OWNER.prws);	
    if (!myRec) return senderr(res, APPROVE_ERRORS.HODLOCK.code, APPROVE_ERRORS.HODLOCK.desc);

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
    if (!myRec) return senderr(res, APPROVE_ERRORS.HODLOCK.code, APPROVE_ERRORS.HODLOCK.desc);

   // set the family lock
   var xxx = JSON.parse(appData);
   await set_hod_applock(xxx.hid, myRec.id);   
	sendok(res, myRec);
});

router.get('/humadupgrade/:editor_hodmid/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_mid, editor_hodmid, appData } = req.params;
	var myRec = await addApplication(editor_hodmid, editor_mid, appData, APPLICATIONTYPES.humadUpgrade, OWNER.humad);	
  if (!myRec) return senderr(res, APPROVE_ERRORS.HODLOCK.code, APPROVE_ERRORS.HODLOCK.desc);
   // set the family lock
   var xxx = JSON.parse(appData);
   await set_hod_applock(xxx.hid, myRec.id);   
	sendok(res, myRec);
});


router.get('/ceased/:editor_hodmid/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_hodmid, editor_mid, appData } = req.params;
	var myRec = await addApplication(editor_hodmid, editor_mid, appData, APPLICATIONTYPES.memberCeased, OWNER.prws);	
    if (!myRec) return senderr(res, APPROVE_ERRORS.HODLOCK.code, APPROVE_ERRORS.HODLOCK.desc);

   // set the family lock
   var xxx = JSON.parse(appData);
   await set_hod_applock(xxx.hid, myRec.id);   
	sendok(res, myRec);
});


router.get('/marriage/:editor_hodmid/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_hodmid, editor_mid, appData } = req.params;
	var myRec = await addApplication(editor_hodmid, editor_mid, appData, APPLICATIONTYPES.marriage, OWNER.prws);	
    if (!myRec) return senderr(res, APPROVE_ERRORS.HODLOCK.code, APPROVE_ERRORS.HODLOCK.desc);

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
    if (!myRec) return senderr(res, APPROVE_ERRORS.HODLOCK.code, APPROVE_ERRORS.HODLOCK.desc);

   // set the family lock
   var xxx = JSON.parse(appData);
   await set_hod_applock(xxx.hid, myRec.id);   
	sendok(res, myRec);
});


router.get('/changedom/:editor_hodmid/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_hodmid, editor_mid, appData } = req.params;
	var myRec = await addApplication(editor_hodmid, editor_mid, appData, APPLICATIONTYPES.changeDom, OWNER.prws);	
    if (!myRec) return senderr(res, APPROVE_ERRORS.HODLOCK.code, APPROVE_ERRORS.HODLOCK.desc);
   // set the family lock
   var xxx = JSON.parse(appData);
   console.log(xxx);
   await set_hod_applock(xxx.hid, myRec.id);   
	sendok(res, myRec);
});

router.get('/newhod/:editor_hodmid/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_hodmid, editor_mid, appData } = req.params;
	var myRec = await addApplication(editor_hodmid, editor_mid, appData, APPLICATIONTYPES.newHod, OWNER.prws);	
    if (!myRec) return senderr(res, APPROVE_ERRORS.HODLOCK.code, APPROVE_ERRORS.HODLOCK.desc);

   // set the family lock
   var xxx = JSON.parse(appData);
   await set_hod_applock(xxx.hid, myRec.id);   
	sendok(res, myRec);
});

router.get('/movemember/:editor_hodmid/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_mid, editor_hodmid, appData } = req.params;
	var myRec = await addApplication(editor_hodmid, editor_mid, appData, APPLICATIONTYPES.transferMember, OWNER.prws);	
    if (!myRec) return senderr(res, APPROVE_ERRORS.HODLOCK.code, APPROVE_ERRORS.HODLOCK.desc);

   // set the family lock
   var xxx = JSON.parse(appData);
   await set_hod_applock(xxx.hid, myRec.id);   
	sendok(res, myRec);
});


router.get('/addeditpersonal/:editor_hodmid/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_hodmid, editor_mid, appData } = req.params;
	var xxx = JSON.parse(appData);
    //console.log(xxx.hid);                                         
	var myRec = await addApplication(editor_hodmid, editor_mid, appData, 
														(xxx.mode === "ADD") ? APPLICATIONTYPES.addMember : APPLICATIONTYPES.editMember, 
														OWNER.prws);
    if (!myRec) return senderr(res, APPROVE_ERRORS.HODLOCK.code, APPROVE_ERRORS.HODLOCK.desc);
    await set_hod_applock(xxx.hid, myRec.id);
	sendok(res, myRec);
});

router.get('/editgotra/:editor_hodmid/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_hodmid, editor_mid, appData } = req.params;
	var myRec = await addApplication(editor_hodmid, editor_mid, appData, APPLICATIONTYPES.editGotra, OWNER.prws);	
    if (!myRec) return senderr(res, APPROVE_ERRORS.HODLOCK.code, APPROVE_ERRORS.HODLOCK.desc);

   // set the family lock
   var xxx = JSON.parse(appData);
   await set_hod_applock(xxx.hid, myRec.id);   
	sendok(res, myRec);
});


// Approval functions

async function approve_addMember(aRec) {
	var appData = JSON.parse(aRec.data);
   console.log(appData);
  
   // Get all Member
   allMembers = await memberGetByHidMany(appData.hid);
   
   // set hid, mid and order
   var myRec = new M_Member();
   myRec.hid = appData.memberRec.hid;
   allMembers = _.sortBy(allMembers, 'order').reverse();
   myRec.order = allMembers[0].order + 1;
   var tmp  = _.sortBy(allMembers.filter(x => x.mid < x.hid*FAMILYMF + 50), 'mid').reverse();
   myRec.mid = tmp[0].mid + 1;
   
	// Update Name details
	myRec.title = appData.memberRec.title;
	myRec.firstName = appData.memberRec.firstName;
	myRec.lastName = appData.memberRec.lastName;
	myRec.middleName = appData.memberRec.middleName;
	myRec.alias = appData.memberRec.alias;
   
	// Update personal details
	myRec.relation = appData.memberRec.relation;
	myRec.gender = appData.memberRec.gender;
	myRec.dob = appData.memberRec.dob;
	myRec.bloodGroup = appData.memberRec.bloodGroup;   


	// Update other details
	myRec.mobile = appData.memberRec.mobile;
	myRec.mobile1 = appData.memberRec.mobile1;
	myRec.email = svrToDbText(appData.memberRec.email);
	myRec.email1 = dbencrypt('-');
   
	// Office details
	myRec.occupation = appData.memberRec.occupation;
	myRec.education = appData.memberRec.education;
	myRec.officeName = appData.memberRec.officeName;
	myRec.officePhone = appData.memberRec.officePhone;
	myRec.officeAddr = '';
   
   myRec.spouseMid = 0;
   myRec.emsStatus = "Unmarried"
	myRec.dateOfMarriage = new Date();
   
	myRec.educationLevel = '';
	myRec.educationCategory = '';
	myRec.educationField = '';
	
   myRec.ceased = false;
	myRec.ceasedDate = new Date();
   
   allMembers = _.sortBy(allMembers, 'order');
	myRec.prwsMember = allMembers[0].prwsMember;
	myRec.humadMember = allMembers[0].humadMember;
   myRec.pjymMember = false
	myRec.pmmMember = false;
   console.log(myRec);

	await memberUpdateOne(myRec);
	return {status: true, record: myRec};
}



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
   if (!myRec) return {status: false, error: APPROVE_ERRORS.NOMEMRECORD};
   // If spouse there the also set that as unmarried
   spouseRec = null;
   if (myRec.spouseMid > 0) {
      spouseRec =  await memberGetByMidOne(myRec.mid); 
      if (!spouseRec) return {status: false, error: APPROVE_ERRORS.NOMEMRECORD};
   }
   
   myRec.emsStatus = 'Unmarried';
   myRec.spouseMid = 0;
   await memberUpdateOne(myRec);
   
   if (spouseRec) {
      spouseRec.emsStatus = 'Unmarried';
      spouseRec.spouseMid = 0;
      await memberUpdateOne(spouseRec);
   }
	
	return {status: true, record: myRec};	
}


async function approve_changeDom(aRec) {
	var myData = JSON.parse(aRec.data);
   console.log(myData);
   
   // get record of groom (boy)
   var boyRec = await memberGetByMidOne(myData.groomMid);
   //console.log(myData.groomMid, boyRec);
   if (!boyRec) return  {status: false, error: APPROVE_ERRORS.NOMEMRECORD};
   // get record of bride (girl)
   var girlRec = await memberGetByMidOne(myData.brideMid);
   if (!girlRec) return  {status: false, error: APPROVE_ERRORS.NOMEMRECORD};
   //console.log(girlRec);
   
   // Now update the relation
   boyRec.emsStatus = 'Married';
   boyRec.spouseMid = myData.brideMid;
   boyRec.dateOfMarriage = myData.dom;
   
   girlRec.emsStatus = 'Married';
   girlRec.spouseMid = myData.groomMid;
   girlRec.dateOfMarriage = myData.dom;
   //console.log("update");
   
	await memberUpdateOne(boyRec);
   await memberUpdateOne(girlRec);
   //console.log("saved");
   
	return {status: true, record: boyRec};	
}

async function approve_editGeneral(aRec, prwsMem) {
   console.log('approve_editGeneral');
	var myData = JSON.parse(aRec.data);
   console.log(myData.newHodRec);

   if (myData.newHodRec.newCity) {
      // first check if new city got added by super admin.
      console.log(`Checkg for city ${myData.newHodRec.city}`);
      var tmp = await M_City.findOne({city: myData.newHodRec.city})
      if (!tmp) return {status: false, error: APPROVE_ERRORS.NEWCITY};
   }
   if (myData.newHodRec.newCountry) {
      // first check if new city got added by super admin.
      console.log(`Checkg for country ${myData.newHodRec.country}`);
      var tmp = await M_Country.findOne({country: myData.newHodRec.country})
      console.log(tmp);
      if (!tmp) return {status: false, error: APPROVE_ERRORS.NEWCOUNTRY};
      console.log('Country found');
   }
	console.log(myData);   
   //return {status: false, error: APPROVE_ERRORS.ERROR601};
   
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
   
   // check PRWS membership is to be updated
   var allMembers = [];
   console.log(prwsMem);
   if (['true', 'false'].includes(prwsMem)) {
      newPrwsSts = (prwsMem == 'true') ? true : false;
      console.log(newPrwsSts);
      allMembers = await memberGetByHidMany(myData.hid);
      for(var i=0; i<allMembers.length; ++i) {
         allMembers[i].prwsMember = newPrwsSts;
      }
      await memberUpdateMany(allMembers);
   }
   else {
      console.log("No Change ************");
   }
  

	return {status: true, record: myRec};
}


async function approve_editGotra(appRec, prwsMem) {
	var appData = JSON.parse(appRec.data);
	//console.log(appData);
	// First get the HOD record
	var hodRec = await M_Hod.findOne({hid: appData.hid});
	if (!hodRec) return {status: false, error: APPROVE_ERRORS.NOHODREC};
   
	if (!appData.newData.existingGotra) {
     // Not existing gotra. Confirm it has been entered manually
     var tmp = await M_Gotra.findOne({gotra: appData.newData.gotra, enabled: true});
     if (!tmp) return {status: false, error: APPROVE_ERRORS.NEWGOTRA};
   }
   
	hodRec.gotra = appData.newData.gotra;
	hodRec.caste = appData.newData.caste;
	hodRec.subCaste = appData.newData.subCaste;
 	await hodRec.save(); 
   
   // check PRWS membership is to be updated
   var allMembers = [];
   if (['true', 'false'].includes(prwsMem)) {
      newPrwsSts = (prwsMem == 'true') ? true : false;
      console.log(newPrwsSts);
      allMembers = await memberGetByHidMany(appData.hid);
      for(var i=0; i<allMembers.length; ++i) {
         allMembers[i].prwsMember = newPrwsSts;
      }
      await memberUpdateMany(allMembers);
   }
   else {
      console.log("No Change ************");
   }

	//console.log(hodRec);
   return {status: true, record: hodRec};
}


// Member ceased approve
async function approve_memberCeased(aRec) {	
	var myData = JSON.parse(aRec.data);

	// Get all the members of the family
	var allMembers = await memberGetByHidMany(myData.hid);

	// ceased record and other member record
	var ceasedRec = allMembers.find(x => x.mid === myData.ceasedMid);
   //console.log(ceasedRec);

	var otherMembers = _.sortBy(allMembers.filter(x => x.mid !== myData.ceasedMid), 'order');
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
	
	// Update spouseMid & emsStatus if required
	if (ceasedRec.spouseMid !== 0) {
		var tmp = otherMembers.find(x => x.mid === ceasedRec.spouseMid);
      if (tmp) {
         tmp.spouseMid = 0;		// SPouse not alive
         tmp.emsStatus = (tmp.gender === "Female") ? "Widow" : "Widower";
      }
	}

	// set order for balance Family
	for(var i=0; i<otherMembers.length; ++i) {
		otherMembers[i].order = i;
	}
	
	await memberUpdateOne(ceasedRec);
	// update all members data
	await memberUpdateMany(otherMembers);
	
	// If new hod then update HOD record
	if (myData.newHodMid !== 0) {
		var hodRec = await M_Hod.findOne({hid: myData.hid});
		hodRec.mid = myData.newHodMid;
		await hodRec.save();
	}
   if (myData.onlyMember) {
      // No other member in family. Mark HOD as non active
      var hodRec = await M_Hod.findOne({hid: myData.hid});
		hodRec.active = false;
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


// Member transfer approve
async function approve_transferMember_org(aRec) {	
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

// Member transfer approve
async function approve_transferMember(aRec) {	
	var myData = JSON.parse(aRec.data);
	//console.log(myData);
   
   var retStatus = {};

   if (myData.createNewFamily)
     retStatus = await approve_transferMember_create(aRec, myData);
   else
     retStatus = await approve_transferMember_merge(aRec, myData);

   return retStatus
}

async function approve_transferMember_merge(aRec, myData) {	
   var humadUpdate =[];
   var pjymUpdate = [];
   
   // get merged family HOD record
   var mergedFamilyHodRec = await M_Hod.findOne({hid: myData.mergedFamilyHid});
   if (!mergedFamilyHodRec) return {status: false, error: APPROVE_ERRORS.NOHODREC}; 

   // hod record
   var hodRec = await M_Hod.findOne({hid: myData.hid});
   if (!hodRec) return {status: false, error: APPROVE_ERRORS.NOHODREC}; 
   
   // Get family members of family in which few members are to be added
   var mergedMembers = await memberGetByHidMany(mergedFamilyHodRec.hid);
   var mergedHodMemberRec = mergedMembers.find(x => x.mid === mergedFamilyHodRec.mid);
   
   // Now get the next MID available
   var tmp  = _.sortBy(mergedMembers.filter(x => x.mid < x.hid*FAMILYMF + 50), 'mid').reverse();
   var nextMid = tmp[0].mid + 1;
   
   // get new sort Number
   tmp  = _.sortBy(mergedMembers.filter(x => x.mid < x.hid*FAMILYMF + 50), 'order').reverse();
   var nextOrder = tmp[0].order + 1;
   
   console.log(nextMid, nextOrder);
   
   // Get members who are to be added to merged family
   var allMembers = await memberGetByHidMany(myData.hid);

   // First get the transferFamily who are moving from current family to merge family
   var transferFamily = allMembers.filter( x => myData.transferMidList.includes(x.mid ) );
   // now add them to the merged family

    // First update the new relation
   for(i=0; i<myData.transferMidList.length; ++i) {
      var memIdx = transferFamily.findIndex(x => x.mid == myData.transferMidList[i]);
      transferFamily[memIdx].relation = myData.transferRelation[i];
   }
   
   var midMapping = [];  // required for updating spouse mid
   for(i=0; i<transferFamily.length; ++i, ++nextMid, ++nextOrder) {   
      
      // check if Humad member
      if (transferFamily[i].humadMember) {
         humadUpdate.push({oldMid: transferFamily[i].mid, newHid: myData.mergedFamilyHid, newMid: nextMid});
      }
      // check if Pjym member
      if (transferFamily[i].pjymMember) {
         pjymUpdate.push({oldMid: transferFamily[i].mid, newHid: myData.mergedFamilyHid, newMid: nextMid});
      }
      
      midMapping.push({oldMid: transferFamily[i].mid, newMid: nextMid})
      
      transferFamily[i].hid = myData.mergedFamilyHid;
      transferFamily[i].mid = nextMid;
      transferFamily[i].order = nextOrder;
      // Update prwsMemberflag as per new family
      transferFamily[i].prwsMember = transferFamily[i].prwsMember && mergedHodMemberRec.prwsMember;
      
      console.log(transferFamily[i].hid, transferFamily[i].firstName, transferFamily[i].mid, transferFamily[i].order, transferFamily[i].relation);  
   }
   // Now update spouse mid
   for(i=0; i<transferFamily.length; ++i, ++nextMid, ++nextOrder) { 
     tmp = midMapping.find(x => x.oldMid == transferFamily[i].spouseMid);
     transferFamily[i].spouseMid = (tmp) ? tmp.newMid : 0;
   }
   
   
   // Now work on balance family
   var balanceFamily = allMembers.filter( x => myData.balanceFamilyMid.includes(x.mid) );   
   if (balanceFamily.length > 0) {
      // There is no change in mid or hid for these members
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
         
         hodRec.mid = myData.balanceFamilyHodMid;
      }
      // Now update the order and spouse mid
      for(i=0; i < balanceFamily.length; ++i) {
         balanceFamily[i].order = i;
        
         // update spouse mid in case couple got separated
         tmp = balanceFamily.find(x => x.mid === balanceFamily[i].spouseMid);
         if (!tmp) balanceFamily[i].spouseMid = 0;

         console.log(`${balanceFamily[i].firstName} ${balanceFamily[i].mid} ${balanceFamily[i].order} ${balanceFamily[i].relation} `); 
      }      
   }
   else {
      // Nobody left in balance family. Set HOD record as inactive
      hodRec.active = false;
   }
   
   // Now we will start saving the record
   
   clearMemberListInMemory();
   
   await hodRec.save();
   
   // No change was required in merged family hod record. Thus no need to save
   
   // Now save transferred  members record
   for(i=0; i<transferFamily.length; ++i) {
      await transferFamily[i].save();
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

	// All done
	return {status: true};

}

async function approve_transferMember_create(aRec, myData) {	
   var humadUpdate =[];
   var pjymUpdate = [];
   var tmp = null;
   var i = 0;
   
   // get new HID of the new family
   var brandNewHid = await getNewHodNumber();   
   console.log(brandNewHid);

   // Get all members and hod record
   var hodRec = await M_Hod.findOne({hid: myData.hid});
   if (!hodRec) return {status: false, error: APPROVE_ERRORS.NOHODREC}; 
   
   // get new family hod record
   var newHodRec = new M_Hod();
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

   var allMembers = await memberGetByHidMany(myData.hid);
   //console.log(allMembers.length);
   
   // First get the newFamily
   var newFamily = allMembers.filter( x => myData.transferMidList.includes(x.mid ) );
   var balanceFamily = allMembers.filter( x => myData.balanceFamilyMid.includes(x.mid) );
   
   // Now update the Balance family.
   // Start with relation

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
   
   // Now update the order and spouseMid
   for(i=0; i < balanceFamily.length; ++i) {
     balanceFamily[i].order = i;
     
     tmp = balanceFamily.find(x => x.mid === balanceFamily[i].spouseMid);
     if (!tmp) balanceFamily[i].spouseMid = 0;
     
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
      var midMapping = [];  // required for updating spouse mid
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
         
         midMapping.push({oldMid: newFamily[i].mid, newMid: newMid})
      
         newFamily[i].hid = brandNewHid;
         newFamily[i].mid = newMid;
         newFamily[i].order = i;
         console.log(newFamily[i].hid, newFamily[i].firstName, newFamily[i].mid, newFamily[i].order, newFamily[i].relation);
      }
      
      // Now update spouse mid
      for(i=0; i<newFamily.length; ++i) { 
        tmp = midMapping.find(x => x.oldMid == newFamily[i].spouseMid);
        newFamily[i].spouseMid = (tmp) ? tmp.newMid : 0;
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

      /**if (hodRec.caste != 'Humad') {
         humadRec = M_Humad.findOne({mid: myData.spouseMemberRec.mid, active: true});
         if (humadRec) {
            humadRec.active = false;
            humadRec.mid = spouseMemberRec.mid;
         }
      }
      **/
      
      //console.log(spouseMemberRec);
   }
   // if spouse not a member and application is boy
   else if  (memberRec.gender === 'Male') {
      spouseMemberRec = new M_Member();
      
      
      spouseMemberRec.hid = memberRec.hid;
      
      // get new mid for spouse
      var tmp  = _.sortBy(allMembersRec.filter(x => x.mid < x.hid*FAMILYMF + 50), 'mid').reverse();
      spouseMemberRec.mid = tmp[0].mid + 1;
      
      // now set the order
      tmp = _.sortBy(allMembersRec, 'order').reverse();
      spouseMemberRec.order = tmp[0].order + 1;

      // update spouse Mid
      spouseMemberRec.spouseMid = memberRec.mid;

      // set marriage and date
      spouseMemberRec.emsStatus = 'Married';
      spouseMemberRec.dateOfMarriage = myData.dom;
  
      // update new Name
      spouseMemberRec.title = 'Smt';
      spouseMemberRec.firstName = myData.spousePersonalDetails.firstName;
      spouseMemberRec.middleName = myData.spousePersonalDetails.middleName;
      spouseMemberRec.lastName = myData.spousePersonalDetails.lastName;
      spouseMemberRec.alias = myData.spousePersonalDetails.alias;
      
      // update spouse new relation WRT Hod
      spouseMemberRec.relation = myData.relation;
      
      spouseMemberRec.gender = 'Female';
      spouseMemberRec.dob = myData.spousePersonalDetails.dob;
      
      spouseMemberRec.bloodGroup = myData.spousePersonalDetails.bloodGroup;
      if (spouseMemberRec.bloodGroup === 'NotKnown') spouseMemberRec.bloodGroup = '';
      

      spouseMemberRec.education = '';
      spouseMemberRec.educationLevel = '';
      spouseMemberRec.educationCategory = '';
      spouseMemberRec.educationField = '';
      spouseMemberRec.occupation = '';
      spouseMemberRec.email = dbencrypt('-');
      spouseMemberRec.officeName = '';
      spouseMemberRec.officeAddr = '';
      spouseMemberRec.officePhone = '';
      spouseMemberRec.mobile = myData.spousePersonalDetails.mobile;
      spouseMemberRec.mobile1 = myData.spousePersonalDetails.mobile1;
      var tmp = (myData.spousePersonalDetails.email !== '') ?  myData.spousePersonalDetails.email : '-';
      spouseMemberRec.email1 = dbencrypt(tmp);
      spouseMemberRec.ceased = false;
      spouseMemberRec.ceasedDate = new Date(0);

      // Update PRWS membership
      spouseMemberRec.prwsMember = memberRec.prwsMember;

      spouseMemberRec.pjymMember = false;
      spouseMemberRec.humadMember = false;
      spouseMemberRec.pmmMember = false;
           
   }
   else {
     return {status: false, error: APPROVE_ERRORS.NONONMEMMARR};    
   }

   // Update marriage details of member
   memberRec.emsStatus = 'Married';
   memberRec.dateOfMarriage = myData.dom;
   memberRec.spouseMid = (spouseMemberRec) ? spouseMemberRec.mid : 0;
   //console.log(memberRec);
 
   await memberUpdateOne(memberRec);
   if (spouseMemberRec)
      await memberUpdateOne(spouseMemberRec);
   
   //if (humadRec)
   //   await humadRec.save();
   
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

var router = express.Router();
const {  
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

router.use('/', function(req, res, next) {
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR,  ERR_NODB); return; }
 
  next('route');
});

// send list of in chunks of blocks.
// Each Block will contain #medicines which is confgired in MEDBLOCK

router.get('/list', async function(req, res, next) {
  setHeader(res);

  var allAdmin = await M_Admin.find({});

	var allMids = _.map(allAdmin, 'mid');
	let myNames = await M_Member.find({mid: {$in: allMids}}, 
		{_id: 0, mid: 1, title: 1, firstName: 1, middleName: 1, lastName: 1});

	let result = [];
	for(let i=0; i<allAdmin.length; ++i) {
		tmp = myNames.find(x => x.mid === allAdmin[i].mid);
		result.push({
			mid: allAdmin[i].mid,
			title: tmp.title,
			name: getMemberName(tmp),
			superAdmin: allAdmin[i].superAdmin,
			pjymAdmin: allAdmin[i].pjymAdmin,
			humadAdmin: allAdmin[i].humadAdmin,
			prwsAdmin: allAdmin[i].prwsAdmin,
			pmmAdmin: allAdmin[i].prwsAdmin,
			superduper: allAdmin[i].superduper
		});
	}
	result = _.sortBy(result, 'name');
	sendok(res, result);
});


router.get('/add/:editorMid/:mid/:superA/:pjym/:humad/:prws/:pmm', async function(req, res, next) {
  setHeader(res);
  
  var { editorMid, mid, superA, pjym, humad, prws, pmm } = req.params;
	mid = Number(mid);
	//console.log(mid);

   
	let adminRec = await M_Admin.findOne({mid: mid});
	if (adminRec) return senderr(res, APPROVE_ERRORS.DUPENTRY.code, APPROVE_ERRORS.DUPENTRY.desc);

	let memberRec = await M_Member.findOne({mid: mid});
	if (!memberRec) return senderr(res, APPROVE_ERRORS.NOMEMRECORD.code, APPROVE_ERRORS.NOMEMRECORD.desc);

   let editorRec = await M_Member.findOne({mid: editorMid});
   if (!editorRec) return senderr(res, APPROVE_ERRORS.NOMEMRECORD.code, APPROVE_ERRORS.NOMEMRECORD.desc);
   
   adminRec = new M_Admin();
	adminRec.mid = mid;
	adminRec.superAdmin = (superA == 'true');
	adminRec.humadAdmin = (humad == 'true');
	adminRec.pjymAdmin = (pjym == 'true');
	adminRec.prwsAdmin = (prws == 'true');
	adminRec.pmmAdmin = (pmm == 'true');
	adminRec.superduper = false;
	await adminRec.save();
 
 
	let result = {
		mid: adminRec.mid,
		title: memberRec.title,
		name: getMemberName(memberRec),
		superAdmin: adminRec.superAdmin,
		pjymAdmin: adminRec.pjymAdmin,
		humadAdmin: adminRec.humadAdmin,
		prwsAdmin: adminRec.prwsAdmin,
		pmmAdmin: adminRec.prwsAdmin,
		superduper: adminRec.superduper
	};
	sendok(res, result);

   myLogRec = new M_PrwsLog();
   myLogRec.date = new Date();
   myLogRec.mid = editorRec.mid;
   myLogRec.name = getMemberName(editorRec);
   myLogRec.desc = `New admin ${getMemberName(memberRec)} added by ${getMemberName(editorRec)}`;
   myLogRec.isAdmin = true;
   myLogRec.action = "Add admin";
   myLogRec.data = JSON.stringify(result);
   myLogRec.referenceId = 0;
   myLogRec.status = true;
   await myLogRec.save();
   //console.log(myLogRec);
	
});

router.get('/update/:editorMid/:mid/:superA/:pjym/:humad/:prws/:pmm', async function(req, res, next) {
  setHeader(res);
  
  var { editorMid, mid, superA, pjym, humad, prws, pmm } = req.params
   console.log('In update');
   
	let adminRec = await M_Admin.findOne({mid: mid});
	if (!adminRec) return senderr(res, APPROVE_ERRORS.NOTADMIN.code, APPROVE_ERRORS.NOTADMIN.desc);

	let memberRec = await M_Member.findOne({mid: mid});
	if (!memberRec) return senderr(res, APPROVE_ERRORS.NOMEMRECORD.code, APPROVE_ERRORS.NOMEMRECORD.desc);

   let editorRec = await M_Member.findOne({mid: editorMid});
	if (!editorRec) return senderr(res, APPROVE_ERRORS.NOMEMRECORD.code, APPROVE_ERRORS.NOMEMRECORD.desc);
   
	adminRec.superAdmin = (superA == 'true');
	adminRec.humadAdmin = (humad == 'true');
	adminRec.pjymAdmin = (pjym == 'true');
	adminRec.prwsAdmin = (prws == 'true');
	adminRec.pmmAdmin = (pmm == 'true');
	await adminRec.save();
 
	let result = {
		mid: adminRec.mid,
		title: memberRec.title,
		name: getMemberName(memberRec),
		superAdmin: adminRec.superAdmin,
		pjymAdmin: adminRec.pjymAdmin,
		humadAdmin: adminRec.humadAdmin,
		prwsAdmin: adminRec.prwsAdmin,
		pmmAdmin: adminRec.prwsAdmin,
		superduper: adminRec.superduper
	};
	sendok(res, result);

   myLogRec = new M_PrwsLog();
   myLogRec.date = new Date();
   myLogRec.mid = editorRec.mid;
   myLogRec.name = getMemberName(editorRec);
   myLogRec.desc = `Admin permission of ${getMemberName(memberRec)} updated by ${getMemberName(editorRec)}`;
   myLogRec.isAdmin = true;
   myLogRec.action = "Edit admin";
   myLogRec.data = '';
   myLogRec.referenceId = 0;
   myLogRec.status = true;
   await myLogRec.save();
   //console.log(myLogRec);	  
});

router.get('/membershipinfo', async function(req, res, next) {
  setHeader(res);
  
  /*tmp = new M_MembershipInfo();
  tmp.manch = "PRJM";
  tmp.desc = "PJYM Sadasya";
  tmp.level = 1;
  tmp.fees = 0;
  await tmp.save();*/
  
  var result = await M_MembershipInfo.find({}).sort({manch: 1, level: -1});
  //console.log(result);
  sendok(res, result);
	
});

router.get('/delete/:editor_mid/:mid', async function(req, res, next) {
  setHeader(res);
  
  var { editor_mid, mid } = req.params;

   console.log('delete');
   console.log(editor_mid, mid);
	let memberRec = await M_Member.findOne({mid: mid});
	if (!memberRec) return senderr(res, APPROVE_ERRORS.NOMEMRECORD.code, APPROVE_ERRORS.NOMEMRECORD.desc);

   let editorRec = await M_Member.findOne({mid: editor_mid});
   if (!editorRec) return senderr(res, APPROVE_ERRORS.NOMEMRECORD.code, APPROVE_ERRORS.NOMEMRECORD.desc);
   //console.log('looks okay');
   
	await M_Admin.deleteOne({mid: mid});
   
   myLogRec = new M_PrwsLog();
   myLogRec.date = new Date();
   myLogRec.mid = editorRec.mid;
   myLogRec.name = getMemberName(editorRec);
   myLogRec.desc = `Admin ${getMemberName(memberRec)} deleted by ${getMemberName(editorRec)}`;
   myLogRec.isAdmin = true;
   myLogRec.action = "Delete admin";
   myLogRec.data = '';
   myLogRec.referenceId = 0;
   myLogRec.status = true;
   await myLogRec.save();
   //console.log(myLogRec);
	sendok(res, "1 Admin deleted");
});


function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
} 

module.exports = router;
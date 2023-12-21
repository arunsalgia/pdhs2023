//const { pin } = require("pincode");

const {  akshuGetUser, GroupMemberCount,  
  encrypt, decrypt, dbencrypt, dbToSvrText, svrToDbText, dbdecrypt,
	numberDate, 
	generateOrder, generateOrderByDate,
	setOldPendingAppointment,
} = require('./functions'); 
var router = express.Router();


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

	let allHumads = await M_Humad.find({active: true}).sort({mid: 1, upgradeIndex: -1});
	let allMids = _.map(allHumads, 'mid');
	//allMids = _.uniqBy(allMids);
	let allMembers = await M_Member.find({mid: {$in: allMids}}, 
	{_id: 0, mid: 1, title: 1, firstName: 1, middleName: 1, lastName: 1, alias: 1, mobile: 1,
		dateOfMarriage: 1, dob: 1, gender: 1}).sort({lastName: 1, firstName: 1, middleName: 1 });
	//console.log(allHumads.length, allMembers.length);
	//console.log(allMembers);

	let myData = {humad: allHumads, member: allMembers };
	sendok(res, myData);
});		

router.get('/listbyalphabet/:chrStr', async function (req, res) {
  setHeader(res);
	var { chrStr } = req.params;
	
	let allMembers = await M_Member.find(
		{ lastName: { $regex: "^"+chrStr, $options: "i" }, humadMember: true }, 
		//{_id: 0, mid: 1, title: 1, firstName: 1, middleName: 1, lastName: 1, alias: 1, mobile: 1,
		//dateOfMarriage: 1, dob: 1, gender: 1})
		).sort({lastName: 1, firstName: 1, middleName: 1 });
		
	let allMids = _.map(allMembers, 'mid');
	let allHumads = await M_Humad.find({ mid: {$in: allMids}, active: true}).sort({mid: 1, upgradeIndex: -1});
	
	let myData = {humad: allHumads, member: allMembers };
	sendok(res, myData);
});	

router.get('/listwithnames', async function (req, res) {
  setHeader(res);

	//console.log(new Date());
	let allHumads = await M_Humad.find({active: true}, {_id: 0, __v: 0});
	console.log(new Date());
	/*let allNames = await M_Member.find(
		{humadMember: true, ceased: false}, 
		//{_id: 0, mid: 1, alias: 1, mobile: 1, title: 1, firstName: 1, middleName: 1, lastName: 1, bloodGroup: 1, dob: 1, gender: 1}
	).sort({lastName: 1, firstName: 1, middleName: 1 });
	//console.log(new Date());
	*/
	
	var allNames = allMemberlist.filter(x => !x.ceased && x.humadMember);
	for (var i=0; i< allNames.length; ++i) {
		allNames[i].email = dbToSvrText(allNames[i].email);
		allNames[i].email1 = dbToSvrText(allNames[i].email1);
	}
	//console.log(allPjym.length, allNames.length);
	
	sendok(res, {humad: allHumads, member: allNames});
});

router.get('/namelist/:fName/:mName/:lName', async function (req, res) {
  setHeader(res);
  var {fName, mName, lName } = req.params;

	let filterQuery;
	if ((fName === "-") && (mName === "-") && (lName === "-"))
		filterQuery = {};
  else if ((fName === "-") && (mName === "-"))
		filterQuery = {lastName: partFind(lName)};
	else if	((fName === "-") && (lName === "-"))
		filterQuery = {middleName: partFind(mName)};
	else if	((mName === "-") && (lName === "-"))
		filterQuery = {firstName:partFind(fName)};
	else if	(fName === "-")
		filterQuery = {middleName: partFind(mName),  lastName: partFind(lName) };
	else if	(mName === "-")
		filterQuery = {firstName: partFind(fName),  lastName: partFind(lName)};
	else 
		filterQuery = {firstName: partFind(fName),  middleName: partFind(mName), lastName: partFind(lName)};

	filterQuery["ceased"] = false;
	console.log(filterQuery);

	let myData = await M_Member.find(filterQuery).limit(36).sort({lastName: 1, firstName: 1, middleName: 1});
	//console.log(myData);
	sendok(res, myData);
});		

router.get('/hod/:hid', async function (req, res) {
  setHeader(res);
  var {hid } = req.params;
	let myData = await M_Member.find({hid: hid, ceased: false}).sort({order: 1});
	//console.log(myData);
	for(let i=0; i<myData.length; ++i) {
		myData[i].email = dbToSvrText(myData[i].email);
		myData[i].email1 = dbToSvrText(myData[i].email1);
	}
	sendok(res, myData);
});		


router.get('/upgrade/:mid/:newCategory', async function (req, res) {
  setHeader(res);
  var {mid, newCategory } = req.params;

	let currentRec = await M_Humad.findOne({mid: mid, active: true});

	let tmpRec = await M_Humad.find({ membershipNumber: {$regex: "^"+newCategory.substr(0, 1)} }).limit(1).sort({upgradeIndex: -1});
	let newNumber = (tmpRec.length > 0) ? tmpRec[0].upgradeIndex + 1 : 1;
	console.log(newNumber);
	
	let newRec = new M_Humad();
	newRec.hid = currentRec.hid;
	newRec.mid = currentRec.mid;
	
	console.log(newCategory);
	newRec.membershipNumber = newCategory.substr(0, 1) + "\\" + newNumber.toString();
	newRec.upgradeIndex = newNumber;
	newRec.membershipDate = new Date();
	newRec.membershipReceipt  = newCategory.substr(0, 1) + "\\" + newNumber.toString();
	newRec.remarks = (currentRec) ? "T/F "+currentRec.membershipNumber : "";
	newRec.active = true;
	
	if (currentRec) {
		currentRec.remarks = "T/T " + newRec.membershipNumber;
		currentRec.active = false;
	}
	
	console.log(currentRec);
	console.log(newRec);
	
	return senderr(res, 601, "Test");
	
	sendok(res, myData);
});		

router.get('/add/:hid/:mid/:newCategory', async function (req, res) {
  setHeader(res);
  var {hid, mid, newCategory } = req.params;
	hid = Number(hid);
	mid = Number(mid);
	newCategory = newCategory.toUpperCase();
	
	let currentRec = await M_Humad.findOne({mid: mid, active: true});
	if (currentRec) return senderr(res, 601, "Already a member of Humad");
	
	let tmpRec = await M_Humad.find({ membershipNumber: {$regex: "^"+newCategory.substr(0, 1)} }).limit(1).sort({upgradeIndex: -1});
	let newNumber = (tmpRec.length > 0) ? tmpRec[0].upgradeIndex + 1 : 1;
	console.log(newNumber);
	
	let newRec = new M_Humad();
	newRec.hid = hid;
	newRec.mid = mid;
	newRec.membershipNumber = newCategory.substr(0, 1) + "\\" + newNumber.toString();
	newRec.upgradeIndex = newNumber;
	newRec.membershipDate = new Date();
	newRec.membershipReceipt  = newCategory.substr(0, 1) + "\\" + newNumber.toString();
	newRec.active = true;
	
	console.log(newRec);
	
	return senderr(res, 601, "Test");
	
	sendok(res, newRec);
});		


router.get('/test/:pinCode', async function (req, res) {
  setHeader(res);
  var {pinCode } = req.params;
	pin.seachByPin('560057', function (response){
		response.forEach(function (data) {
		console.log(data);
		});
		});
	sendok(res, "OK"); 
	//publishAppointments(res, {cid: cid, date: Number(date), month: Number(month), year: Number(year)})
});	
	

router.get('/test1', async function (req, res) {
  setHeader(res);
	let allRecs = await M_Humad.find({});
	for(var i=0; i<allRecs.length; ++i) {
		allRecs[i].upgradeIndex = Number(allRecs[i].membershipNumber.substr(2));
		await allRecs[i].save();
	}
	sendok(res, "Done");
});	
	


function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
}

module.exports = router;

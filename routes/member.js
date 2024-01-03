const {   
  encrypt, decrypt, dbencrypt, dbToSvrText, svrToDbText, dbdecrypt,
} = require('./functions'); 
const {
	memberGetAll, memberGetHodMembers,
	memberAddOne, memberAddMany,
	memberUpdateOne, memberUpdateMany,
	memberGetByMidOne, memberGetByMidMany,
	memberGetByHidMany,
	memberGetAlive,
	getHodCityList,
	
} = require('./dbfunctions');


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


router.get('/list/all', async function (req, res) {
  setHeader(res);
  var {fName, mName, lName } = req.params;

	let myData = await memberGetAll();
	var clonedArray = _.cloneDeep(myData);
	myData = clonedArray.filter(x => !x.ceased);
	for (var i=0; i< myData.length; ++i) {
		var tmp = dbdecrypt(myData[i].email);
		if (myData[i].mid === 2001) console.log(tmp);
		tmp = encrypt(tmp);
		if (myData[i].mid === 2001) console.log(tmp);
		myData[i].email = tmp;		//dbToSvrText(myData[i].email);
		tmp = dbdecrypt(myData[i].email1);
		tmp = encrypt(tmp);
		myData[i].email1 = tmp;		//dbToSvrText(myData[i].email1);
	}
	sendok(res, myData);
});		

router.get('/hod/all', async function (req, res) {
  setHeader(res);
  var {fName, mName, lName } = req.params;

	let myData = await memberGetHodMembers();
	var clonedArray = _.cloneDeep(myData);
	myData = clonedArray.filter(x => !x.ceased);
	for (var i=0; i< myData.length; ++i) {
		var tmp = dbdecrypt(myData[i].email);
		if (myData[i].mid === 2001) console.log(tmp);
		tmp = encrypt(tmp);
		if (myData[i].mid === 2001) console.log(tmp);
		myData[i].email = tmp;		//dbToSvrText(myData[i].email);
		tmp = dbdecrypt(myData[i].email1);
		tmp = encrypt(tmp);
		myData[i].email1 = tmp;		//dbToSvrText(myData[i].email1);
	}
	sendok(res, myData);
});		

router.get('/city/all', async function (req, res) {
  setHeader(res);
  var {fName, mName, lName } = req.params;

	/*console.log("getting list");
	let filterQuery;
	filterQuery = {};
	filterQuery["ceased"] = false;
	//console.log(filterQuery);*/
	
	let myData = await getHodCityList();
	sendok(res, myData);
});

router.get('/namelist/:fName/:mName/:lName', async function (req, res) {
  setHeader(res);
  var {fName, mName, lName } = req.params;

	var myData = await memberGetAll();
	if (fName !== "-") {
		myData = myData.filter(x => x.firstName.toLowerCase().includes(fName.toLowerCase()) );
	}
	if (mName !== "-") {
		myData = myData.filter(x => x.middleName.toLowerCase().includes(mName.toLowerCase()) );		
	}
	if (lName !== "-") {
		myData = myData.filter(x => x.lastName.toLowerCase().includes(lName.toLowerCase()) );				
	}
	sendok(res, myData);
});		


router.get('/namelist/all', async function (req, res) {
  setHeader(res);

	let myData = await memberGetAlive();
	//M_Member.find({ceased: false}, {hid: 1, mid: 1, title: 1, firstName: 1, middleName: 1, lastName: 1, alias: 1, dateOfMarriage: 1, _id: 0}).sort({lastName: 1, firstName: 1, middleName: 1});
	sendok(res, myData);
	
});		

router.get('/hod/:hid', async function (req, res) {
  setHeader(res);
  var { hid } = req.params;
	
	
	let myData = await memberGetByHidMany(Number(hid));
	for(let i=0; i<myData.length; ++i) {
		myData[i].email = dbToSvrText(myData[i].email);
		myData[i].email1 = dbToSvrText(myData[i].email1);
	}
	sendok(res, myData);
});		

router.post('/sethod/:mid', async function (req, res) {
  setHeader(res);
  var {mid } = req.params;
	mid = Number(mid);
	let hid = Math.trunc(mid / FAMILYMF);

	let hodRec = await M_Hod.findOne({hid: hid});
	hodRec.mid = mid;
	hodRec.save();
	
	//let myData = await M_Member.find({hid: hid, ceased: false}).sort({order: 1});
	let myData = _.cloneDeep(allMemberlist);
	myData = myData.filter(x => !x.ceased && x.hid == hid);
	myData[0].relation = "Relative";
	for(let i=0, startOrder=1; i<myData.length; ++i) {
		if (myData[i].mid === mid) {
			myData[i].order = 0;
			myData[i].relation = "Self";
		} else	{
			myData[i].order = startOrder++;
		}
		//myData[i].save();
		await updateMember(myData[i]);
	}
	sendok(res, "Done");
});	

router.post('/orgceased/:mid/:datestr', async function (req, res) {
  setHeader(res);
  var {mid, datestr } = req.params;
	mid = Number(mid);
	let hid = Math.trunc(mid / FAMILYMF);
	let d = new Date(
		Number(datestr.substr(0,4)), 
		Number(datestr.substr(4, 2))-1,
		Number(datestr.substr(6, 2)),
		0, 0, 0
	);
	
	
	// get all members of the family sorted by 'order'
	//let myData = await M_Member.find({hid: hid}).sort({order: 1});
	let myData = await memberGetByHidMany(hid);
	myData = _.sortBy(myData, 'order');
	
	// update ceased information in member
	let tmp = myData.find(x => x.mid === mid);
	tmp.ceased = true;
	tmp.ceasedDate = d;
	
	// update details of member's spouse
	tmp = myData.find(x => x.mid === tmp.spouseMid);
	if (tmp) {
		tmp.emsStatus = (myData.gender === "Male") ? "Widower" : "Widow";
		tmp.spouseMid = 0;
	}
	
	for(let i=0, startOrder=0; i<myData.length; ++i) {
		if (myData[i].mid !== mid) {
			myData[i].order = startOrder++;
		}
		//await myData[i].save();
	}
	await memberUpdateMany(myData);

	sendok(res, "Done");
});

router.get('/ceased/:ceasedInfo', async function (req, res) {
  setHeader(res);
  var {ceasedInfo} = req.params;
	
	ceasedInfo = JSON.parse(ceasedInfo);
	console.log(ceasedInfo);
	senderr(res, 601, "Done");
});


router.get('/split/:newFamilyData', async function (req, res) {
  setHeader(res);
  var {newFamilyData } = req.params;
	newFamilyData = JSON.parse(newFamilyData);
	let hid = Math.trunc(newFamilyData.hod / FAMILYMF);
	let tmpRec = await M_Hod.find({}).limit(1).sort({hid: -1});
	let newHid = tmpRec[0].hid + 1;

	let hidRec = await M_Hod.findOne({hid: hid});
	
	let newRec = new M_Hod(_.omit(hidRec, '_id'));
	newRec.hid = newHid;
	newRec.mid = newRec.hid*FAMILYMF + 1;		// mid of HOD
	console.log(newRec);
	await newRec.save();

	let allMemRec = await M_Member.find({hid: hid, ceased: false});
	let newMid, newOrder, newRelation;

	// now rectify order number of members who are not getting transferred
	for (let i=0, orderNo=1; i<allMemRec.length; ++i) {
		if (!newFamilyData.memberList.includes(allMemRec[i].mid)) {
			console.log(allMemRec[i].mid);
			if (allMemRec[i].mid === hidRec.mid) {
				newOrder = 0;
			} else {
				newOrder = orderNo++
			}
			allMemRec[i].order = newOrder;
			allMemRec[i].save();
		}
	}
	
	// now transfer all selected members to new family
	for (let i=0, orderNo=1, seqNo=2; i<allMemRec.length; ++i) {
		if (newFamilyData.memberList.includes(allMemRec[i].mid)) {
			console.log(allMemRec[i].mid);
			if (allMemRec[i].mid === newFamilyData.hod) {
				newMid = newRec.hid*FAMILYMF + 1;
				newOrder = 0;
				newRelation = "Self";
			} else {
				newMid = newRec.hid*FAMILYMF + seqNo;
				seqNo++;
				newOrder = orderNo++
				newRelation = allMemRec[i].relation;
			}
			allMemRec[i].hid = newRec.hid
			allMemRec[i].mid = newMid;
			allMemRec[i].order = newOrder;
			allMemRec[i].relation = newRelation;
			allMemRec[i].save();
		}
	}

	sendok(res, "OK");
});	


router.post('/orgscrollup/:mid', async function (req, res) {
  setHeader(res);
  var {mid } = req.params;
	mid = Number(mid);
	let hid = Math.trunc(mid / FAMILYMF);

	//let myData = await M_Member.find({hid: hid, ceased: false}).sort({order: 1});
	let myData = _.cloneDeep(allMemberlist);
	myData = myData.filter(x => !x.ceased && x.hid === hid);
	
	myData[0].relation = "Relative";
	for(let i=0, startOrder=1; i<myData.length; ++i) {
		if (myData[i].mid !== mid) continue;
		--myData[i].order;
		++myData[i-1].order;		
		//myData[i-1].save();
		//myData[i].save();
		updateMember(myData[i-1]);
		updateMember(myData[i]);
		
	}
	sendok(res, "Done");
});	

router.get('/scrollup/:mid', async function (req, res) {
  setHeader(res);
  var {mid } = req.params;
	mid = Number(mid);
	let hid = Math.trunc(mid / FAMILYMF);

	//let myData = await M_Member.find({hid: hid, ceased: false}).sort({order: 1});
	//let myData = _.cloneDeep(allMemberlist);
	//myData = myData.filter(x => !x.ceased && x.hid === hid);
	myData = _.cloneDeep(await memberGetByHidMany(hid));
	
	var myIndex = myData.findIndex(x => x.mid === mid);
	console.log(myIndex);
	
	if (myIndex > 0) {
		// swap order with previous record
		var tmp = myData[myIndex].order;
		myData[myIndex].order = myData[myIndex-1].order;
		myData[myIndex-1].order = tmp;
		
		memberUpdateOne(myData[myIndex-1]);
		memberUpdateOne(myData[myIndex]);
		// send complete list after again sorting on order
		myData = _.sortBy(myData, 'order');
		return sendok(res, myData);
	}
	else {
		return senderr(res, 601, "Incorrect order");
	}
});	


router.post('/orgscrolldown/:mid', async function (req, res) {
  setHeader(res);
  var {mid } = req.params;
	mid = Number(mid);
	let hid = Math.trunc(mid / FAMILYMF);

	let myData = await M_Member.find({hid: hid, ceased: false}).sort({order: 1});
	myData[0].relation = "Relative";
	for(let i=0, startOrder=1; i<myData.length; ++i) {
		if (myData[i].mid !== mid) continue;
		++myData[i].order;
		--myData[i+1].order;		
		myData[i].save();
		myData[i+1].save();
	}
	sendok(res, "Done");
});	


router.get('/scrolldown/:mid', async function (req, res) {
  setHeader(res);
  var {mid } = req.params;
	mid = Number(mid);
	let hid = Math.trunc(mid / FAMILYMF);

	//let myData = await M_Member.find({hid: hid, ceased: false}).sort({order: 1});
	//let myData = _.cloneDeep(allMemberlist);
	//myData = myData.filter(x => !x.ceased && x.hid === hid);
	myData = _.cloneDeep(await memberGetByHidMany(hid));
	
	var myIndex = myData.findIndex(x => x.mid === mid);
	console.log(myIndex);
	
	if ((myIndex > 0) && (myIndex < (myData.length -1)) )  {
		// swap order with previous record
		var tmp = myData[myIndex].order;
		myData[myIndex].order = myData[myIndex+1].order;
		myData[myIndex+1].order = tmp;
		
		memberUpdateOne(myData[myIndex+1]);
		memberUpdateOne(myData[myIndex]);
		// send complete list after again sorting on order
		myData = _.sortBy(myData, 'order');
		return sendok(res, myData);
	}
	else {
		return senderr(res, 601, "Incorrect order");
	}
});	



router.get('/test', async function (req, res) {
  setHeader(res);
  //var {cid, date, month, year } = req.params;
	let allMem = await M_Member.find({});
	let count = 0;
	for(i=0; i < allMem.length; ++i) {
		let tmp = allMem[i].dateOfMarriage.getFullYear();
		if ((tmp === 1970) || (tmp === 1970)) {
			allMem[i].dateOfMarriage = new Date(1900, 0, 1, 0, 0, 0);
			await allMem[i].save();
			++count;
		}
	}
	console.log(`Member count is ${count}`);
	sendok(res, "Done");
});		
 


function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
}

module.exports = router;

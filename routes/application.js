const {  akshuGetUser, GroupMemberCount,  
	numberDate, 
	getMemberName
} = require('./functions'); 

const { 
	memberGetByMidOne,
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


router.get('/list', async function (req, res) {
  setHeader(res);

	let myData = await M_Application.find({}).sort({id: -1});
	console.log(myData);
	sendok(res, myData);
});		

router.get('/list/:mid', async function (req, res) {
  setHeader(res);
	var {mid } = req.params;

	let myData = await M_Application.find({mid: mid}).sort({id: -1});
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
	console.log(appData.data);
	
	let justNow = new Date();
	let baseid =  (((justNow.getFullYear() * 100) + justNow.getMonth() + 1) * 100 + justNow.getDate()) * 1000;
	console.log(baseid);
	let tmp = await M_Application.find({id: {$gt: baseid}}).limit(1).sort({id: -1});
	
	aRec.date = justNow;
	aRec.id = (tmp.length > 0) ? tmp[0].id + 1 : baseid + 1;
	await aRec.save();
	console.log(aRec);
	
	sendok(res, aRec);
});


router.get('/delete/:id', async function (req, res) {
  setHeader(res);
	var {id } = req.params;
	
	await M_Application.deleteOne({id: id});

	sendok(res, "Done");
});


router.get('/editfamilydetails/:editor_mid/:appData', async function (req, res) {
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
	console.log(appData.data);
	
	let justNow = new Date();
	let baseid =  (((justNow.getFullYear() * 100) + justNow.getMonth() + 1) * 100 + justNow.getDate()) * 1000;
	console.log(baseid);
	let tmp = await M_Application.find({id: {$gt: baseid}}).limit(1).sort({id: -1});
	
	aRec.date = justNow;
	aRec.id = (tmp.length > 0) ? tmp[0].id + 1 : baseid + 1;
	await aRec.save();
	console.log(aRec);
	
	sendok(res, aRec);
});

router.get('/updategotra/:editor_mid/:appData', async function (req, res) {
  setHeader(res);
	var {editor_mid, appData } = req.params;
	console.log(appData);

	var editorRec = await memberGetByMidOne(Number(editor_mid));
	
	let aRec = new M_Application();
	aRec.owner = "PRWS";
	aRec.desc = "Edit Gotra";
	aRec.name = getMemberName(editorRec);
	aRec.mid = editorRec.mid;
	aRec.isMember = true;
	aRec.data = appData;
	aRec.status = 'Pending';
	aRec.adminName = '';
	aRec.comments = '';
	
	let justNow = new Date();
	let baseid =  (((justNow.getFullYear() * 100) + justNow.getMonth() + 1) * 100 + justNow.getDate()) * 1000;
	console.log(baseid);
	let tmp = await M_Application.find({id: {$gt: baseid}}).limit(1).sort({id: -1});
	
	aRec.date = justNow;
	aRec.id = (tmp.length > 0) ? tmp[0].id + 1 : baseid + 1;
	await aRec.save();
	console.log(aRec);
	
	sendok(res, aRec);
});



router.get('/reject/:id/:adminName/:comments', async function (req, res) {
  setHeader(res);
	var {id, adminName,comments } = req.params;
	
	let aRec = await M_Application.findOne({id: id});
	aRec.status = 'Rejected';
	aRec.adminName = adminName;
	aRec.comments = comments;
	await aRec.save();
	console.log(aRec);
	
	sendok(res, aRec);
});



router.get('/test', async function (req, res) {
  setHeader(res);
	var {id, adminName,comments } = req.params;
	
	let allRec = await M_Application.find({});
	for(var i=0; i<allRec.length; ++i) {
		var memRec = await memberGetByMidOne(allRec[i].mid);
		console.log(memRec);
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

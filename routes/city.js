var router = express.Router();
const { 
	getLoginName, getDisplayName,
} = require('./functions'); 



router.use('/', function(req, res, next) {
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR,  ERR_NODB); return; }
 
  next('route');
});


router.get('/test', async function(req, res, next) {
  setHeader(res);
	
	var allRec = await M_Hod.find({});
	var cityList = _.map(allRec, 'city');
	cityList = _.uniqBy(cityList);
	for (var i=0; i<cityList.length; ++i) {
		var tmp = new M_City({
			id: getDisplayName(cityList[i]),
			city: getDisplayName(cityList[i]),
			enabled: true
		});
		await tmp.save();
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
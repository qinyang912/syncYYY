module.exports = function(req,res){
	var sendTimes = 0;
	var timer = function(time){
		if(++sendTimes > 20)return res.end();
		setTimeout(function(){
			res.write("setTimeout" + sendTimes + "\n");
			timer(100);
		},time);
	}
	timer(100);
}
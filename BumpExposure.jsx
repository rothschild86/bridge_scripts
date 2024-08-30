// Scenario: to lighten or darken a series of images while preserving the individual exposure corrections
//Script by Alexander Rothschild 2024 inspired by: 
//https://community.adobe.com/t5/bridge-discussions/is-there-a-script-to-change-a-setting-incrementally-when-batch-processing-in-camera-raw/m-p/5000417

#target bridge
if(BridgeTalk.appName == 'bridge'){
	
	var bumpUpMenuItem = MenuElement.create('command', 'Bump exposure up +0.10', 'at the end of Thumbnail', 'bumpUpExp'); //'after Thumbnail/Open'
	
	bumpUpMenuItem.onSelect = function(){
		bumpIt(0.10);
	}
	
	var bumpDownMenuItem = MenuElement.create('command', 'Bump exposure down -0.10', 'after bumpUpExp', 'bumpDownExp'); //'after Thumbnail/Open'
	
	bumpDownMenuItem.onSelect = function(){
		bumpIt(-0.10);
	}
	
	function bumpIt(amount){
				if(ExternalObject.AdobeXMPScript == undefined)  ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript');
		
		var fileList = app.document.selections;
		
		for(var i = 0;i < fileList.length;i++)
		{ //loop through selected files
		
			try{
				var file = fileList[i];
				
				if ( !file.container && file.hasMetadata ){
					
					var file = new File(file.spec.fsName.replace(/\....$/,'.xmp'));
					
						 file.encoding = 'UTF8';
						 file.lineFeed = 'unix'; 
						 file.open('r', 'TEXT', '????');
						 var xmpStr = file.read();
						 file.close();

						 var xmp = new XMPMeta( xmpStr );

						 var existingVal = xmp.getProperty( XMPConst.NS_CAMERA_RAW, 'Exposure2012', XMPConst.NUMBER );
						 if (existingVal === undefined) existingVal = 0;
						 xmp.setProperty( XMPConst.NS_CAMERA_RAW, 'Exposure2012', Number(existingVal) + Number(amount), XMPConst.NUMBER );

						 file.open('w');
						 file.encoding = 'UTF8';
						 file.lineFeed = 'unix'; 
						 file.write( xmp.serialize() );
						 file.close();
				}
			}
			catch(e){
			alert(e + ' Line: ' + e.line);
			}
		
		} //end loop
		app.document.refresh();
	}
}


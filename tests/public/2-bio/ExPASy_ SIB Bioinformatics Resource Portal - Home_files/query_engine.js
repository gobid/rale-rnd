/**
 *
 * @author: Konstantin Arnold, Robin.Liechti@isb-sib.ch, Dec 2010
 * $Id$
 *
 */
	function ClearField(field_id) {
	  if($(field_id)) {
	    if($(field_id).type == "textarea"){
	      $(field_id).innerHTML = "";
	      $(field_id).value = "";
	    } else {
	      $(field_id).value = "";
	    }
	  }
	}

	function FillField(field_id, value) {
	if($(field_id)) {
	    if($(field_id).type == "textarea"){
	      $(field_id).innerHTML = value;
	      $(field_id).value = value;
	    } else {
	      $(field_id).value = value;
	    }
	  }
	}

    function ClearSearchTerm(url){
            
        new Ajax.Request(url,{method: 'get'});
        ClearField('Querytext');
    
    }

	function asyncPart(async_url, target, text,single) {
		new Ajax.Request(async_url,{
			method: 'get',
			onCreate: function(){
				if(single){
					$('sib_content').down('div').update("<p class = 'center fade'>searching...</p>");
				}
				else{
					if(!text){  var text = "loading data ...";  }
					if($('hits_'+target)) $('hits_'+target).update("<img src='https://expasy.org/img/ajax-loader.gif' alt='...'  />");
					if($('comments_'+target)) $('comments_'+target).update("<span class = 'query_searching'>"+text+"</span>");
				}
			},
			onComplete: function(transport){
				var response = transport.responseText || "";
				var parts = response.split("<-->");
                
                if(parts[0].include('href')){
                
                    var hiturl = getLink(parts[0]);
                    
                }
                
				if(single){
					if(parts.length == 2){
						var reg = new RegExp(/<a href\s*=\s*['"]([^'"]*)['"]/);
						if(reg.exec(parts[0])){
							self.location.href = reg.exec(parts[0])[1];
						}
						else{
							$('sib_content').down('div').update("<p class = 'center fade'>Sorry, no result found</p>");
						}
					}
					else{
						$('sib_content').down('div').update("<p class = 'center fade'>Sorry, no result found</p>");
					}
				}
				else{
				    
				    if(hiturl){
                                
                            $('url_'+target).href = hiturl;    
                                
                    }
				    
					if(parts.length == 2){

						var comment = parts[1].replace("matched","");
						comment = comment.replace("number of","");
						comment = comment.replace("returned by.*","");
						
						
						if($('hits_'+target)) $('hits_'+target).update(parts[0]);
						if($('comments_'+target)) $('comments_'+target).update(comment);
					}
					else{
					    
						if($('hits_'+target)) $('hits_'+target).update();
						if($('comments_'+target)) $('comments_'+target).update(response);
					}

				}
			}
		})
	  // var xmlHttp;
	  // try{
	  //   // Firefox, Opera 8.0+, Safari
	  //   xmlHttp=new XMLHttpRequest();
	  // }catch (e){
	  //   // Internet Explorer
	  //   try{
	  //     xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
	  //   }catch (e){
	  //     try{
	  //       xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
	  //     }catch (e){
	  //       alert("Your browser does not support AJAX!");
	  //       return false;
	  //     }
	  //   }
	  // }
	  // xmlHttp.onreadystatechange=function(){
	  //   if(xmlHttp.readyState==4){
	  //     parseScript(xmlHttp.responseText);
	  //     document.getElementById(field).innerHTML = xmlHttp.responseText;
	  //     // Loop through every script collected and eval it
	  //     for(var i=0; i<scripts.length; i++) {
	  //       try {
	  //         eval(scripts[i]);
	  //       }
	  //       catch(ex) {
	  //         //alert(ex.message);
	  //       // do what you want here when a script fails
	  //       }
	  //     }
	  //   }
	  // }
	  // xmlHttp.open("GET",async_url,true);
	  // xmlHttp.send(null);
	}

    function getLink(html) {
        var container = document.createElement("p");
        container.innerHTML = html;
        var anchor = container.getElementsByTagName("a");
    
        if(anchor[0].href){
            
            return anchor[0].href;
            
        }
    
        return false;
    }


	function parseScript(_source) {
	  var source = _source;
		scripts = new Array();

	  /* Strip out tags*/
	  while(source.indexOf("<script") > -1 || source.indexOf("</script") > -1) {
	    var s = source.indexOf("<script");
	    var s_e = source.indexOf(">", s);
	    var e = source.indexOf("</script", s);
	    var e_e = source.indexOf(">", e);
	    /* Add to scripts array*/
	    scripts.push(source.substring(s_e+1, e));
	    /* Strip from source*/
	    source = source.substring(0, s) + source.substring(e_e+1);
	  }

	  /* Return the cleaned source*/
	  return source;
	}

var resultsjson = [];

document.getElementById('import2').onclick = function() {
	var files = document.getElementById('selectFiles2').files;
  console.log(files);
  if (files.length <= 0) {
    return false;
  }
  
  var fr = new FileReader();
  
  fr.onload = function(e) { 
  console.log(e);
    var result = JSON.parse(e.target.result);
    resultsjson = result;
    document.getElementById('result').value = resultsjson;
  }
  
  fr.readAsText(files.item(0));
}

/////SEARCH FUNCTION/////////////////////////////
    $(function () {
              var to = false;
              $('#demo_q2').keyup(function () {
                if(to) { clearTimeout(to); }
                to = setTimeout(function () {
                  var v = $('#demo_q2').val();
                  $('#jstree_instances').jstree(true).search(v);
                }, 250);
              });
////////////////////////////////////////////////
	
	//CDT POPULATION
	$('#jstree_instances').jstree({
  "core" : {
    "animation" : 0,
    "check_callback" : true,
    "themes" : { "stripes" : true },
    'data' : resultsjson
  },
  "types" : {
    "#" : {
      "valid_children" : ["root"]
    },
    "root" : {
      "icon" : "./styles/icons/root.png",
      "valid_children" : ["dimension"]
    },
    "dimension" : {
      "icon" : "./styles/icons/dimension.png",
      "valid_children" : ["concept","attribute"]
    },
    "concept" : {
      "icon" : "./styles/icons/concept.png",
      "valid_children" : ["dimension","attribute"]
    },
    "attribute" : {
      "icon" : "./styles/icons/attribute.png",
      "valid_children" : []
    }
  },
  "plugins" : [
    "contextmenu", "search",
    "state", "types", "wholerow"
  ],
  "contextmenu" : {
    "items" : function(node) {
            var items = $.jstree.defaults.contextmenu.items();
            items.create = false;
            items.ccp = false;
            items.remove = false;

            return items;
        }
  }
});

//END OF SEARCH FUNCTION////
  });
////////////////////////////

//FILE JSON GENERATION + DOWNLOAD IN LOCAL
function get_data_from_url(url){
  var http_req = new XMLHttpRequest();
  http_req.open("GET",url,false);
  http_req.send(null);
  return http_req.responseText;          
}

function encode( s ) {
    var out = [];
    for ( var i = 0; i < s.length; i++ ) {
        out[i] = s.charCodeAt(i);
    }
    return new Uint8Array( out );
}

var savejson = document.getElementById( 'savejson2' );
savejson.addEventListener( 'click', function() {
    
	var v = $('#jstree_instances').jstree(true).get_json('#', {flat:false,no_state:true, no_data:false, no_type:true, no_icon:true, no_li_attr:true, no_a_attr:true})
  var q = JSON.stringify(v[1]);
  var u = "[" + q + "]"
  u = JSON.parse(u);
  if(v.length >= 3)
  {
    for(i=2; i<v.length; i++)
    {
      u = u.concat(v[i]);
    }
  }
    var data = encode( JSON.stringify(u, null, 4) );

    var blob = new Blob( [ data ], {
        type: 'application/octet-stream'
    });
    
    url = URL.createObjectURL( blob );
    var link = document.createElement( 'a' );
    link.setAttribute( 'href', url );
    link.setAttribute( 'download', 'instances.json' );
    
    var event = document.createEvent( 'MouseEvents' );
    event.initMouseEvent( 'click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    link.dispatchEvent( event );
});

//JSON GENERATION (APPEND TO DATABASE)
var appenddbandsave = document.getElementById( 'appenddbandsave' );
appenddbandsave.addEventListener( 'click', function() {
    
    var v = $('#jstree_instances').jstree(true).get_json('#', {flat:false,no_state:true, no_data:false, no_type:true, no_icon:true, no_li_attr:true, no_a_attr:true})
    var q = JSON.stringify(v[1]);
    var u = "[" + q + "]"
    u = JSON.parse(u);
    if(v.length >= 3)
    {
      for(i=2; i<v.length; i++)
      {
        u = u.concat(v[i]);
      }
    }
    var data_url = "https://luca-grella.github.io/tesi/demo/js/database.json";
    var new_data = JSON.parse(get_data_from_url(data_url));
    var appenddb = new_data.concat(u);
    var appenddb_string = encode( JSON.stringify(appenddb, null, 4) );
  
    var blob = new Blob( [ appenddb_string ], {
        type: 'application/octet-stream'
    });
    
    url = URL.createObjectURL( blob );
    var link = document.createElement( 'a' );
    link.setAttribute( 'href', url );
    link.setAttribute( 'download', 'database.json' );
    
    var event = document.createEvent( 'MouseEvents' );
    event.initMouseEvent( 'click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    link.dispatchEvent( event );
});

//ROOT INSTANCE DUPLICATION
var duplicateroot = document.getElementById( 'duplicateroot' );
duplicateroot.addEventListener( 'click', function() {

              $('#jstree_instances').jstree('copy', '1');
              $('#jstree_instances').jstree('paste', '#', 'last');
              var ref = $("#jstree_instances").jstree(true);
              ref = ref.get_json('#');
              var new_id = Date.now();
              $("#jstree_instances").jstree(true).set_id(ref[ref.length - 1], new_id);
              var new_root = $("#jstree_instances").jstree(true).get_json(new_id, { flat: true });
              var timestamp_new = Date.now();
              for(i=0; i<new_root.length; i++)
              {
                timestamp_new = timestamp_new + 1;
                $("#jstree_instances").jstree(true).set_id(new_root[i], timestamp_new);
              }
            });

//RENAME ATTIBUTE
var renamenode = document.getElementById( 'renamenode2' );
renamenode.addEventListener( 'click', function() {

              var ref = $('#jstree_instances').jstree(true),
              sel = ref.get_selected();
              var sel_id = 0;
              var can_rename = false;


              for (i = 0; i < sel.length; i++) 
              { 
                if($('#jstree_instances').jstree(true).get_json(sel[i]).type == 'attribute')
                {
                  can_rename = true;
                  if(i < sel_id){sel_id = i}
                }
              }
              if(!sel.length) { return false; }
              sel = sel[sel_id];
              if(can_rename)
              {
                ref.edit(sel);
              }
              else 
              {
                //Do Nothing
              }              
            });

/*RENAME SELECTED NODE FUNCTION
var renamenode = document.getElementById( 'renamenode2' );
renamenode.addEventListener( 'click', function() {

              var ref = $('#jstree_instances').jstree(true),
                sel = ref.get_selected();
              if(!sel.length) { return false; }
              sel = sel[0];
              ref.edit(sel);
            });*/

//DELETE SELECTED INSTANCE FUNCTION
var deleteinstance = document.getElementById( 'deleteinstance' );
deleteinstance.addEventListener( 'click', function() {

              var ref = $('#jstree_instances').jstree(true),
              sel = ref.get_selected();
              var instance_delete = false;
              for (i = 0; i < sel.length; i++) 
              { 
                sel_id = sel[i];
                if($('#jstree_instances').jstree(true).get_json(sel_id).type == 'root')
                {
                  instance_delete = true
                }
              }
              if(!sel.length) { return false; }
              if(instance_delete)
              {
                ref.delete_node(sel);
              }
              else 
              {
                //Do Nothing
              }
            });

  //DELETE SELECTED NODE FUNCTION
var deletenode2 = document.getElementById( 'deletenode2' );
deletenode2.addEventListener( 'click', function() {

              var ref = $('#jstree_instances').jstree(true),
                sel = ref.get_selected();
              if(!sel.length) { return false; }
              ref.delete_node(sel);
            });

//CONCEPT N DUPLICATION
var duplicateconcept_n = document.getElementById( 'duplicateconcept_n' );
duplicateconcept_n.addEventListener( 'click', function() {

              var ref = $('#jstree_instances').jstree(true),
                sel = ref.get_selected();
              if(!sel.length) { return false; }

              if($('#jstree_instances').jstree(true).get_json(sel[0]).type == 'concept_n')
              {
                var concept_n_parent = ref.get_parent(sel[0]);
                ref.copy(sel[0]);
                /*ref.paste()
                $('#jstree_instances').jstree('copy', sel[0]);*/
                $('#jstree_instances').jstree('paste', concept_n_parent, 'last');
              }

              /*
              
              var ref = $("#jstree_instances").jstree(true);
              ref = ref.get_json('#');
              var new_id = Date.now();
              $("#jstree_instances").jstree(true).set_id(ref[ref.length - 1], new_id);
              var new_root = $("#jstree_instances").jstree(true).get_json(new_id, { flat: true });
              var timestamp_new = Date.now();
              for(i=0; i<new_root.length; i++)
              {
                timestamp_new = timestamp_new + 1;
                $("#jstree_instances").jstree(true).set_id(new_root[i], timestamp_new);
              }*/
            });

//EXPAND TREE
var openallnodes = document.getElementById( 'openallnodes2' );
openallnodes.addEventListener( 'click', function() {

              $('#jstree_instances').jstree('open_all')
            });

//REDUCE TREE
var closeallnodes = document.getElementById( 'closeallnodes2' );
closeallnodes.addEventListener( 'click', function() {

              $('#jstree_instances').jstree('close_all');
            });

//NODE1 HIDING
function provaHide() {
  var node_to_hide = $("#jstree_instances").jstree(true).get_node('1');   
	hiding = $("#jstree_instances").jstree(true).hide_node(node_to_hide);
};

//REFRESH TREE
var refreshtree = document.getElementById( 'refreshtree2' );
refreshtree.addEventListener( 'click', function() {

              $('#jstree_instances').jstree(true).settings.core.data = resultsjson;
              $('#jstree_instances').jstree(true).refresh();
            });

setInterval(provaHide, 1);
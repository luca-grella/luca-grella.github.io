var resultsjson/* = [
  {
      "id": "1",
      "text": "Infortunio",
      "icon": "./icons/root.png",
      "data": {},
      "children": [],
      "type": "root"
  }
]*/;
var resultjsonflag = false;


document.getElementById('import').onclick = function() {
	var files = document.getElementById('selectFiles').files;
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
  resultjsonflag = true;
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
    "check_callback" : function () {
      while(!resultjsonflag){} return true;
  },
    "themes" : { "stripes" : true },
    'data' : resultsjson
  },
  "types" : {
    "#" : {
      "valid_children" : ["root"]
    },
    "root" : {
      "icon" : "./icons/root.png",
      "valid_children" : ["dimension"]
    },
    "dimension" : {
      "icon" : "./icons/dimension.png",
      "valid_children" : ["concept","attribute"]
    },
    "concept" : {
      "icon" : "./icons/concept.png",
      "valid_children" : ["dimension","attribute"]
    },
    "attribute" : {
      "icon" : "./icons/attribute.png",
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

    var data = encode( JSON.stringify(v, null, 4) );

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

//INFORTUNIO NODE DUPLICATION
var duplicateroot = document.getElementById( 'duplicateroot' );
duplicateroot.addEventListener( 'click', function() {

              var ref = $('#jstree_instances').jstree('copy', '1');
              ref = $('#jstree_instances').jstree('paste', '#', 'last');
            });

//RENAME SELECTED NODE FUNCTION
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

//DELETE SELECTED NODE FUNCTION
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

//TEST
var test1 = document.getElementById( 'test1' );
test1.addEventListener( 'click', function() {

  document.getElementById("demoi").innerHTML = resultsjson;
            });

setInterval(provaHide, 1);
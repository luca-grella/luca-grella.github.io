var resultsjson = false;

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
}

/////SEARCH FUNCTION/////////////////////////////
    $(function () {
              var to = false;
              $('#demo_q').keyup(function () {
                if(to) { clearTimeout(to); }
                to = setTimeout(function () {
                  var v = $('#demo_q').val();
                  $('#jstree_demo').jstree(true).search(v);
                }, 250);
              });
////////////////////////////////////////////////
	
	//CDT POPULATION
	$('#jstree_demo').jstree({
  "core" : {
    "animation" : 0,
    "check_callback" : true,
    "themes" : { "stripes" : true },
    'data' : {
				"url" : "./js/tree_structure.json",
				"dataType" : "json" 
			}
  },
  "types" : {
    "#" : {
      "max_children" : 1,
      "valid_children" : ["root"]
    },
    "root" : {
      "icon" : "./styles/icons/root.png",
      "valid_children" : ["dimension"]
    },
    "dimension" : {
      "icon" : "./styles/icons/dimension.png",
      "valid_children" : ["concept","concept_n","attribute"]
    },
    "concept" : {
      "icon" : "./styles/icons/concept.png",
      "valid_children" : ["dimension","attribute"]
    },
    "concept_n" : {
      "icon" : "./styles/icons/concept_n.png",
      "valid_children" : ["dimension","attribute"]
    },
    "attribute" : {
      "icon" : "./styles/icons/attribute.png",
      "valid_children" : []
    }
  },
  "plugins" : [
    "contextmenu", "dnd", "search",
    "state", "types", "wholerow"
  ],
  "contextmenu" : {
    "items" : function(node) {
            var items = $.jstree.defaults.contextmenu.items();
            items.create = false;

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

var savejson = document.getElementById( 'savejson' );
savejson.addEventListener( 'click', function() {
    
	var v = $('#jstree_demo').jstree(true).get_json('#', {flat:false,no_state:true, no_data:false, no_type:true, no_icon:true, no_li_attr:true, no_a_attr:true})

    var data = encode( JSON.stringify(v, null, 4) );

    var blob = new Blob( [ data ], {
        type: 'application/octet-stream'
    });
    
    url = URL.createObjectURL( blob );
    var link = document.createElement( 'a' );
    link.setAttribute( 'href', url );
    link.setAttribute( 'download', 'tree_structure.json' );
    
    var event = document.createEvent( 'MouseEvents' );
    event.initMouseEvent( 'click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    link.dispatchEvent( event );
});

//BUTTONS FUNCTION: ALL NODE CREATION FUNCTION ACT ON THE SELECTED NODE

//ATTRIBUTE CREATION
var createattribute = document.getElementById( 'createattribute' );
createattribute.addEventListener( 'click', function() {

        var ref = $('#jstree_demo').jstree(true),
        sel = ref.get_selected();
        if(!sel.length) { return false; }
        var i;
			  for (i = 0; i < sel.length; i++) { 
			  sel_id = sel[i];
        var v = $('#jstree_demo').jstree(true).get_json(sel_id);

        var j;
        var checkchild = false;
        for (j = 0; j < v.children.length; j++){
            checkchild = checkchild || 
            v.children[j].type == 'concept' || 
            v.children[j].type == 'concept_n' ||
            v.children[j].type == 'dimension'
        }

        if (JSON.stringify(v.children) != '[]') {
          
          if (checkchild) {//Do Nothing
          }
          else {
              asd = ref.create_node(sel_id, {"type":"attribute"});
              if(asd) {
              ref.edit(asd);
              }
              ref.set_id(asd, Date.now());
                }

        }
        else {
              asd = ref.create_node(sel_id, {"type":"attribute"});
              if(asd) {
              ref.edit(asd);
              }
              ref.set_id(asd, Date.now());
                }
			                           }
            });

//CONCEPT CREATION
var createconcept = document.getElementById( 'createconcept' );
createconcept.addEventListener( 'click', function() {

        var ref = $('#jstree_demo').jstree(true),
        sel = ref.get_selected();
        if(!sel.length) { return false; }
        var i;
        for (i = 0; i < sel.length; i++) { 
        sel_id = sel[i];
        var v = $('#jstree_demo').jstree(true).get_json(sel_id);

        var j;
        var checkchild = false;
        for (j = 0; j < v.children.length; j++){
            checkchild = checkchild || 
            v.children[j].type == 'concept_n' ||
            v.children[j].type == 'attribute'
        }

        if (JSON.stringify(v.children) != '[]') {
          
          if (checkchild) {//Do Nothing
          }
          else {
              asd = ref.create_node(sel_id, {"type":"concept"});
              if(asd) {
              ref.edit(asd);
              }
              ref.set_id(asd, Date.now());
                }

        }
        else {
              asd = ref.create_node(sel_id, {"type":"concept"});
              if(asd) {
              ref.edit(asd);
              }
              ref.set_id(asd, Date.now());
                }
                                 }
            });

//CONCEPT_N CREATION
var createconcept_n = document.getElementById( 'createconcept_n' );
createconcept_n.addEventListener( 'click', function() {

        var ref = $('#jstree_demo').jstree(true),
        sel = ref.get_selected();
        if(!sel.length) { return false; }
        var i;
        for (i = 0; i < sel.length; i++) { 
        sel_id = sel[i];
        var v = $('#jstree_demo').jstree(true).get_json(sel_id);

        var j;
        var checkchild = false;
        for (j = 0; j < v.children.length; j++){
            checkchild = checkchild || 
            v.children[j].type == 'concept' ||
            v.children[j+1].type == 'concept_n' ||
            v.children[j].type == 'attribute'
        }

        if (JSON.stringify(v.children) != '[]') {
          
          if (checkchild) {//Do Nothing
          }
          else {
              asd = ref.create_node(sel_id, {"type":"concept_n"});
              if(asd) {
              ref.edit(asd);
              }
              ref.set_id(asd, Date.now());
                }

        }
        else {
              asd = ref.create_node(sel_id, {"type":"concept_n"});
              if(asd) {
              ref.edit(asd);
              }
              ref.set_id(asd, Date.now());
                }
                                 }
            });

//DIMENSION CREATION
var createdimension = document.getElementById( 'createdimension' );
createdimension.addEventListener( 'click', function() {

        var ref = $('#jstree_demo').jstree(true),
        sel = ref.get_selected();
        if(!sel.length) { return false; }
        var i;
        for (i = 0; i < sel.length; i++) { 
        sel_id = sel[i];
        var v = $('#jstree_demo').jstree(true).get_json(sel_id);

        var j;
        var checkchild = false;
        for (j = 0; j < v.children.length; j++){
            checkchild = checkchild || 
            v.children[j].type == 'attribute'
        }

        if (JSON.stringify(v.children) != '[]') {
          
          if (checkchild) {//Do Nothing
          }
          else {
              asd = ref.create_node(sel_id, {"type":"dimension"});
              if(asd) {
              ref.edit(asd);
              }
              ref.set_id(asd, Date.now());
                }

        }
        else {
              asd = ref.create_node(sel_id, {"type":"dimension"});
              if(asd) {
              ref.edit(asd);
              }
              ref.set_id(asd, Date.now());
                }
                                 }
            });

//ROOT CREATION
var createroot = document.getElementById( 'createroot' );
createroot.addEventListener( 'click', function() {

              var ref = $('#jstree_demo').jstree(true),
              sel = ref.create_node("#", {"type":"root"});
              if(sel) {
                ref.edit(sel);
              }
              ref.set_id(sel, "1");
            });

//RENAME SELECTED NODE FUNCTION
var renamenode = document.getElementById( 'renamenode' );
renamenode.addEventListener( 'click', function() {

              var ref = $('#jstree_demo').jstree(true),
                sel = ref.get_selected();
              if(!sel.length) { return false; }
              sel = sel[0];
              ref.edit(sel);
            });

//DELETE SELECTED NODE FUNCTION
var deletenode = document.getElementById( 'deletenode' );
deletenode.addEventListener( 'click', function() {

              var ref = $('#jstree_demo').jstree(true),
                sel = ref.get_selected();
              if(!sel.length) { return false; }
              ref.delete_node(sel);
            });

//EXPAND TREE
var openallnodes = document.getElementById( 'openallnodes' );
openallnodes.addEventListener( 'click', function() {

              $('#jstree_demo').jstree('open_all')
            });

//REDUCE TREE
var closeallnodes = document.getElementById( 'closeallnodes' );
closeallnodes.addEventListener( 'click', function() {

              $('#jstree_demo').jstree('close_all');
            });

//REFRESH TREE
var refreshtree = document.getElementById( 'refreshtree' );
refreshtree.addEventListener( 'click', function() {

              if (resultsjson != false)
              {
                $('#jstree_demo').jstree(true).settings.core.data = resultsjson;
              }
              $('#jstree_demo').jstree(true).refresh();
            });
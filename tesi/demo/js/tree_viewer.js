var resultsjson = [];

document.getElementById('import3').onclick = function() {
	var files = document.getElementById('selectFiles3').files;
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
              $('#demo_q3').keyup(function () {
                if(to) { clearTimeout(to); }
                to = setTimeout(function () {
                  var v = $('#demo_q3').val();
                  $('#jstree_viewer').jstree(true).search(v);
                }, 250);
              });
////////////////////////////////////////////////
	
	//CDT POPULATION
	$('#jstree_viewer').jstree({
  "core" : {
    "animation" : 0,
    "check_callback" : true,
    "themes" : { "stripes" : true },
    'data' : resultsjson
  },
  "types" : {
    "#" : {
      /*"max_children" : 1,*/
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
    "search",
    "state", "types", "wholerow"
  ]
});

//END OF SEARCH FUNCTION////
  });
////////////////////////////


//EXPAND TREE
var openallnodes = document.getElementById( 'openallnodes3' );
openallnodes.addEventListener( 'click', function() {

              $('#jstree_viewer').jstree('open_all')
            });

//REDUCE TREE
var closeallnodes = document.getElementById( 'closeallnodes3' );
closeallnodes.addEventListener( 'click', function() {

              $('#jstree_viewer').jstree('close_all');
            });

//NODE1 HIDING
function provaHide() {
  var node_to_hide = $("#jstree_viewer").jstree(true).get_node('1');   
	hiding = $("#jstree_viewer").jstree(true).hide_node(node_to_hide);
};

//REFRESH TREE
var refreshtree = document.getElementById( 'refreshtree3' );
refreshtree.addEventListener( 'click', function() {

              $('#jstree_viewer').jstree(true).settings.core.data = resultsjson;
              $('#jstree_viewer').jstree(true).refresh();
            });

setInterval(provaHide, 1);
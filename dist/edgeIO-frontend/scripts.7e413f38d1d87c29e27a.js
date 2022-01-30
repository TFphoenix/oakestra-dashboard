var svg,nodes,links,force,drag_line,path,circle,selected_node,selected_link,mousedown_link,mousedown_node,mouseup_node,button,width=500,height=500,colors=function(){return"#FFF"};function start(e,t){let n=document.getElementsByClassName("serviceCard")[0];width=n.offsetWidth;let o=500*e.length*-1;d3.select("svg").empty()||(svg=d3.select(".graph").select("svg")).remove(),svg=d3.select(".graph").append("svg").attr("width","100%").attr("height",height),nodes=e,links=t,force=d3.layout.force().nodes(nodes).links(links).size([width,height]).linkDistance(200).charge(o).on("tick",tick),svg.append("svg:defs").append("svg:marker").attr("id","end-arrow").attr("viewBox","0 -5 10 10").attr("refX",6).attr("markerWidth",3).attr("markerHeight",3).attr("orient","auto").attr("markerUnits","strokeWidth").attr("stroke-width","13").append("svg:path").attr("d","M0,-5L10,0L0,5").attr("fill","#000"),svg.append("svg:defs").append("svg:marker").attr("id","start-arrow").attr("viewBox","0 -5 10 10").attr("refX",4).attr("markerWidth",3).attr("markerHeight",3).attr("orient","auto").attr("markerUnits","strokeWidth").attr("stroke-width","13").append("svg:path").attr("d","M10,-5L0,0L10,5").attr("fill","#000"),drag_line=svg.append("svg:path").attr("class","link dragline hidden").attr("d","M0,0L0,0"),path=svg.append("svg:g").selectAll("path"),circle=svg.append("svg:g").selectAll("g"),button=svg.append("svg:g").selectAll("g"),selected_node=null,selected_link=null,mousedown_link=null,mousedown_node=null,mouseup_node=null,main()}function resetMouseVars(){mousedown_node=null,mouseup_node=null,mousedown_link=null}function restart(){(path=path.data(links)).classed("selected",function(e){return e===selected_link}).style("marker-start",function(e){return e.left?"url(#start-arrow)":""}).style("marker-end",function(e){return e.right?"url(#end-arrow)":""}),path.enter().append("svg:path").attr("class","link").classed("selected",function(e){return e===selected_link}).style("marker-start",function(e){return e.left?"url(#start-arrow)":""}).style("marker-end",function(e){return e.right?"url(#end-arrow)":""}).on("mousedown",function(e){d3.event.ctrlKey||(selected_node=null,setTextInView(selected_link=(mousedown_link=e)===selected_link?null:mousedown_link),restart())}),path.exit().remove(),button=button.data(nodes,function(e){return e.id}),(circle=circle.data(nodes,function(e){return e.id})).selectAll("circle").style("fill",function(e){return e===selected_node?d3.rgb(colors(e.id)).darker().toString():colors(e.id)}).classed("reflexive",function(e){return e.reflexive});var e=circle.enter().append("svg:g");e.append("svg:circle").attr("class","node").attr("r",40).style("fill",function(e){return e===selected_node?d3.rgb(colors(e.id)).brighter().toString():colors(e.id)}).style("stroke",function(e){return d3.rgb(colors(e.id)).darker().toString()}).classed("reflexive",function(e){return e.reflexive}).on("mouseover",function(e){d3.select(this).attr("transform","scale(1.1)"),mousedown_node&&e!==mousedown_node&&d3.select(this).attr("transform","scale(1.1)")}).on("mouseout",function(e){e!==selected_node&&e!==mousedown_node&&d3.select(this).attr("transform","scale(0.99)")}).on("mousedown",function(e){d3.event.ctrlKey||(selected_link=null,null!=(selected_node=(mousedown_node=e)===selected_node?null:mousedown_node)&&sendToModelNode(selected_node),drag_line.style("marker-end","url(#end-arrow)").classed("hidden",!1).attr("d","M"+mousedown_node.x+","+mousedown_node.y+"L"+mousedown_node.x+","+mousedown_node.y),restart())}).on("mouseup",function(e){mousedown_node&&(drag_line.classed("hidden",!0).style("marker-end",""),(mouseup_node=e)!==mousedown_node?(link={source:mousedown_node,target:mouseup_node,left:!1,right:!0},links.push(link),addLinkToDB(link),selected_link=link,selected_node=null,restart()):resetMouseVars())}),e.append("svg:text").attr("x",0).attr("y",4).attr("class","id").text(function(e){return shortenName(e.id)}),circle.exit().remove(),force.start()}function shortenName(e){return e.length>10?e.substring(0,Math.min(e.length,10))+"...":e}function tick(){path.attr("d",function(e){var t=e.target.x-e.source.x,n=e.target.y-e.source.y,o=Math.sqrt(t*t+n*n),r=t/o,s=n/o,d=e.left?45:12,l=e.right?45:12;return"M"+(e.source.x+d*r)+","+(e.source.y+d*s)+"L"+(e.target.x-l*r)+","+(e.target.y-l*s)}),circle.attr("transform",function(e){return"translate("+e.x+","+e.y+")"})}function mousedown(){svg.classed("active",!0),d3.event.ctrlKey||mousedown_node||mousedown_link||restart()}function mousemove(){mousedown_node&&(drag_line.attr("d","M"+mousedown_node.x+","+mousedown_node.y+"L"+d3.mouse(this)[0]+","+d3.mouse(this)[1]),restart())}function mouseup(){mousedown_node&&drag_line.classed("hidden",!0).style("marker-end",""),svg.classed("active",!1),resetMouseVars()}function spliceLinksForNode(e){links.filter(function(t){return t.source===e||t.target===e}).map(function(e){links.splice(links.indexOf(e),1)})}var lastKeyDown=-1;function keydown(){-1===lastKeyDown&&(lastKeyDown=d3.event.keyCode,17===d3.event.keyCode&&(circle.call(force.drag),svg.classed("ctrl",!0)))}function deleteLink(){selected_node?(nodes.splice(nodes.indexOf(selected_node),1),spliceLinksForNode(selected_node)):selected_link&&links.splice(links.indexOf(selected_link),1),selected_link=null,selected_node=null,restart()}function keyup(){lastKeyDown=-1,17===d3.event.keyCode&&(circle.on("mousedown.drag",null).on("touchstart.drag",null),svg.classed("ctrl",!1))}function sendToModelNode(e){document.getElementById("testText").innerText=e.id,document.getElementById("IdText").innerText=e.idNumber,document.getElementById("typeText").innerText="Node:"}function setTextInView(e){document.getElementById("typeText").innerText="Link:",document.getElementById("IdLinkStart").innerText=e.source.idNumber,document.getElementById("IdLinkTarget").innerText=e.target.idNumber,document.getElementById("testText").innerText='Link between "'+e.source.id+'" and "'+e.target.id+'"'}function addLinkToDB(e){setTextInView(e),document.getElementById("configureLink").click()}function main(){this.svg.on("mousedown",this.mousedown).on("mousemove",mousemove).on("mouseup",mouseup),d3.select(window).on("keydown",keydown).on("keyup",keyup),this.restart()}